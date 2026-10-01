// PROTOTYPE, throw away: Variant B of the Nutritics-inspired theme.
// "Workspace": slim app bar, blue sidebar form, one Brief document with a
// molecule-style progress rail down its edge.
import { useEffect, useId, useState, type ReactNode } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  PlusIcon,
  QuestionIcon,
  StopIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import "@fontsource/anton/400.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import { sectionTitles, successTestTerms } from "@/lib/brief-sections";
import { briefToMarkdown } from "@/lib/brief-markdown";
import type { MvpBrief } from "../../shared/brief";
import { exampleIdeas, type ProtoBrief } from "./use-proto-brief";
import "./variant-b.css";

export const variantBName = "Workspace";

type SectionKey = keyof typeof sectionTitles;
const keys = Object.keys(sectionTitles) as SectionKey[];
type NodeState = "done" | "drafting" | "pending";

export function VariantB({ proto }: { proto: ProtoBrief }) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppBar onNew={proto.reset} />
      <main className="mx-auto grid w-full max-w-[1400px] flex-1 gap-6 px-4 pt-6 pb-24 sm:px-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pt-8">
        <IdeaPanel proto={proto} />
        <BriefDocument proto={proto} />
      </main>
    </div>
  );
}

function AppBar({ onNew }: { onNew: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="?variant=B" className="flex items-center gap-2.5">
          <MoleculeMark className="size-9" />
          <span className="vb-display text-xl text-[#16324a] sm:text-2xl">
            Show me the <span className="text-[#b54c0e]">MVP</span>
          </span>
        </a>
        <Button
          type="button"
          onClick={onNew}
          className="h-10 rounded-full px-5 text-sm font-bold"
        >
          <PlusIcon weight="bold" />
          New idea
        </Button>
      </div>
    </header>
  );
}

// Three atoms joined by bonds: the product mark.
function MoleculeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        d="M10 28 L20 12 L31 26"
        fill="none"
        stroke="#16324a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="12" r="7" fill="#1a6aa1" />
      <circle cx="10" cy="28" r="5.5" fill="#ec671b" />
      <circle cx="31" cy="26" r="4.5" fill="#94c93e" />
    </svg>
  );
}

// Faint molecule drawn into the corner of the blue panel.
function PanelMolecule() {
  return (
    <svg
      viewBox="0 0 200 160"
      aria-hidden
      className="pointer-events-none absolute -top-16 -right-14 w-48 opacity-20"
    >
      <g stroke="white" strokeWidth="3" fill="none">
        <path d="M40 120 L100 60 L165 95 M100 60 L120 15" />
      </g>
      <circle cx="100" cy="60" r="20" fill="white" />
      <circle cx="40" cy="120" r="14" fill="#94c93e" />
      <circle cx="165" cy="95" r="11" fill="white" />
      <circle cx="120" cy="15" r="8" fill="#ec671b" />
    </svg>
  );
}

