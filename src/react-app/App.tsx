import { useState } from "react";
import { useObject } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import { EmptyBrief, MvpBrief } from "@/components/mvp-brief";
import { mvpBriefSchema } from "../shared/brief";

// One click shows a first-time visitor what the app does; the text stays editable.
const exampleIdeas = [
  "An app where local restaurants take takeaway orders without paying Deliveroo's fees",
  "A marketplace matching dog owners with vetted neighbours for holiday pet-sitting",
  "An AI tutor that turns a student's lecture notes into daily spaced-repetition quizzes",
  "A platform for freelance designers to send invoices, chase late payers and file taxes",
];

function App() {
  const [idea, setIdea] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    object: brief,
    submit,
    isLoading,
  } = useObject({
    api: "/api/brief",
    schema: mvpBriefSchema,
  });

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
              setHasSubmitted(true);
              submit(idea);
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
                if (
                  event.key === "Enter" &&
                  (event.metaKey || event.ctrlKey) &&
                  !isLoading
                ) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
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
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="px-5 font-mono tracking-[0.14em] uppercase"
              >
                Strip it back
              </Button>
              <KbdGroup className="text-xs text-muted-foreground">
                <Kbd>⌘/Ctrl</Kbd>+<Kbd>Enter</Kbd>
              </KbdGroup>
            </div>
          </form>
        </div>
        <section aria-label="MVP Brief" aria-busy={isLoading}>
          {brief && <MvpBrief brief={brief} />}
          {!hasSubmitted && <EmptyBrief />}
        </section>
      </main>
    </>
  );
}

export default App;
