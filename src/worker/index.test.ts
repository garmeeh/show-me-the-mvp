import { afterEach, describe, expect, it, vi } from "vitest";
import { mvpBriefSchema, type MvpBrief } from "../shared/brief";
import app from "./index";

describe("API routing", () => {
  it("returns 404 for an unknown API route", async () => {
    const res = await app.request("/api/nope");

    expect(res.status).toBe(404);
  });

  it("returns 404 for a method the route does not handle", async () => {
    const res = await app.request("/api/", { method: "POST" });

    expect(res.status).toBe(404);
  });
});

const brief: MvpBrief = {
  needsMoreInfo: null,
  mvp: "A shared order sheet restaurants text to regulars each Friday",
  forWhom: "Owner-run takeaways in one town with a regulars list",
  riskiestAssumption: "Regulars will order from a text link instead of phoning",
  buildFirst: [
    "One order form per restaurant",
    "SMS link to the form",
    "Order email to the owner",
  ],
  cuts: [{ feature: "Payments", reason: "Cash on collection works for now" }],
  successTest: {
    question: "Will regulars place real orders through a texted link?",
    passBar: "10 restaurants each get 5 orders in 2 weeks",
    ifItFails: "Kill it and talk to owners about phone-order pain instead",
    howToRun: "Google Form per restaurant, texted by the owner",
  },
};

// Stands in for the Vercel AI Gateway: an SSE stream of language-model parts
// that spells out the Brief as JSON text, split so it arrives in pieces.
function gatewayStream(json: string): Response {
  const mid = Math.floor(json.length / 2);
  const parts = [
    { type: "stream-start", warnings: [] },
    { type: "text-start", id: "t" },
    { type: "text-delta", id: "t", delta: json.slice(0, mid) },
    { type: "text-delta", id: "t", delta: json.slice(mid) },
    { type: "text-end", id: "t" },
    {
      type: "finish",
      finishReason: { unified: "stop", raw: "stop" },
      usage: {
        inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 1, text: 1, reasoning: 0 },
      },
    },
  ];
  const body = parts.map((p) => `data: ${JSON.stringify(p)}\n\n`).join("");
  return new Response(body, {
    headers: { "content-type": "text/event-stream" },
  });
}

function postIdea(idea: string) {
  return app.request(
    "/api/brief",
    { method: "POST", body: JSON.stringify(idea) },
    { AI_GATEWAY_API_KEY: "test-gateway-key" },
  );
}

describe("POST /api/brief", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("streams the MVP Brief for an Idea", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => gatewayStream(JSON.stringify(brief))),
    );

    const res = await postIdea("An app for takeaways to take orders");

    expect(res.status).toBe(200);
    expect(mvpBriefSchema.parse(JSON.parse(await res.text()))).toEqual(brief);
  });

  it("streams a needs-more-info message for an Idea too vague to judge", async () => {
    const needsMoreInfo: MvpBrief = {
      needsMoreInfo:
        "Who is it for, and what does it do for them? Say what problem it solves.",
      mvp: "",
      forWhom: "",
      riskiestAssumption: "",
      buildFirst: [],
      cuts: [],
      successTest: { question: "", passBar: "", ifItFails: "", howToRun: "" },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => gatewayStream(JSON.stringify(needsMoreInfo))),
    );

    const res = await postIdea("hi");

    expect(res.status).toBe(200);
    expect(mvpBriefSchema.parse(JSON.parse(await res.text()))).toEqual(
      needsMoreInfo,
    );
  });

  it("sends the key and the Luna model to the Gateway", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      gatewayStream(JSON.stringify(brief)),
    );
    vi.stubGlobal("fetch", fetchMock);

    await (await postIdea("An app for takeaways")).text();

    const [, init] = fetchMock.mock.calls[0];
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer test-gateway-key");
    expect(headers.get("ai-language-model-id")).toBe("openai/gpt-6-luna");
    expect(String(init?.body)).toContain("An app for takeaways");
  });

  it("fails the request instead of streaming an empty success when the Gateway errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: { message: "Invalid API key", type: "authentication_error" },
          },
          { status: 401 },
        ),
      ),
    );

    const res = await postIdea("An app for takeaways");

    expect(res.status).toBe(502);
    expect(await res.text()).not.toBe("");
  });

  it("breaks off the stream when the Gateway fails partway through", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const parts = [
      { type: "stream-start", warnings: [] },
      { type: "text-start", id: "t" },
      {
        type: "text-delta",
        id: "t",
        delta: '{"needsMoreInfo":null,"mvp":"A sh',
      },
      { type: "error", error: { message: "Upstream overloaded" } },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            parts.map((p) => `data: ${JSON.stringify(p)}\n\n`).join(""),
            { headers: { "content-type": "text/event-stream" } },
          ),
      ),
    );

    const res = await postIdea("An app for takeaways");

    await expect(res.text()).rejects.toThrow();
  });

  it("fails the request when the Gateway finishes without writing a Brief", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => gatewayStream("")),
    );

    const res = await postIdea("An app for takeaways");

    expect(res.status).toBe(502);
  });

  it("fails the request when the Gateway key is missing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: { message: "Missing API key", type: "authentication_error" },
          },
          { status: 401 },
        ),
      ),
    );

    const res = await app.request(
      "/api/brief",
      { method: "POST", body: JSON.stringify("An app for takeaways") },
      {},
    );

    expect(res.status).toBe(502);
  });
});
