// PROTOTYPE, throw away: Variant A of the Nutritics-inspired theme.
// Marketing-site structure: blue hero band holding the Idea form, then the
// Brief as a bento grid of rounded tiles.
import { useEffect, useId, useState, type ReactNode } from "react";
import type { DeepPartial } from "ai";
import { cn } from "cn";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import { sectionTitles, successTestTerms } from "@/lib/brief-sections";
import { briefToMarkdown } from "@/lib/brief-markdown";
import type { MvpBrief } from "../../shared/brief";
import { exampleIdeas, type ProtoBrief } from "./use-proto-brief";
import "./variant-a.css";

export const variantAName = "Hero panel";

type SectionKey = keyof typeof sectionTitles;

export function VariantA({ proto }: { proto: ProtoBrief }) {
  const { idea, submittedIdea, brief, isLoading, isComplete, error } = proto;
  const briefIsStale =
    submittedIdea !== null && !isLoading && idea.trim() !== submittedIdea;

  return (
    <div className="min-h-svh pb-28">
      <Hero proto={proto} />

      <section
        aria-label="MVP Brief"
        aria-busy={isLoading}
        className="mx-auto max-w-6xl px-4 pt-14 sm:px-8 lg:pt-20"
      >
        {error && (
          <Alert
            variant="destructive"
            className="mb-8 rounded-3xl border-2 border-destructive/40 bg-destructive/5 px-6 py-4"
          >
            <AlertDescription className="text-base text-destructive">
              The MVP Brief failed. Submit your Idea again to retry.
            </AlertDescription>
          </Alert>
        )}

        {submittedIdea === null ? (
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-[0.12em] text-[#b54c0e] uppercase">
              What you'll get
            </p>
            <h2 className="text-4xl text-heading sm:text-5xl">
              One page. Six answers.
            </h2>
          </div>
        ) : (
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-3xl flex-col gap-2">
              <p className="text-sm font-semibold tracking-[0.12em] text-[#b54c0e] uppercase">
                Brief for
              </p>
              <p className="text-xl leading-snug font-medium text-heading sm:text-2xl">
                {submittedIdea}
              </p>
              {briefIsStale && (
                <p className="text-sm font-medium text-[#b54c0e]">
                  Idea changed: strip it back again to update the Brief.
                </p>
              )}
            </div>
            {isComplete && brief && <CopyPill brief={brief as MvpBrief} />}
          </header>
        )}

        <div className={cn("transition-opacity", briefIsStale && "opacity-40")}>
          <BentoBrief brief={brief ?? {}} drafting={isLoading} />
        </div>
      </section>
    </div>
  );
}

function Hero({ proto }: { proto: ProtoBrief }) {
  const { idea, setIdea, canSubmit, isLoading, stop, submit } = proto;
  return (
    <header className="va-hero relative overflow-hidden text-white">
      <Molecule />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 pb-20 sm:px-8 sm:pb-24 lg:pb-28">
        <p className="va-display flex items-center gap-2.5 text-xl tracking-[0.04em]">
          <span
            aria-hidden
            className="inline-flex size-7 items-center justify-center rounded-full bg-white"
          >
            <span className="size-2.5 rounded-full bg-[#ec671b]" />
          </span>
          Show me the MVP
        </p>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <h1 className="text-[clamp(3rem,7.5vw,6.25rem)] text-white">
              Strip your big idea back to the <em>MVP</em>
            </h1>
            <p className="max-w-[44ch] text-lg leading-relaxed text-white/90 sm:text-xl">
              Describe your big idea. Show me the MVP turns it into the smallest
              version worth shipping.
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <label
              htmlFor="va-idea"
              className="text-sm font-semibold tracking-[0.12em] uppercase"
            >
              Your big idea
            </label>
            <Textarea
              id="va-idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  if (canSubmit && !isLoading)
                    event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="An app that…"
              className="va-idea max-h-[50svh] min-h-36 md:text-lg"
            />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {isLoading ? (
                <Button
                  key="stop"
                  type="button"
                  variant="outline"
                  onClick={stop}
                  className="va-pill h-14 border-2 border-white bg-transparent px-8 text-lg font-bold text-white hover:bg-white/15 hover:text-white"
                >
                  Stop
                </Button>
              ) : (
                <Button
                  key="submit"
                  type="submit"
                  disabled={!canSubmit}
                  aria-describedby={canSubmit ? undefined : "va-idea-required"}
                  className="va-pill h-14 px-9 text-lg font-bold shadow-[0_12px_28px_-10px_rgb(0_0_0/0.5)] hover:bg-[#d95a12] focus-visible:ring-4 focus-visible:ring-white disabled:bg-white/20 disabled:text-white/80 disabled:opacity-100 disabled:shadow-none"
                >
                  Strip it back
                </Button>
              )}
              <KbdGroup className="text-sm text-white/85">
                <Kbd className="rounded-md bg-white/15 px-1.5 text-white">
                  ⌘/Ctrl
                </Kbd>
                +
                <Kbd className="rounded-md bg-white/15 px-1.5 text-white">
                  Enter
                </Kbd>
              </KbdGroup>
            </div>
            {!canSubmit && !isLoading && (
              <p id="va-idea-required" className="text-sm text-white/85">
                Describe an idea or pick an example.
              </p>
            )}
            <div
              role="group"
              aria-labelledby="va-examples-label"
              className="mt-3 flex flex-col gap-3"
            >
              <p
                id="va-examples-label"
                className="text-sm font-semibold tracking-[0.12em] uppercase"
              >
                Try an example
              </p>
              <div className="flex flex-wrap gap-2.5">
                {exampleIdeas.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setIdea(example)}
                    className="va-pill border-2 border-white/80 px-4 py-1.5 text-left text-sm leading-snug font-medium text-white transition-colors hover:bg-white hover:text-[#1a6aa1] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#94c93e]"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}

// Our own molecule motif: big faint rings joined by lines, 10% white.
function Molecule() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMaxYMin slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.12]"
      fill="none"
      stroke="currentColor"
    >
      <g strokeWidth="3">
        <line x1="1010" y1="120" x2="820" y2="330" />
        <line x1="820" y1="330" x2="1080" y2="520" />
        <line x1="820" y1="330" x2="640" y2="690" />
        <line x1="1010" y1="120" x2="1180" y2="-40" />
      </g>
      <circle cx="1010" cy="120" r="150" strokeWidth="3" />
      <circle cx="1080" cy="520" r="110" strokeWidth="3" />
      <circle cx="640" cy="690" r="42" strokeWidth="3" />
      <circle cx="1180" cy="-40" r="36" fill="currentColor" stroke="none" />
      <circle cx="120" cy="90" r="220" strokeWidth="3" />
    </svg>
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
      <span role="status" className="text-sm font-medium text-[#b54c0e]">
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
        className="va-pill h-11 border-2 border-[#1a6aa1] bg-white px-5 text-base font-semibold text-[#1a6aa1] hover:bg-[#1a6aa1] hover:text-white"
      >
        {state === "copied" ? (
          <CheckIcon data-icon="inline-start" weight="bold" />
        ) : (
          <CopyIcon data-icon="inline-start" weight="bold" />
        )}
        Copy as Markdown
      </Button>
    </div>
  );
}

