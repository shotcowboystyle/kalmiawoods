#!/usr/bin/env bash
# Remove all Vercel preview deployments associated with a given git branch.
#
# Requires:
#   - vercel CLI on PATH
#   - VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID env vars
#   - $1 = branch name
#
# Uses vercel's --meta filter (githubCommitRef=<branch>) which is set at deploy
# time by the deploy-preview workflow. Falls back to a no-op if no matches.
set -euo pipefail

BRANCH="${1:-}"
if [[ -z "$BRANCH" ]]; then
  echo "Usage: $0 <branch-name>" >&2
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "VERCEL_TOKEN is not set" >&2
  exit 1
fi

echo "Looking up preview deployments for branch: $BRANCH"

# `vercel ls` prints deployment URLs. --meta filters by the metadata we tagged
# at deploy time. Output includes headers/footers, so grep for vercel.app URLs.
URLS=$(vercel ls \
  --meta githubCommitRef="$BRANCH" \
  --token="$VERCEL_TOKEN" \
  2>/dev/null | grep -Eo 'https://[a-z0-9-]+\.vercel\.app' | sort -u || true)

if [[ -z "$URLS" ]]; then
  echo "No matching preview deployments found for '$BRANCH'."
  exit 0
fi

echo "Removing:"
echo "$URLS"

while IFS= read -r url; do
  [[ -z "$url" ]] && continue
  # --safe skips deployments currently aliased to production
  vercel remove "$url" --safe --yes --token="$VERCEL_TOKEN" || {
    echo "Warning: failed to remove $url (continuing)" >&2
  }
done <<< "$URLS"

echo "Cleanup complete for '$BRANCH'."