function IdeaPanel({ proto }: { proto: ProtoBrief }) {
  const { idea, setIdea, canSubmit, isLoading } = proto;
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <form
        className="relative flex flex-col gap-5 overflow-hidden rounded-[36px] bg-[#1a6aa1] p-6 text-white shadow-[0_20px_50px_-24px_rgb(26_106_161/0.7)] sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          proto.submit();
        }}
      >
        <PanelMolecule />
        <div className="relative flex flex-col gap-2">
          <label htmlFor="vb-idea" className="vb-display text-4xl">
            Your big idea
          </label>
          <p className="text-[15px] text-white/85">
            Describe it in a sentence or two. We'll strip it back to the
            smallest version worth shipping.
          </p>
        </div>
        <Textarea
          id="vb-idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              if (canSubmit && !isLoading) {
                event.currentTarget.form?.requestSubmit();
              }
            }
          }}
          placeholder="An app that…"
          className="relative max-h-[40svh] min-h-36 rounded-3xl border-0 bg-white px-5 py-4 text-base text-[#2b2b2b] shadow-inner placeholder:text-[#7a7a7a] focus-visible:ring-4 focus-visible:ring-[#94c93e] md:text-base"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {isLoading ? (
            <Button
              key="stop"
              type="button"
              variant="ghost"
              onClick={proto.stop}
              className="h-12 rounded-full border-2 border-white px-6 text-base font-bold text-white hover:bg-white/15 hover:text-white"
            >
              <StopIcon weight="fill" />
              Stop
            </Button>
          ) : (
            <Button
              key="submit"
              type="submit"
              disabled={!canSubmit}
              aria-describedby={canSubmit ? undefined : "vb-idea-required"}
              className="h-12 rounded-full px-7 text-base font-bold shadow-lg shadow-black/15 hover:bg-[#d95a12] disabled:bg-white/20 disabled:text-white/80 disabled:opacity-100 disabled:shadow-none"
            >
              Strip it back
              <ArrowRightIcon weight="bold" />
            </Button>
          )}
          <KbdGroup className="text-xs text-white/80">
            <Kbd className="bg-white/15 text-white">⌘/Ctrl</Kbd>+
            <Kbd className="bg-white/15 text-white">Enter</Kbd>
          </KbdGroup>
        </div>
        {!canSubmit && !isLoading && (
          <p id="vb-idea-required" className="-mt-2 text-sm text-white/80">
            Describe an idea or pick an example below.
          </p>
        )}
        <div
          role="group"
          aria-labelledby="vb-examples"
          className="flex flex-col gap-2 border-t border-white/20 pt-5"
        >
          <p
            id="vb-examples"
            className="text-xs font-semibold tracking-[0.12em] text-white/80 uppercase"
          >
            Or start from an example
          </p>
          <ul className="flex flex-col gap-1.5">
            {exampleIdeas.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => setIdea(example)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm leading-snug text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white",
                    idea === example ? "bg-white/20" : "bg-white/[0.07]",
                  )}
                >
                  <span className="size-2 shrink-0 rounded-full bg-[#94c93e]" />
                  <span className="flex-1">{example}</span>
                  <ArrowRightIcon className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </aside>
  );
}

function BriefDocument({ proto }: { proto: ProtoBrief }) {
  const { brief, submittedIdea, isLoading, isComplete, error, idea } = proto;
  const isStale =
    submittedIdea !== null && !isLoading && idea.trim() !== submittedIdea;

  return (
    <section aria-label="MVP Brief" aria-busy={isLoading} className="min-w-0">
      {error && (
        <Alert
          variant="destructive"
          className="mb-4 rounded-3xl border-[#b3261e]/30 bg-[#fdecea] px-5 py-3"
        >
          <AlertDescription className="text-base text-[#8c1d17]">
            The MVP Brief failed. Submit your Idea again to retry.
          </AlertDescription>
        </Alert>
      )}
      <article className="overflow-hidden rounded-[36px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(22_50_74/0.35)] ring-1 ring-black/5">
        <DocHeader
          submittedIdea={submittedIdea}
          brief={isComplete ? (brief as MvpBrief) : null}
          isLoading={isLoading}
          isStale={isStale}
        />
        <div className={cn("transition-opacity", isStale && "opacity-45")}>
          {brief?.needsMoreInfo ? (
            <NeedsInfo message={brief.needsMoreInfo} />
          ) : (
            <Rail proto={proto} />
          )}
        </div>
      </article>
    </section>
  );
}

