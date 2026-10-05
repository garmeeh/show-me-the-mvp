import { Textarea } from "@/components/ui/textarea";

function App() {
  return (
    <>
      <div className="sheet-frame" aria-hidden />
      <main className="mx-auto flex min-h-svh max-w-6xl flex-col justify-end gap-6 px-8 py-16 sm:px-16 sm:py-24">
        <h1 className="text-6xl sm:text-8xl lg:text-9xl">
          Show me the <em>MVP</em>
        </h1>
        <p className="max-w-[44ch] text-lg text-muted-foreground sm:text-xl">
          Describe your big idea. Show me the MVP turns it into the smallest
          version worth shipping.
        </p>
        <Textarea
          aria-label="Your big idea"
          placeholder="Describe your big idea…"
          className="min-h-40 max-w-3xl px-4 py-3 text-base md:text-base"
        />
      </main>
    </>
  );
}

export default App;
