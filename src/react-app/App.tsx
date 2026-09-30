import { Textarea } from "@/components/ui/textarea";

function App() {
	return (
		<>
			<div className="sheet-frame" aria-hidden />
			<main className="mx-auto flex min-h-svh max-w-6xl flex-col items-center justify-center px-8 py-16 text-center sm:px-16 sm:py-24">
				<header className="flex flex-col items-center gap-6">
					<h1 className="text-6xl sm:text-8xl lg:text-9xl">
						Show me the <em>MVP</em>
					</h1>
					<p className="max-w-[44ch] text-lg text-muted-foreground sm:text-xl">
						Describe your big idea. Show me the MVP turns it into the smallest
						version worth shipping.
					</p>
				</header>
				<div className="mt-12 flex w-full max-w-2xl flex-col items-center gap-3">
					<label htmlFor="idea" className="kicker">
						Your big idea
					</label>
					<Textarea
						id="idea"
						placeholder="An app that…"
						className="max-h-80 min-h-32 text-left text-base md:text-base"
					/>
				</div>
			</main>
		</>
	);
}

export default App;
