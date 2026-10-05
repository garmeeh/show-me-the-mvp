#!/usr/bin/env bash
# PostToolUse hook: format the file Claude just edited or wrote.
# Never fails the edit; the pre-commit hook and CI are the gate.
file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path??"")}catch{}})')
[ -n "$file" ] && [ -f "$file" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" && pnpm exec prettier --write --ignore-unknown --log-level silent "$file" >/dev/null 2>&1
exit 0
