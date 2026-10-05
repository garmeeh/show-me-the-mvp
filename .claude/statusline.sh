#!/usr/bin/env bash
# Claude Code status line: model (effort) │ dir │ branch │ context bar │ cost.
# Reads the session JSON on stdin. Field names per
# https://code.claude.com/docs/en/statusline.md

BUDGET=200000 # context budget treated as 100%, whatever the model allows

# One jq call; fields joined by the unit separator so empty ones survive `read`.
IFS=$'\x1f' read -r model effort dir tokens cost < <(
	jq -r --argjson budget "$BUDGET" '
		(.context_window.current_usage // {}) as $u
		| [
			(.model.display_name // "?"),
			(.effort.level // ""),
			(.workspace.current_dir // .cwd // ""),
			(($u.input_tokens // 0) + ($u.cache_creation_input_tokens // 0) + ($u.cache_read_input_tokens // 0)),
			(.cost.total_cost_usd // 0)
		] | map(tostring) | join("\u001f")'
)

reset=$'\033[0m' dim=$'\033[2m'
cyan=$'\033[36m' blue=$'\033[34m' magenta=$'\033[35m'
green=$'\033[32m' amber=$'\033[33m' red=$'\033[31m'
sep=" ${dim}│${reset} "

# 1. Model, with effort in brackets when present.
model_part="$model${effort:+ ($effort)}"

# 2. Directory: $HOME as ~, then only the last two folders if deeper than that.
short_dir="$dir"
[[ -n "$HOME" && "$short_dir" == "$HOME"* ]] && short_dir="~${short_dir#"$HOME"}"
IFS=/ read -ra parts <<< "${short_dir#/}"
if ((${#parts[@]} > 3)); then
	short_dir="…/${parts[${#parts[@]} - 2]}/${parts[${#parts[@]} - 1]}"
fi

# 3. Git branch (short SHA when detached).
branch=$(git -C "${dir:-.}" --no-optional-locks symbolic-ref --short -q HEAD 2>/dev/null ||
	git -C "${dir:-.}" --no-optional-locks rev-parse --short HEAD 2>/dev/null)
branch=${branch:-no git}

# 4. Context: 10-cell bar, percentage of the budget (can pass 100), used/budget.
pct=$((tokens * 100 / BUDGET))
filled=$((pct / 10))
((filled > 10)) && filled=10
bar=""
for ((i = 0; i < 10; i++)); do
	((i < filled)) && bar+="█" || bar+="░"
done
if ((pct >= 90)); then ctx_colour=$red
elif ((pct >= 60)); then ctx_colour=$amber
else ctx_colour=$green
fi
ctx_part="$bar ${pct}% $(((tokens + 500) / 1000))k/$((BUDGET / 1000))k"

# 5. Session cost at API prices.
cost_part=$(printf '$%.2f' "$cost")

printf '%s\n' "${cyan}${model_part}${reset}${sep}${blue}${short_dir}${reset}${sep}${magenta}${branch}${reset}${sep}${ctx_colour}${ctx_part}${reset}${sep}${dim}${cost_part}${reset}"
