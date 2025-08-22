#!/usr/bin/env bash
set -euo pipefail

# Guard against accidentally pasted Markdown/docs content into TSX files.
# Fails if a .tsx file begins with a Markdown header or contains a long block of Markdown fences.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Patterns to flag: lines starting with '# ' at top, or triple backticks fences inside TSX
violations=()
while IFS= read -r -d '' file; do
  # Skip node_modules and dist
  if [[ "$file" == *"node_modules/"* || "$file" == *"dist/"* ]]; then
    continue
  fi
  # Check first 5 lines for markdown headers (e.g., "# Title")
  if head -n 5 "$file" | grep -qE '^#\s|^# '; then
    violations+=("$file: markdown header found in top lines")
    continue
  fi
  # Check for code fences suggesting pasted docs
  if grep -q "\`\`\`" "$file"; then
    violations+=("$file: code fence found; looks like pasted docs")
    continue
  fi
  # Check for large contiguous plain text blocks (heuristic: >20 lines without semicolons or JSX markers)
  if awk 'BEGIN{c=0} { if ($0 !~ /[;<>{}(\"]|import |export |from |const |let |function |return /) { c++ } else { c=0 } if (c>20) { print; exit 0 } } END{ if (c>20) exit 0; else exit 1 }' "$file" >/dev/null; then
    violations+=("$file: large plain-text block detected; might be docs")
  fi

done < <(find "$ROOT_DIR/src" -type f -name "*.tsx" -print0)

if (( ${#violations[@]} > 0 )); then
  echo "TSX docs guard failed. Potential docs content in TSX files:" >&2
  for v in "${violations[@]}"; do
    echo " - $v" >&2
  done
  echo -e "\nIf intentional, move content to docs/ and import as needed." >&2
  exit 1
fi

echo "TSX docs guard passed."
