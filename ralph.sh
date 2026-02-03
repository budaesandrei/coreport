#!/usr/bin/env bash
set -euo pipefail

# Ralph Wiggum loop: iterate, pick the highest-priority failing feature, implement exactly one,
# update tasks.json + progress.txt, commit, repeat.

ITERATIONS="${1:-50}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "Usage: $0 [iterations]"
  echo "Default iterations: 50"
  exit 0
fi

echo "Running ralph loop for ${ITERATIONS} iterations"

for ((i=1; i<=ITERATIONS; i++)); do
  echo
  echo "===== Iteration ${i}/${ITERATIONS} ====="

  # Use codex non-interactively. We keep the prompt short but strict.
  # NOTE: This script assumes it's run from repo root.
  result=$(codex exec \
    --full-auto \
    -C "$(pwd)" \
    -m "openai-codex/gpt-5.2" \
    "You are working in /home/ubuntu/projects/coreport.\n\n1) Read tasks.json and progress.txt.\n2) Pick the SINGLE highest-priority feature whose passes=false and work ONLY on that feature.\n3) Implement the smallest correct change-set to make that feature pass.\n4) Prove it with an executable check (prefer: docker compose + curl smoke tests; use browser automation only if necessary).\n5) Update exactly one feature object in tasks.json: set passes=true and add any new steps you performed.\n6) Append a short note to progress.txt describing what you changed and how you verified it.\n7) Make a git commit for JUST that feature (clear commit message).\n8) If all tasks have passes=true, output exactly: <promise>COMPLETE</promise>\n")

  echo "$result" | tee /dev/tty

  if echo "$result" | grep -q "<promise>COMPLETE</promise>"; then
    echo "All tasks completed; exiting."
    exit 0
  fi

done
