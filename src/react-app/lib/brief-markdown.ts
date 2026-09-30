import { sectionTitles, successTestTerms } from "@/lib/brief-sections";
import type { MvpBrief } from "../../shared/brief";

// The finished Brief as Markdown, for pasting into notes, an issue or a doc.
export function briefToMarkdown(brief: MvpBrief): string {
  const { successTest } = brief;
  return (
    [
      "# MVP Brief",
      `## ${sectionTitles.mvp}\n\n${brief.mvp}`,
      `## ${sectionTitles.forWhom}\n\n${brief.forWhom}`,
      `## ${sectionTitles.riskiestAssumption}\n\n${brief.riskiestAssumption}`,
      `## ${sectionTitles.buildFirst}\n\n${brief.buildFirst
        .map((item, i) => `${i + 1}. ${item}`)
        .join("\n")}`,
      `## ${sectionTitles.cuts}\n\n${brief.cuts
        .map((cut) => `- **${cut.feature}**: ${cut.reason}`)
        .join("\n")}`,
      `## ${sectionTitles.successTest}\n\n**${successTest.question}**`,
      [
        `- **${successTestTerms.passBar}:** ${successTest.passBar}`,
        `- **${successTestTerms.ifItFails}:** ${successTest.ifItFails}`,
        `- **${successTestTerms.howToRun}:** ${successTest.howToRun}`,
      ].join("\n"),
    ].join("\n\n") + "\n"
  );
}