function DocHeader({
  submittedIdea,
  brief,
  isLoading,
  isStale,
}: {
  submittedIdea: string | null;
  brief: MvpBrief | null;
  isLoading: boolean;
  isStale: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-[#fafbfc] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#b54c0e] uppercase">
          {submittedIdea === null ? "MVP Brief" : "Brief for"}
        </p>
        <p className="mt-1 text-lg leading-snug font-medium text-[#16324a]">
          {submittedIdea ?? "Your Brief will appear here, section by section."}
        </p>
        {isStale && (
          <p className="mt-1 text-sm text-[#b54c0e]">
            Idea changed: strip it back again to update the Brief.
          </p>
        )}
        {isLoading && (
          <p className="mt-1 flex items-center gap-2 text-sm text-[#5b5b5b]">
            <span className="size-2 animate-pulse rounded-full bg-[#ec671b]" />
            Drafting your Brief…
          </p>
        )}
      </div>
      {brief && <CopyPill brief={brief} />}
    </div>
  );
}

function CopyPill({ brief }: { brief: MvpBrief }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span role="status" className="text-sm text-[#5b5b5b]">
        {state === "copied" && "Copied"}
        {state === "failed" && "Couldn't copy"}
      </span>
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(briefToMarkdown(brief));
            setState("copied");
          } catch {
            setState("failed");
          }
        }}
        className="h-10 rounded-full border-2 border-[#1a6aa1] bg-white px-5 text-sm font-semibold text-[#1a6aa1] hover:bg-[#e8f0f7] hover:text-[#16324a]"
      >
        {state === "copied" ? (
          <CheckIcon weight="bold" />
        ) : (
          <CopyIcon weight="bold" />
        )}
        Copy as Markdown
      </Button>
    </div>
  );
}

function NeedsInfo({ message }: { message: string }) {
  const headingId = useId();
  return (
    <div
      role="region"
      aria-labelledby={headingId}
      className="flex flex-col items-start gap-5 px-6 py-10 sm:flex-row sm:px-10 sm:py-14"
    >
      <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#94c93e] text-[#16324a]">
        <QuestionIcon weight="bold" className="size-8" />
      </span>
      <div className="flex max-w-[56ch] flex-col gap-3">
        <h2 id={headingId} className="vb-display text-4xl text-[#16324a]">
          Tell us a little <span className="text-[#b54c0e]">more</span>
        </h2>
        <p className="text-xl leading-relaxed text-[#3f3f3f]">{message}</p>
        <p className="text-[15px] text-[#5b5b5b]">
          Add the detail to your idea on the left, then strip it back again.
        </p>
      </div>
    </div>
  );
}

function Rail({ proto }: { proto: ProtoBrief }) {
  const brief = proto.brief ?? {};
  const started = proto.submittedIdea !== null;
  const buildFirst = brief.buildFirst?.filter(Boolean) ?? [];
  const cuts = brief.cuts?.filter((c) => c?.feature) ?? [];
  const test = brief.successTest;

  const bodies: Record<SectionKey, ReactNode> = {
    mvp: brief.mvp && (
      <p className="vb-display text-[1.75rem] text-[#16324a] sm:text-4xl">
        {brief.mvp}
      </p>
    ),
    forWhom: brief.forWhom && (
      <p className="text-lg leading-relaxed">{brief.forWhom}</p>
    ),
    riskiestAssumption: brief.riskiestAssumption && (
      <p className="border-l-4 border-[#ec671b] pl-4 text-lg leading-relaxed text-[#2b2b2b]">
        {brief.riskiestAssumption}
      </p>
    ),
    buildFirst: buildFirst.length > 0 && (
      <ul className="grid gap-2 sm:grid-cols-2">
        {buildFirst.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl bg-[#f4f6f8] px-4 py-3"
          >
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#94c93e] text-[#16324a]">
              <CheckIcon weight="bold" className="size-3" />
            </span>
            <span className="leading-snug text-[#2b2b2b]">{item}</span>
          </li>
        ))}
      </ul>
    ),
    cuts: cuts.length > 0 && (
      <ul className="divide-y divide-border">
        {cuts.map((cut, i) => (
          <li
            key={i}
            className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-6"
          >
            <span className="font-semibold text-[#b54c0e] line-through decoration-2 sm:w-56 sm:shrink-0">
              {cut?.feature}
            </span>
            {cut?.reason && (
              <span className="text-[#5b5b5b]">{cut.reason}</span>
            )}
          </li>
        ))}
      </ul>
    ),
    successTest: test?.question && (
      <div className="flex flex-col gap-6">
        <p className="vb-display text-2xl text-white sm:text-3xl">
          {test.question}
        </p>
        <dl className="grid gap-4 md:grid-cols-3">
          {(Object.keys(successTestTerms) as (keyof typeof successTestTerms)[])
            .filter((k) => test[k])
            .map((k) => (
              <div key={k} className="rounded-3xl bg-white/12 p-5">
                <dt className="text-xs font-bold tracking-[0.12em] text-white uppercase">
                  {successTestTerms[k]}
                </dt>
                <dd className="mt-2 leading-relaxed text-white">{test[k]}</dd>
              </div>
            ))}
        </dl>
      </div>
    ),
  };

  const next = proto.isLoading ? keys.find((k) => !bodies[k]) : undefined;
  const stateOf = (k: SectionKey): NodeState =>
    bodies[k] ? "done" : k === next ? "drafting" : "pending";
  const steps = keys.slice(0, -1);

  return (
    <>
      <div className="px-6 pt-8 sm:px-10 sm:pt-10">
        {steps.map((k, i) => (
          <Step
            key={k}
            index={i + 1}
            title={sectionTitles[k]}
            state={stateOf(k)}
            started={started}
            connectorAfter
          >
            {bodies[k]}
          </Step>
        ))}
      </div>
      <div
        className={cn(
          "px-6 pt-8 pb-10 sm:px-10",
          bodies.successTest ? "bg-[#b9115b] text-white" : "bg-[#fafbfc]",
        )}
      >
        <Step
          index={keys.length}
          title={sectionTitles.successTest}
          state={stateOf("successTest")}
          started={started}
          connectorBefore
          onBand={!!bodies.successTest}
        >
          {bodies.successTest}
        </Step>
      </div>
    </>
  );
}

