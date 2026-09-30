import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { briefToMarkdown } from "@/lib/brief-markdown";
import type { MvpBrief } from "../../shared/brief";

type CopyState = "idle" | "copied" | "failed";

// Puts a finished Brief on the clipboard as Markdown and briefly says how it went.
export function CopyBriefButton({ brief }: { brief: MvpBrief }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  useEffect(() => {
    if (copyState === "idle") return;
    const timer = setTimeout(() => setCopyState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copyState]);

  return (
    <div className="flex items-center justify-end gap-3">
      <span
        role="status"
        className="font-mono text-xs tracking-[0.14em] text-primary uppercase"
      >
        {copyState === "copied" && "Copied to clipboard"}
        {copyState === "failed" && "Couldn't copy: check clipboard access"}
      </span>
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(briefToMarkdown(brief));
            setCopyState("copied");
          } catch {
            setCopyState("failed");
          }
        }}
        className="font-mono tracking-[0.14em] uppercase"
      >
        {copyState === "copied" ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        Copy as Markdown
      </Button>
    </div>
  );
}
