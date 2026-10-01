// PROTOTYPE, throw away: shared state for the Nutritics-inspired theme variants.
// Same streaming call as App.tsx, plus a sample Brief so a variant can be judged
// fully populated without waiting on the model.
import { useState } from "react";
import { useObject } from "@ai-sdk/react";
import type { DeepPartial } from "ai";
import { mvpBriefSchema, type MvpBrief } from "../../shared/brief";

export const exampleIdeas = [
  "An app where local restaurants take takeaway orders without paying Deliveroo's fees",
  "A marketplace matching dog owners with vetted neighbours for holiday pet-sitting",
  "An AI tutor that turns a student's lecture notes into daily spaced-repetition quizzes",
  "A platform for freelance designers to send invoices, chase late payers and file taxes",
];

export const sampleBrief: MvpBrief = {
  needsMoreInfo: null,
  mvp: "A single ordering page per restaurant that sends takeaway orders straight to the kitchen by SMS, with card payment and no commission.",
  forWhom:
    "Independent takeaways in one town already losing 30% of each order to delivery apps.",
  riskiestAssumption:
    "Regular customers will order direct from a link if it's cheaper, instead of opening the app they already use.",
  buildFirst: [
    "Menu page generated from a photo of the paper menu",
    "Card checkout with Stripe",
    "Order sent to the kitchen phone by SMS",
    "QR code flyer for the bag",
  ],
  cuts: [
    {
      feature: "Driver dispatch",
      reason: "Restaurants already have their own drivers or do collection.",
    },
    {
      feature: "Loyalty points",
      reason: "Price is the hook first; loyalty can wait until people return.",
    },
    {
      feature: "Multi-restaurant marketplace",
      reason:
        "Each restaurant brings its own customers; discovery isn't the problem.",
    },
  ],
  successTest: {
    question:
      "Will a restaurant's regulars switch to ordering direct within a month?",
    passBar: "20% of one restaurant's orders come direct within 4 weeks.",
    ifItFails:
      "Pivot to a reorder button inside the existing apps' receipts, or kill.",
    howToRun:
      "Hand-build the page for two restaurants, put flyers in every bag, count SMS orders.",
  },
};

export const sampleNeedsInfo: DeepPartial<MvpBrief> = {
  needsMoreInfo:
    "Who is this for, and what do they do today instead? 'An app for food' could be a dozen different products.",
};

export function useProtoBrief() {
  const [idea, setIdea] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState<string | null>(null);
  const [sample, setSample] = useState<DeepPartial<MvpBrief> | null>(null);
  const { object, submit, stop, isLoading, error } = useObject({
    api: "/api/brief",
    schema: mvpBriefSchema,
  });

  const trimmedIdea = idea.trim();
  const canSubmit = trimmedIdea !== "";
  const brief: DeepPartial<MvpBrief> | undefined = sample ?? object;
  // A finished Brief is one that isn't streaming and has a success test.
  const isComplete =
    !isLoading && !brief?.needsMoreInfo && !!brief?.successTest?.howToRun;

  return {
    idea,
    setIdea,
    canSubmit,
    submittedIdea,
    brief,
    isLoading,
    isComplete,
    error,
    stop,
    submit() {
      if (!canSubmit) return;
      setSample(null);
      setSubmittedIdea(trimmedIdea);
      submit(trimmedIdea);
    },
    // Instant fully-populated states for judging the layout.
    loadSample() {
      setIdea(exampleIdeas[0]);
      setSubmittedIdea(exampleIdeas[0]);
      setSample(sampleBrief);
    },
    loadNeedsInfo() {
      setIdea("An app for food");
      setSubmittedIdea("An app for food");
      setSample(sampleNeedsInfo);
    },
    reset() {
      setIdea("");
      setSubmittedIdea(null);
      setSample(null);
    },
  };
}

export type ProtoBrief = ReturnType<typeof useProtoBrief>;
