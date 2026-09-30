import { useState } from "react";
import { useObject } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MvpBrief } from "@/components/mvp-brief";
import { mvpBriefSchema } from "../shared/brief";

function App() {
  const [idea, setIdea] = useState("");
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
              placeholder="An app that…"
              className="max-h-[50svh] min-h-40 text-base md:text-base"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="self-start px-5 font-mono tracking-[0.14em] uppercase"
            >
              Strip it back
            </Button>
          </form>
        </div>
        <section aria-label="MVP Brief" aria-busy={isLoading}>
          {brief && <MvpBrief brief={brief} />}
        </section>
      </main>
    </>
  );
}

export default App;
