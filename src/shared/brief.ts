import { z } from "zod";

// The MVP Brief, shared by the worker (to constrain the model) and the client
// (to read the stream). Field order is the order sections stream in and render.
export const mvpBriefSchema = z.object({
  // Nullable rather than optional: strict structured outputs require every key.
  needsMoreInfo: z
    .string()
    .nullable()
    .describe(
      "Set only when the Idea is too vague to judge: what information is missing. Otherwise null.",
    ),
  mvp: z.string().describe("The MVP in one line."),
  forWhom: z.string().describe("One narrow first user."),
  riskiestAssumption: z
    .string()
    .describe("The belief that, if false, kills the Idea."),
  buildFirst: z
    .array(z.string())
    .describe("Three to five things to build first."),
  cuts: z
    .array(
      z.object({
        feature: z.string(),
        reason: z.string().describe("Why this feature can wait."),
      }),
    )
    .describe("Tempting features deliberately left out of the MVP."),
  successTest: z.object({
    question: z
      .string()
      .describe("A question answered by real behaviour, not opinion."),
    passBar: z
      .string()
      .describe("The bar that counts as a pass, with a number and timeframe."),
    ifItFails: z.string().describe("What to do if it fails: kill or pivot."),
    howToRun: z
      .string()
      .describe("A scrappy way to run it, often without code."),
  }),
});

export type MvpBrief = z.infer<typeof mvpBriefSchema>;
