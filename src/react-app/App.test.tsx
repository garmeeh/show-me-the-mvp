import { render, screen, waitFor, within } from "@testing-library/react";
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

describe("Stop and errors", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("offers Stop while the Brief streams, and keeps what arrived when pressed", async () => {
    // The stream sends the MVP section, then stays open as if the model were still
    // writing. Like a real fetch, aborting the request breaks off the body.
    const json = JSON.stringify(brief);
    const firstPart = json.slice(0, json.indexOf('"riskiestAssumption"'));
    const fetchMock = vi.fn<typeof fetch>(async (_, init) => {
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(firstPart));
          init?.signal?.addEventListener("abort", () =>
            controller.error(init.signal?.reason),
          );
        },
      });
      return new Response(body);
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<App />);

    await submitIdea("An app for takeaways to take orders");

    expect(
      await screen.findByRole("region", { name: "MVP" }),
    ).toHaveTextContent(brief.mvp);
    expect(
      screen.queryByRole("button", { name: /strip it back/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /stop/i }));

    expect(
      await screen.findByRole("button", { name: /strip it back/i }),
    ).toBeEnabled();
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(screen.getByRole("region", { name: "MVP" })).toHaveTextContent(
      brief.mvp,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error when the Brief request fails, and a resubmit retries", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response("The MVP Brief failed.", { status: 502 }),
        )
        .mockResolvedValueOnce(streamedBrief(brief)),
    );
    render(<App />);

    await submitIdea("An app for takeaways to take orders");

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed/i);

    await submitIdea("An app for takeaways to take orders");

    expect(
      await screen.findByRole("region", { name: "MVP" }),
    ).toHaveTextContent(brief.mvp);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("First-run guidance", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fills the Idea when an example is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    const ideaBox = screen.getByRole("textbox", { name: /your big idea/i });
    const examples = within(
      screen.getByRole("group", { name: /example ideas/i }),
    ).getAllByRole("button");

    expect(examples.length).toBeGreaterThanOrEqual(3);
    expect(examples.length).toBeLessThanOrEqual(4);

    await user.type(ideaBox, "something I half wrote");
    await user.click(examples[1]);

    expect(ideaBox).toHaveValue(examples[1].textContent);
  });

  it("shows the Brief's section titles as an empty sheet until the first submit", async () => {
    // The request stays pending: the sheet must go on submit, not when data arrives.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );
    render(<App />);

    const emptySheet = screen.getByRole("list", {
      name: /your mvp brief will cover/i,
    });
    expect(
      within(emptySheet)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([
      "MVP",
      "For whom",
      "Riskiest Assumption",
      "Build first",
      "Cuts",
      "Success Test",
    ]);

    await submitIdea("An app for takeaways to take orders");

    expect(
      screen.queryByRole("list", { name: /your mvp brief will cover/i }),
    ).not.toBeInTheDocument();
  });

  it.each([
    ["⌘+Enter", "{Meta>}{Enter}{/Meta}"],
    ["Ctrl+Enter", "{Control>}{Enter}{/Control}"],
  ])("submits the Idea with %s", async (_, keys) => {
    const fetchMock = vi.fn<typeof fetch>(async () => streamedBrief(brief));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: /your big idea/i }),
      "An app{Enter}for takeaways",
    );
    await user.keyboard(keys);

    expect(
      await screen.findByRole("region", { name: "MVP" }),
    ).toHaveTextContent(brief.mvp);
    expect(fetchMock).toHaveBeenCalledOnce();
    // A plain Enter is a line break in the Idea, not a submit.
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toBe(
      "An app\nfor takeaways",
    );
  });
});

