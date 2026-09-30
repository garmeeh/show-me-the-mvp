import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MvpBrief } from "../shared/brief";
import App from "./App";

const brief: MvpBrief = {
  needsMoreInfo: null,
  mvp: "A shared order sheet restaurants text to regulars each Friday",
  forWhom: "Owner-run takeaways in one town with a regulars list",
  riskiestAssumption: "Regulars will order from a text link instead of phoning",
  buildFirst: ["One order form per restaurant", "SMS link to the form"],
  cuts: [{ feature: "Payments", reason: "Cash on collection works for now" }],
  successTest: {
    question: "Will regulars place real orders through a texted link?",
    passBar: "10 restaurants each get 5 orders in 2 weeks",
    ifItFails: "Kill it and talk to owners about phone-order pain instead",
    howToRun: "Google Form per restaurant, texted by the owner",
  },
};

// Stands in for /api/brief: the Brief's JSON text, streamed in two pieces.
function streamedBrief(value: MvpBrief): Response {
  const json = JSON.stringify(value);
  const mid = Math.floor(json.length / 2);
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(json.slice(0, mid)));
      controller.enqueue(encoder.encode(json.slice(mid)));
      controller.close();
    },
  });
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

async function submitIdea(idea: string) {
  const user = userEvent.setup();
  const ideaBox = screen.getByRole("textbox", { name: /your big idea/i });
  await user.clear(ideaBox);
  await user.type(ideaBox, idea);
  await user.click(screen.getByRole("button", { name: /strip it back/i }));
}

describe("MVP Brief", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the Brief sections for a submitted Idea", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => streamedBrief(brief));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    await submitIdea("An app for takeaways to take orders");

    expect(
      await screen.findByText(brief.successTest.passBar),
    ).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("/api/brief");
    expect(JSON.parse(String(init?.body))).toBe(
      "An app for takeaways to take orders",
    );

    const mvp = screen.getByRole("region", { name: "MVP" });
    expect(mvp).toHaveTextContent(brief.mvp);
    expect(screen.getByRole("region", { name: "For whom" })).toHaveTextContent(
      brief.forWhom,
    );
    expect(
      screen.getByRole("region", { name: "Riskiest Assumption" }),
    ).toHaveTextContent(brief.riskiestAssumption);
    const buildFirst = screen.getByRole("region", { name: "Build first" });
    expect(
      within(buildFirst)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(brief.buildFirst);
    const cuts = screen.getByRole("region", { name: "Cuts" });
    expect(cuts).toHaveTextContent("Payments");
    expect(cuts).toHaveTextContent("Cash on collection works for now");
    const successTest = screen.getByRole("region", { name: "Success Test" });
    expect(successTest).toHaveTextContent(brief.successTest.question);
    expect(successTest).toHaveTextContent(brief.successTest.ifItFails);
    expect(successTest).toHaveTextContent(brief.successTest.howToRun);
  });

  it("replaces the Brief when an edited Idea is submitted", async () => {
    const revised: MvpBrief = {
      ...brief,
      mvp: "A pre-order page for one bakery's Saturday bake",
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(streamedBrief(brief))
        .mockResolvedValueOnce(streamedBrief(revised)),
    );
    render(<App />);

    await submitIdea("An app for takeaways");
    await screen.findByText(brief.mvp);
    await submitIdea("An app for bakeries");

    expect(await screen.findByText(revised.mvp)).toBeInTheDocument();
    expect(screen.queryByText(brief.mvp)).not.toBeInTheDocument();
  });

  it("asks for what's missing instead of a Brief when the Idea is too vague", async () => {
    const message =
      "Who is it for, and what does it do for them? Say what problem it solves.";
    // Sections filled in too, so the test proves the message hides them.
    const vague: MvpBrief = { ...brief, needsMoreInfo: message };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(streamedBrief(vague))
        .mockResolvedValueOnce(streamedBrief(brief)),
    );
    render(<App />);

    await submitIdea("hi");

    expect(
      await screen.findByRole("region", { name: /needs more info/i }),
    ).toHaveTextContent(message);
    expect(
      screen.queryByRole("region", { name: "MVP" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Success Test" }),
    ).not.toBeInTheDocument();

    await submitIdea("An app for takeaways to take orders");

    expect(
      await screen.findByRole("region", { name: "MVP" }),
    ).toHaveTextContent(brief.mvp);
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});
