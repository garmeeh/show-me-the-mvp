// PROTOTYPE, throw away: floating bar that flips the home page between theme
// variants via ?variant=, plus buttons to load sample states.
import { useEffect } from "react";
import type { ProtoBrief } from "./use-proto-brief";

export const variants = [
  { key: "current", name: "Current blueprint" },
  { key: "A", name: "Variant A" },
  { key: "B", name: "Variant B" },
] as const;

export type VariantKey = (typeof variants)[number]["key"];

export function readVariant(): VariantKey {
  const v = new URLSearchParams(location.search).get("variant");
  return variants.find((x) => x.key === v)?.key ?? "A";
}

export function PrototypeSwitcher({
  current,
  names,
  proto,
}: {
  current: VariantKey;
  names: Partial<Record<VariantKey, string>>;
  proto?: ProtoBrief;
}) {
  const index = variants.findIndex((v) => v.key === current);
  const go = (step: number) => {
    const next = variants[(index + step + variants.length) % variants.length];
    const url = new URL(location.href);
    url.searchParams.set("variant", next.key);
    location.assign(url);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const btn =
    "rounded-full px-3 py-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white";
  return (
    <div
      style={{ fontFamily: "ui-monospace, monospace" }}
      className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black px-2 py-1.5 text-xs text-white shadow-2xl ring-1 ring-white/20"
    >
      <button
        className={btn}
        onClick={() => go(-1)}
        aria-label="Previous variant"
      >
        ←
      </button>
      <span className="px-2 whitespace-nowrap">
        {current} ({names[current] ?? variants[index].name})
      </span>
      <button className={btn} onClick={() => go(1)} aria-label="Next variant">
        →
      </button>
      {proto && (
        <>
          <span className="mx-1 h-4 w-px bg-white/30" />
          <button className={btn} onClick={proto.loadSample}>
            sample
          </button>
          <button className={btn} onClick={proto.loadNeedsInfo}>
            vague
          </button>
          <button className={btn} onClick={proto.reset}>
            empty
          </button>
        </>
      )}
    </div>
  );
}