function Step({
  index,
  title,
  state,
  started,
  connectorAfter = false,
  connectorBefore = false,
  onBand = false,
  children,
}: {
  index: number;
  title: string;
  state: NodeState;
  started: boolean;
  connectorAfter?: boolean;
  connectorBefore?: boolean;
  onBand?: boolean;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6",
        connectorAfter && "pb-10",
      )}
    >
      {connectorBefore && (
        <span
          aria-hidden
          className={cn(
            "absolute -top-8 left-[19px] h-8 w-[3px] sm:left-[22.5px]",
            onBand ? "bg-white/70" : "bg-[#dfe3e8]",
          )}
        />
      )}
      {connectorAfter && (
        <span
          aria-hidden
          className={cn(
            "absolute top-10 -bottom-8 left-[19px] w-[3px] rounded-full sm:top-12 sm:-bottom-10 sm:left-[22.5px]",
            state === "done" ? "bg-[#1a6aa1]" : "bg-[#dfe3e8]",
          )}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "relative z-10 grid size-10 place-items-center rounded-full text-base font-bold sm:size-12 sm:text-lg",
          onBand && "bg-white text-[#b9115b]",
          !onBand && state === "done" && "bg-[#1a6aa1] text-white",
          state === "drafting" && "vb-pulse bg-[#ec671b] text-white",
          state === "pending" &&
            "border-[3px] border-[#cfd6de] bg-white text-[#8a949e]",
        )}
      >
        {index}
      </span>
      <div className="flex min-h-10 flex-col justify-center gap-3 sm:min-h-12">
        <div className="flex items-center gap-3">
          <h2
            id={headingId}
            className={cn(
              "vb-label text-[#16324a]",
              onBand && "text-white",
              state === "pending" && "text-[#5b5b5b]",
            )}
          >
            {title}
          </h2>
          {state === "drafting" && (
            <span className="rounded-full bg-[#fdeee4] px-2.5 py-0.5 text-xs font-semibold text-[#b54c0e]">
              Drafting…
            </span>
          )}
        </div>
        {children ??
          (state !== "done" && (
            <div aria-hidden className="flex flex-col gap-2">
              <span
                className={cn(
                  "h-3 w-3/4 rounded-full bg-[#eef1f4]",
                  state === "drafting" && "animate-pulse bg-[#fbe3d4]",
                )}
              />
              {!started && (
                <span className="h-3 w-1/2 rounded-full bg-[#f2f4f6]" />
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
