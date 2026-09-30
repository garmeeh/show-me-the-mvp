function App() {
	return (
		<>
			<div className="sheet-frame" aria-hidden />
			<main className="mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-8 py-16 sm:px-16 sm:py-24">
				<header className="flex flex-col gap-6">
					<h1 className="text-6xl sm:text-8xl lg:text-9xl">
						Show me the <em>MVP</em>
					</h1>
					<p className="max-w-[44ch] text-lg text-muted-foreground sm:text-xl">
						Describe your big idea. Show me the MVP turns it into the smallest
						version worth shipping.
					</p>
				</header>
			</main>
		</>
	);
}

export default App;
