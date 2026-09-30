#!/usr/bin/env bash
# Claude Code status line: model (effort), dir, branch, context bar, cost.
# Reads the session JSON on stdin; see https://code.claude.com/docs/en/statusline

BUDGET=200000 # fixed context budget: 200k reads as 100%, even on 1M models

SEP=$'\x1f' # non-whitespace separator so empty fields survive `read`
IFS="$SEP" read -r model effort dir used cost fulldir < <(jq -r --arg sep "$SEP" '
  (.workspace.current_dir // .cwd // "") as $d
  | (env.HOME // "") as $h
  | (if $h != "" and ($d == $h or ($d | startswith($h + "/")))
     then "~" + $d[($h | length):] else $d end) as $p
  | ($p | split("/")) as $parts
  | [
      (.model.display_name // "?"),
      (.effort.level // ""),
      (if ($parts | length) > 3 then "…/" + ($parts[-2:] | join("/")) else $p end),
      ((.context_window.current_usage // {})
        | (.input_tokens // 0) + (.cache_creation_input_tokens // 0) + (.cache_read_input_tokens // 0)),
      (.cost.total_cost_usd // 0),
      $d
    ]
  | map(tostring) | join($sep)
')

gitdir=${fulldir:-$PWD}
branch=$(git -C "$gitdir" --no-optional-locks branch --show-current 2>/dev/null)
# Detached HEAD shows the short hash; outside a repo, "no git".
[[ -z $branch ]] && branch=$(git -C "$gitdir" --no-optional-locks rev-parse --short HEAD 2>/dev/null)
branch=${branch:-no git}

used=${used:-0}
pct=$((used * 100 / BUDGET))
filled=$((pct / 10))
((filled > 10)) && filled=10
bar=""
for ((i = 0; i < 10; i++)); do
  ((i < filled)) && bar+="█" || bar+="░"
done

if ((pct >= 90)); then ctx=$'\033[31m'   # red
elif ((pct >= 60)); then ctx=$'\033[33m' # amber
else ctx=$'\033[32m'; fi                 # green

R=$'\033[0m'
label=$model
[[ -n $effort ]] && label+=" ($effort)"

printf '%s  %s  %s  %s  %s\n' \
  $'\033[36m'"$label$R" \
  $'\033[34m'"$dir$R" \
  $'\033[35m'"$branch$R" \
  "$ctx$bar $pct% $(((used + 500) / 1000))k/$((BUDGET / 1000))k$R" \
  $'\033[2m'"\$$(printf '%.2f' "${cost:-0}")$R"
