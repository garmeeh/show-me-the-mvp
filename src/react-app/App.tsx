import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const titleBlock = [
	{
		label: "Presenter",
		value: (
			<a
				href="https://www.linkedin.com/in/gary-meehan/"
				target="_blank"
				rel="noreferrer"
				className="underline decoration-white/40 underline-offset-4 hover:text-primary hover:decoration-primary"
			>
				Gary Meehan
			</a>
		),
	},
	{ label: "Project", value: "Claude Code workshop" },
	{ label: "Stack", value: "React · Hono · Workers" },
	{ label: "Sheet", value: "01" },
];

function App() {
	const [name, setName] = useState<string | null>(null);

	return (
		<>
			<div className="sheet-frame" aria-hidden />
			<main className="mx-auto flex min-h-svh max-w-6xl flex-col justify-end gap-12 px-8 py-16 sm:px-16 sm:py-24">
				<header className="flex flex-col gap-6">
					<div className="kicker">Claude Code Workshop</div>
					<h1 className="text-6xl sm:text-8xl lg:text-9xl">
						Show me the <em>MVP</em>
					</h1>
					<p className="max-w-[44ch] text-lg text-muted-foreground sm:text-xl">
						A blank sheet to build on. We start from this page and ship an
						app on top of it, live, with Claude Code.
					</p>
				</header>

				<div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
					<Card className="max-w-md border-2 border-border ring-0">
						<CardHeader>
							<CardTitle className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
								Hono API · GET /api/
							</CardTitle>
							<CardDescription className="text-sm">
								The Worker answers from <code>src/worker/index.ts</code>.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap items-center gap-4">
							<Button
								size="lg"
								onClick={() => {
									fetch("/api/")
										.then((res) => res.json() as Promise<{ name: string }>)
										.then((data) => setName(data.name));
								}}
							>
								Get name
							</Button>
							<span className="font-mono text-sm">
								name: <span className="text-heading">{name ?? "—"}</span>
							</span>
						</CardContent>
					</Card>

					<dl className="grid grid-cols-2 border-2 border-border font-mono text-sm">
						{titleBlock.map(({ label, value }) => (
							<div key={label} className="border border-border px-5 py-3">
								<dt className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
									{label}
								</dt>
								<dd className="text-heading">{value}</dd>
							</div>
						))}
					</dl>
				</div>
			</main>
		</>
	);
}

export default App;
