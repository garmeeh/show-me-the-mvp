import { createGateway } from "@ai-sdk/gateway";
import {
  createTextStreamResponse,
  Output,
  streamText,
  type TextStreamPart,
  type ToolSet,
} from "ai";
import { mvpBriefSchema } from "../shared/brief";

// The one place the model is chosen.
export const BRIEF_MODEL = "openai/gpt-6-luna";

const instructions = `You strip a founder's Idea back to the smallest MVP worth building, and a test that proves or kills it.

Audience: indie hackers and early founders. Be direct and specific to this Idea. No encouragement, no hedging, no generic startup advice.

- needsMoreInfo: null when the Idea can be judged. When it is too vague to judge (a greeting, a single word, something that isn't a product idea such as a recipe), never invent a Brief: set needsMoreInfo to a short message naming exactly what is missing, such as who it's for or what it does, and leave every other field empty ("" for text, [] for lists).

- mvp: one line naming exactly what gets shipped.
- forWhom: one narrow first user, specific enough to find ten of them this week. Never "everyone" or a broad market.
- riskiestAssumption: the single belief that, if false, kills the Idea.
- buildFirst: three to five concrete things to build first, smallest first.
- cuts: the tempting features the founder will want, each with the reason it can wait.
- successTest: tests the riskiest assumption with real behaviour.
  - question: a question answered by what people do, such as "Can 10 restaurants get real customers to place orders through it?".
  - passBar: a number and a timeframe, such as "10 paid orders in 14 days".
  - ifItFails: the decision to take, kill it or a named pivot.
  - howToRun: a scrappy way to run it, such as a landing page, a concierge service or a manual process. Prefer no code.
  - Vanity signals never count: praise, likes, friends or family signing up, waitlist sign-ups without commitment, or answers to "would you use it?".`;

export async function streamBrief(
  idea: string,
  apiKey: string,
): Promise<Response> {
  const gateway = createGateway({ apiKey });

  const result = streamText({
    model: gateway(BRIEF_MODEL),
    reasoning: "low",
    output: Output.object({ schema: mvpBriefSchema }),
    instructions,
    prompt: idea,
    onError: ({ error }) => {
      console.error("MVP Brief stream failed", error);
    },
  });

  // Error parts become a stream error, so a failed run never reads as an empty success.
  const textReader = result.stream
    .pipeThrough(
      new TransformStream<TextStreamPart<ToolSet>, string>({
        transform(part, controller) {
          if (part.type === "text-delta") controller.enqueue(part.text);
          if (part.type === "error") controller.error(part.error);
        },
      }),
    )
    .getReader();

  // Hold the status until the first text arrives: a Gateway failure, or a run that
  // writes nothing, is a 502 rather than an empty success.
  let firstChunk: string;
  try {
    const first = await textReader.read();
    if (first.done) {
      console.error("MVP Brief stream ended without any text");
      return briefFailed();
    }
    firstChunk = first.value;
  } catch {
    return briefFailed();
  }

  return createTextStreamResponse({
    stream: new ReadableStream<string>({
      start(controller) {
        controller.enqueue(firstChunk);
      },
      async pull(controller) {
        const { done, value } = await textReader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      },
      cancel(reason) {
        return textReader.cancel(reason);
      },
    }),
  });
}

function briefFailed(): Response {
  return new Response("The MVP Brief failed.", { status: 502 });
}
