import type { ReactNode } from "react";
import { Fragment, useId } from "react";
import type { DeepPartial } from "ai";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sectionTitles, successTestTerms } from "@/lib/brief-sections";
import type { MvpBrief as Brief } from "../../shared/brief";

type SectionKey = keyof typeof sectionTitles;

// Before the first submit: a faint sheet showing what the Brief will contain.
export function EmptyBrief() {
  return (
    <ul aria-label="Your MVP Brief will cover" className="flex flex-col gap-4">
      {Object.values(sectionTitles).map((title) => (
        <li key={title}>
          <SectionPlaceholder title={title} />
        </li>
      ))}
    </ul>
  );
}

// Renders a Brief as it streams. Every section keeps its place on the sheet: a
// placeholder until its first data arrives, then the real card. While `drafting`,
// the next placeholder to fill says so. A needs-more-info message replaces the
// sections, so no Brief is invented.
export function MvpBrief({
  brief,
  drafting = false,
}: {
  brief: DeepPartial<Brief>;
  drafting?: boolean;
}) {
  if (brief.needsMoreInfo) {
    return (
      <Section title="Needs more info" emphasis>
        <p className="font-heading text-xl leading-snug font-semibold text-heading sm:text-2xl">
          {brief.needsMoreInfo}
        </p>
      </Section>
    );
  }

  const buildFirst = brief.buildFirst?.filter(Boolean) ?? [];
  const cuts = brief.cuts?.filter((cut) => cut?.feature) ?? [];
  const successTest = brief.successTest;

  // Each section's card, or null while it has no data yet.
  const cards: Record<SectionKey, ReactNode> = {
    mvp: brief.mvp && (
      <Section title={sectionTitles.mvp}>
        <p className="font-heading text-2xl leading-tight font-semibold text-heading sm:text-3xl">
          {brief.mvp}
        </p>
      </Section>
    ),
    forWhom: brief.forWhom && (
      <Section title={sectionTitles.forWhom}>
        <p>{brief.forWhom}</p>
      </Section>
    ),
    riskiestAssumption: brief.riskiestAssumption && (
      <Section title={sectionTitles.riskiestAssumption}>
        <p>{brief.riskiestAssumption}</p>
      </Section>
    ),
    buildFirst: buildFirst.length > 0 && (
      <Section title={sectionTitles.buildFirst}>
        <ol className="list-decimal space-y-1.5 pl-5 marker:font-mono marker:text-primary">
          {buildFirst.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </Section>
    ),
    cuts: cuts.length > 0 && (
      <Section title={sectionTitles.cuts}>
        <ul className="space-y-3">
          {cuts.map((cut, i) => (
            <li key={i}>
              <p className="font-medium text-heading line-through decoration-primary/70">
                {cut?.feature}
              </p>
              {cut?.reason && (
                <p className="text-muted-foreground">{cut.reason}</p>
              )}
            </li>
          ))}
        </ul>
      </Section>
    ),
    successTest: successTest?.question && (
      <Section title={sectionTitles.successTest} emphasis>
        <p className="font-heading text-xl leading-snug font-semibold text-heading sm:text-2xl">
          {successTest.question}
        </p>
        <dl className="mt-4 grid gap-3">
          <Detail term={successTestTerms.passBar}>{successTest.passBar}</Detail>
          <Detail term={successTestTerms.ifItFails}>
            {successTest.ifItFails}
          </Detail>
          <Detail term={successTestTerms.howToRun}>
            {successTest.howToRun}
          </Detail>
        </dl>
      </Section>
    ),
  };

  const keys = Object.keys(sectionTitles) as SectionKey[];
  const next = drafting ? keys.find((key) => !cards[key]) : undefined;

  return (
    <div className="flex flex-col gap-4">
      {keys.map((key) =>
        cards[key] ? (
          <Fragment key={key}>{cards[key]}</Fragment>
        ) : (
          <SectionPlaceholder
            key={key}
            title={sectionTitles[key]}
            drafting={key === next}
          />
        ),
      )}
    </div>
  );
}

// A dashed outline holding a section's place until its data arrives.
function SectionPlaceholder({
  title,
  drafting = false,
}: {
  title: string;
  drafting?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border border-dashed border-border/70 px-6 py-5 font-mono text-xs tracking-[0.14em] uppercase",
        !drafting && "opacity-60",
      )}
    >
      <span className="text-muted-foreground">{title}</span>
      {drafting && (
        <span className="animate-pulse text-primary normal-case">
          Drafting…
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  emphasis = false,
  children,
}: {
  title: string;
  emphasis?: boolean;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <Card
      role="region"
      aria-labelledby={headingId}
      className={cn(
        "text-base/relaxed",
        emphasis && "bg-primary/10 ring-2 ring-primary",
      )}
    >
      <CardHeader>
        <CardTitle>
          <h2 id={headingId} className="kicker">
            {title}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <div>
      <dt className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
        {term}
      </dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