describe("Copy as Markdown", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("copies the finished Brief as Markdown and confirms it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => streamedBrief(brief)),
    );
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    render(<App />);

    expect(
      screen.queryByRole("button", { name: /copy as markdown/i }),
    ).not.toBeInTheDocument();

    await submitIdea("An app for takeaways to take orders");
    await user.click(
      await screen.findByRole("button", { name: /copy as markdown/i }),
    );

    expect(writeText).toHaveBeenCalledOnce();
    const markdown = writeText.mock.calls[0][0];
    // A heading per section, in the order the Brief reads.
    expect(
      markdown.match(/^## .+$/gm)?.map((heading) => heading.slice(3)),
    ).toEqual([
      "MVP",
      "For whom",
      "Riskiest Assumption",
      "Build first",
      "Cuts",
      "Success Test",
    ]);
    expect(markdown).toContain(brief.mvp);
    expect(markdown).toContain(brief.forWhom);
    expect(markdown).toContain(brief.riskiestAssumption);
    expect(markdown).toContain("1. One order form per restaurant\n");
    expect(markdown).toContain("2. SMS link to the form\n");
    expect(markdown).toMatch(
      /^- .*Payments.*Cash on collection works for now/m,
    );
    expect(markdown).toContain(brief.successTest.question);
    expect(markdown).toMatch(/Pass bar.*10 restaurants each get 5 orders/);
    expect(markdown).toMatch(/If it fails.*Kill it and talk to owners/);
    expect(markdown).toMatch(/How to run it.*Google Form per restaurant/);
    expect(await screen.findByRole("status")).toHaveTextContent(/copied/i);
  });

  it("says so when the clipboard refuses the copy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => streamedBrief(brief)),
    );
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new DOMException("Write permission denied.", "NotAllowedError"),
    );
    render(<App />);

    await submitIdea("An app for takeaways to take orders");
    await user.click(
      await screen.findByRole("button", { name: /copy as markdown/i }),
    );

    const status = await screen.findByRole("status");
    await waitFor(() => expect(status).toHaveTextContent(/couldn't copy/i));
    expect(status).not.toHaveTextContent(/copied/i);
  });

  it("doesn't offer Copy for a Brief that was stopped partway", async () => {
    // Stopped mid-way through the last field: every section has started, so
    // the partial Brief already has the full shape.
    const json = JSON.stringify(brief);
    const firstPart = json.slice(0, json.indexOf("texted by the owner"));
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(async (_, init) => {
        const body = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(firstPart));
            init?.signal?.addEventListener("abort", () =>
              controller.error(init.signal?.reason),
            );
          },
        });
        return new Response(body);
      }),
    );
    const user = userEvent.setup();
    render(<App />);

    await submitIdea("An app for takeaways to take orders");
    await screen.findByText(/Google Form per restaurant/);
    await user.click(screen.getByRole("button", { name: /stop/i }));
    await screen.findByRole("button", { name: /strip it back/i });

    expect(
      screen.queryByRole("button", { name: /copy as markdown/i }),
    ).not.toBeInTheDocument();
  });
});

// A /api/brief stand-in that sends the Brief's JSON up to `upTo`, then stays open
// as if the model were still writing; aborting breaks off the body like a real fetch.
function briefStreamingUntil(upTo: string) {
  const json = JSON.stringify(brief);
  const firstPart = json.slice(0, json.indexOf(upTo));
  return vi.fn<typeof fetch>(async (_, init) => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(firstPart));
        init?.signal?.addEventListener("abort", () =>
          controller.error(init.signal?.reason),
        );
      },
    });
    return new Response(body);
  });
}

const sectionOrder = [
  "MVP",
  "For whom",
  "Riskiest Assumption",
  "Build first",
  "Cuts",
  "Success Test",
];

