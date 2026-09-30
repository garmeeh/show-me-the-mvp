import { useState } from "react";
import { useObject } from "@ai-sdk/react";
import { cn } from "cn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import { EmptyBrief, MvpBrief } from "@/components/mvp-brief";
import { CopyBriefButton } from "@/components/copy-brief-button";
import { mvpBriefSchema, type MvpBrief as Brief } from "../shared/brief";

// One click shows a first-time visitor what the app does; the text stays editable.
const exampleIdeas = [
  "An app where local restaurants take takeaway orders without paying Deliveroo's fees",
  "A marketplace matching dog owners with vetted neighbours for holiday pet-sitting",
  "An AI tutor that turns a student's lecture notes into daily spaced-repetition quizzes",
  "A platform for freelance designers to send invoices, chase late payers and file taxes",
];

function App() {
  const [idea, setIdea] = useState("");
  // The trimmed Idea behind the Brief on screen; null until the first submit.
  const [submittedIdea, setSubmittedIdea] = useState<string | null>(null);
  // Set only when the stream closes on its own with every section: never for a
  // stopped or failed Brief, or a request for more information.
  const [completeBrief, setCompleteBrief] = useState<Brief | null>(null);
  const {
    object: brief,
    submit,
    stop,
    isLoading,
    error,
  } = useObject({
    api: "/api/brief",
    schema: mvpBriefSchema,
    onFinish: ({ object }) =>
      setCompleteBrief(object && !object.needsMoreInfo ? object : null),
  });
  const trimmedIdea = idea.trim();
  const canSubmit = trimmedIdea !== "";
  const briefIsStale =
    submittedIdea !== null && !isLoading && trimmedIdea !== submittedIdea;

  return (
    <>
      <div className="sheet-frame" aria-hidden />
      <main className="mx-auto grid min-h-svh max-w-7xl gap-10 px-8 py-16 sm:px-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
          <header className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-6xl">
              Show me the <em>MVP</em>
            </h1>
            <p className="max-w-[44ch] text-lg text-muted-foreground">
              Describe your big idea. Show me the MVP turns it into the smallest
              version worth shipping.
            </p>
          </header>
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) return;
              setSubmittedIdea(trimmedIdea);
              setCompleteBrief(null);
              submit(trimmedIdea);
            }}
          >
            <label htmlFor="idea" className="kicker">
              Your big idea
            </label>
            <Textarea
              id="idea"
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
              className="max-h-[50svh] min-h-40 text-base md:text-base"
            />
            <div
              role="group"
              aria-labelledby="examples-label"
              className="flex flex-col gap-2"
            >
              <p
                id="examples-label"
                className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase"
              >
                Example ideas
              </p>
              <div className="flex flex-wrap gap-2">
                {exampleIdeas.map((example) => (
                  <Button
                    key={example}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIdea(example)}
                    className="h-auto py-1.5 text-left whitespace-normal"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Button
                  key="stop"
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={stop}
                  className="px-5 font-mono tracking-[0.14em] uppercase"
                >
                  Stop
                </Button>
              ) : (
                <Button
                  key="submit"
                  type="submit"
                  size="lg"
                  disabled={!canSubmit}
                  aria-describedby={canSubmit ? undefined : "idea-required"}
                  className="px-5 font-mono tracking-[0.14em] uppercase"
                >
                  Strip it back
                </Button>
              )}
              <KbdGroup className="text-xs text-muted-foreground">
                <Kbd>⌘/Ctrl</Kbd>+<Kbd>Enter</Kbd>
              </KbdGroup>
            </div>
            {!canSubmit && !isLoading && (
              <p id="idea-required" className="text-sm text-muted-foreground">
                Describe an idea or pick an example.
              </p>
            )}
          </form>
        </div>
        <section aria-label="MVP Brief" aria-busy={isLoading}>
          {error && (
            <Alert variant="destructive" className="mb-6 px-4 py-3">
              <AlertDescription className="text-base">
                The MVP Brief failed. Submit your Idea again to retry.
              </AlertDescription>
            </Alert>
          )}
          {submittedIdea === null ? (
            <EmptyBrief />
          ) : (
            <>
              <p className="mb-4 flex flex-col gap-1.5">
                <span className="kicker">Brief for</span>
                <span className="text-lg text-heading">{submittedIdea}</span>
              </p>
              {completeBrief && (
                <div className="mb-4">
                  <CopyBriefButton brief={completeBrief} />
                </div>
              )}
              {briefIsStale && (
                <p className="mb-4 font-mono text-sm text-primary">
                  Idea changed: strip it back again to update the Brief.
                </p>
              )}
              <div
                className={cn(
                  "transition-opacity",
                  briefIsStale && "opacity-40",
                )}
              >
                <MvpBrief brief={brief ?? {}} drafting={isLoading} />
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