// Bento placement per section: span and tile style.
const layout: Record<SectionKey, string> = {
  mvp: "lg:col-span-6",
  forWhom: "lg:col-span-3",
  riskiestAssumption: "lg:col-span-3",
  buildFirst: "lg:col-span-3",
  cuts: "lg:col-span-3",
  successTest: "lg:col-span-6",
};

function BentoBrief({
  brief,
  drafting,
}: {
  brief: DeepPartial<MvpBrief>;
  drafting: boolean;
}) {
  if (brief.needsMoreInfo) {
    return (
      <Tile
        title="Needs more info"
        className="bg-[#94c93e] text-[#1f2a33]"
        titleClass="text-[#1f2a33]"
      >
        <p className="max-w-[46ch] text-2xl leading-snug font-medium sm:text-3xl">
          {brief.needsMoreInfo}
        </p>
        <p className="mt-6 text-base font-medium">
          Add the detail to your Idea above and strip it back again.
        </p>
      </Tile>
    );
  }

  const buildFirst = brief.buildFirst?.filter(Boolean) ?? [];
  const cuts = brief.cuts?.filter((cut) => cut?.feature) ?? [];
  const st = brief.successTest;

  const tiles: Record<SectionKey, ReactNode> = {
    mvp: brief.mvp && (
      <Tile
        title={sectionTitles.mvp}
        className="bg-[#1a6aa1] text-white"
        titleClass="text-white/85"
        big
      >
        <p className="max-w-[40ch] text-2xl leading-snug font-semibold text-white sm:text-[2.1rem] sm:leading-[1.25]">
          {brief.mvp}
        </p>
      </Tile>
    ),
    forWhom: brief.forWhom && (
      <Tile title={sectionTitles.forWhom} className="bg-[#ededed]">
        <p className="text-lg leading-relaxed text-[#3d3d3d]">
          {brief.forWhom}
        </p>
      </Tile>
    ),
    riskiestAssumption: brief.riskiestAssumption && (
      <Tile
        title={sectionTitles.riskiestAssumption}
        className="bg-[#94c93e] text-[#1f2a33]"
        titleClass="text-[#1f2a33]"
      >
        <p className="text-lg leading-relaxed font-medium">
          {brief.riskiestAssumption}
        </p>
      </Tile>
    ),
    buildFirst: buildFirst.length > 0 && (
      <Tile
        title={sectionTitles.buildFirst}
        className="border-2 border-[#ededed] bg-white"
      >
        <ol className="flex flex-col gap-3.5">
          {buildFirst.map((item, i) => (
            <li key={i} className="flex items-start gap-3.5">
              <span
                aria-hidden
                className="va-display flex size-9 shrink-0 items-center justify-center rounded-full bg-[#b54c0e] text-lg text-white"
              >
                {i + 1}
              </span>
              <span className="pt-1.5 text-lg leading-snug text-[#3d3d3d]">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </Tile>
    ),
    cuts: cuts.length > 0 && (
      <Tile title={sectionTitles.cuts} className="bg-[#ededed]">
        <ul className="flex flex-col gap-4">
          {cuts.map((cut, i) => (
            <li key={i}>
              <p className="va-cut text-lg font-semibold text-[#1f2a33]">
                {cut?.feature}
              </p>
              {cut?.reason && (
                <p className="mt-0.5 leading-relaxed">{cut.reason}</p>
              )}
            </li>
          ))}
        </ul>
      </Tile>
    ),
    successTest: st?.question && (
      <Tile
        title={sectionTitles.successTest}
        className="bg-[#b9115b] text-white"
        titleClass="text-white/85"
        big
      >
        <p className="max-w-[36ch] text-2xl leading-snug font-semibold sm:text-[2rem] sm:leading-[1.25]">
          {st.question}
        </p>
        <dl className="mt-7 grid gap-3 md:grid-cols-3">
          <Detail term={successTestTerms.passBar}>{st.passBar}</Detail>
          <Detail term={successTestTerms.ifItFails}>{st.ifItFails}</Detail>
          <Detail term={successTestTerms.howToRun}>{st.howToRun}</Detail>
        </dl>
      </Tile>
    ),
  };

  const keys = Object.keys(sectionTitles) as SectionKey[];
  const next = drafting ? keys.find((key) => !tiles[key]) : undefined;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-6">
      {keys.map((key) => (
        <div key={key} className={cn("flex", layout[key])}>
          {tiles[key] || (
            <Placeholder
              title={sectionTitles[key]}
              drafting={key === next}
              tall={key === "mvp" || key === "successTest"}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Tile({
  title,
  className,
  titleClass = "text-[#1a6aa1]",
  big = false,
  children,
}: {
  title: string;
  className?: string;
  titleClass?: string;
  big?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div
      role="region"
      aria-labelledby={id}
      className={cn(
        "w-full rounded-[36px] p-7 sm:p-9",
        big && "sm:rounded-[48px] sm:p-11",
        className,
      )}
    >
      <h2
        id={id}
        className={cn(
          "mb-4 text-2xl sm:text-[1.75rem]",
          big && "sm:mb-5",
          titleClass,
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Placeholder({
  title,
  drafting,
  tall,
}: {
  title: string;
  drafting: boolean;
  tall: boolean;
}) {
  return (
    <div
      className={cn(
        "va-placeholder flex w-full items-start justify-between gap-4 p-7 sm:p-9",
        tall ? "min-h-40" : "min-h-32",
        drafting && "border-[#ec671b]",
      )}
    >
      <span
        className={cn(
          "va-display text-2xl",
          drafting ? "text-[#1f2a33]" : "text-[#9a9a9a]",
        )}
      >
        {title}
      </span>
      {drafting && (
        <span className="flex animate-pulse items-center gap-2 pt-1 text-sm font-semibold text-[#b54c0e]">
          <span className="size-2 rounded-full bg-[#ec671b]" />
          Drafting…
        </span>
      )}
    </div>
  );
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-3xl bg-white/12 p-5">
      <dt className="text-xs font-bold tracking-[0.14em] uppercase">{term}</dt>
      <dd className="mt-1.5 leading-relaxed text-white">{children}</dd>
    </div>
  );
}