describe("Empty Idea", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("won't submit a blank Idea by button or keyboard, and says what's needed", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => streamedBrief(brief));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<App />);
    const ideaBox = screen.getByRole("textbox", { name: /your big idea/i });
    const submitButton = screen.getByRole("button", { name: /strip it back/i });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAccessibleDescription(
      /describe an idea or pick an example/i,
    );

    await user.type(ideaBox, "   {Enter}  ");
    await user.click(submitButton);
    await user.keyboard("{Meta>}{Enter}{/Meta}");
    await user.keyboard("{Control>}{Enter}{/Control}");

    expect(submitButton).toBeDisabled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("list", { name: /your mvp brief will cover/i }),
    ).toBeInTheDocument();

    await user.type(ideaBox, "An app for takeaways");

    expect(submitButton).toBeEnabled();
    expect(submitButton).not.toHaveAccessibleDescription();
    expect(
      screen.queryByText(/describe an idea or pick an example/i),
    ).not.toBeInTheDocument();
  });
});

describe("Brief sheet while drafting", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps every section's place and marks the first one Drafting before any data arrives", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );
    render(<App />);

    await submitIdea("An app for takeaways to take orders");

    const briefPane = screen.getByRole("region", { name: "MVP Brief" });
    for (const title of sectionOrder) {
      expect(within(briefPane).getByText(title)).toBeInTheDocument();
    }
    // Placeholders, not cards: no section has data yet.
    expect(
      within(briefPane).queryByRole("region", { name: "MVP" }),
    ).not.toBeInTheDocument();
    const drafting = within(briefPane).getAllByText("Drafting…");
    expect(drafting).toHaveLength(1);
    expect(drafting[0].parentElement).toHaveTextContent("MVP");
  });

  it("fills sections in place as they stream, and drops Drafting when stopped", async () => {
    vi.stubGlobal("fetch", briefStreamingUntil('"riskiestAssumption"'));
    const user = userEvent.setup();
    render(<App />);

    await submitIdea("An app for takeaways to take orders");

    expect(
      await screen.findByRole("region", { name: "For whom" }),
    ).toHaveTextContent(brief.forWhom);
    const briefPane = screen.getByRole("region", { name: "MVP Brief" });
    // Cards and placeholders together still read in story order.
    const text = briefPane.textContent ?? "";
    const positions = sectionOrder.map((title) => text.indexOf(title));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    const drafting = within(briefPane).getAllByText("Drafting…");
    expect(drafting).toHaveLength(1);
    expect(drafting[0].parentElement).toHaveTextContent("Riskiest Assumption");

    await user.click(screen.getByRole("button", { name: /stop/i }));
    await screen.findByRole("button", { name: /strip it back/i });

    expect(screen.queryByText("Drafting…")).not.toBeInTheDocument();
    for (const title of sectionOrder.slice(2)) {
      expect(within(briefPane).getByText(title)).toBeInTheDocument();
    }
  });
});

describe("Brief tied to its Idea", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows which Idea the Brief is for, and flags an edited Idea until resubmitted", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => streamedBrief(brief));
    vi.stubGlobal("fetch", fetchMock);
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    const user = userEvent.setup();
    render(<App />);
    const ideaBox = screen.getByRole("textbox", { name: /your big idea/i });

    expect(screen.queryByText(/^brief for$/i)).not.toBeInTheDocument();

    await submitIdea("  An app for takeaways  ");
    await screen.findByRole("button", { name: /copy as markdown/i });

    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toBe(
      "An app for takeaways",
    );
    expect(screen.getByText(/^brief for$/i).parentElement).toHaveTextContent(
      /^brief forAn app for takeaways$/i,
    );
    expect(screen.queryByText(/idea changed/i)).not.toBeInTheDocument();

    await user.type(ideaBox, "and bakeries");

    expect(screen.getByText(/idea changed/i)).toBeInTheDocument();
    // The Brief still belongs to the submitted Idea, and can still be copied.
    expect(screen.getByText(/^brief for$/i).parentElement).toHaveTextContent(
      /An app for takeaways$/,
    );
    await user.click(screen.getByRole("button", { name: /copy as markdown/i }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain(brief.mvp);

    // Back to the submitted text (whitespace aside): the Brief is current again.
    await user.clear(ideaBox);
    await user.type(ideaBox, "An app for takeaways ");

    expect(screen.queryByText(/idea changed/i)).not.toBeInTheDocument();
  });
});
