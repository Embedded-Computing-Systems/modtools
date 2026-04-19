#!/bin/bash
# Cherry-pick safe commits from opencode/dev
# Avoids branding/naming changes that would conflict with MOD modtools branding

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Patterns to SKIP (branding-related)
BRANDING_PATTERNS='rebrand|rename.*opencode|to modtools|to Model-of-Design|OpenCode|mod\.py'

show_help() {
  echo "Cherry-pick safe commits from opencode/dev"
  echo ""
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  list              List safe commits to cherry-pick"
  echo "  apply [commit]    Apply a specific commit (or 'all' for batch)"
  echo "  batch [n]         Apply first n safe commits (default: 10)"
  echo "  dry-run           Show what would be applied without making changes"
  echo ""
  echo "Options:"
  echo "  --help            Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 list                    # Show safe commits"
  echo "  $0 batch 5                 # Apply first 5 safe commits"
  echo "  $0 apply 00fa68b3a         # Apply specific commit"
  echo "  $0 dry-run                 # Preview changes"
}

get_safe_commits() {
  # Source code commits excluding branding patterns
  git log --oneline --reverse dev-bmad-integration...opencode/dev \
    -- 'packages/*/src/**/*.ts' \
    -- 'packages/*/src/**/*.tsx' \
    -- 'packages/*/src/**/*.js' \
    -- 'packages/app/e2e/**' \
    2>/dev/null | \
    grep -v -iE "$BRANDING_PATTERNS"
}

list_commits() {
  echo -e "${BLUE}=== SAFE COMMITS (Ready to cherry-pick) ===${NC}"
  echo ""

  SAFE_COMMITS=$(get_safe_commits | head -50)

  if [ -z "$SAFE_COMMITS" ]; then
    echo -e "${YELLOW}No safe commits found to cherry-pick.${NC}"
    return
  fi

  echo "$SAFE_COMMITS" | while read -r line; do
    HASH=$(echo "$line" | awk '{print $1}')
    MSG=$(echo "$line" | cut -d' ' -f2-)
    echo -e "${GREEN}$HASH${NC} $MSG"
  done

  echo ""
  echo -e "${BLUE}Total safe commits shown: $(echo "$SAFE_COMMITS" | wc -l | xargs)${NC}"
  echo ""
  echo "To apply: $0 batch [n] or $0 apply <commit-hash>"
}

dry_run() {
  echo -e "${BLUE}=== DRY RUN: Would apply these commits ===${NC}"
  echo ""

  get_safe_commits | head -20 | while read -r line; do
    HASH=$(echo "$line" | awk '{print $1}')
    MSG=$(echo "$line" | cut -d' ' -f2-)

    # Check if commit is already in current branch
    if git branch --contains $HASH 2>/dev/null | grep -q "dev-bmad-integration"; then
      echo -e "${YELLOW}[SKIP]${NC} $HASH already present"
    else
      echo -e "${GREEN}[APPLY]${NC} $HASH $MSG"
    fi
  done
}

apply_commit() {
  local COMMIT=$1

  if [ -z "$COMMIT" ]; then
    echo -e "${RED}Error: No commit hash specified${NC}"
    exit 1
  fi

  echo -e "${BLUE}Cherry-picking $COMMIT...${NC}"

  # Check if commit is already applied
  if git branch --contains $COMMIT 2>/dev/null | grep -q "dev-bmad-integration"; then
    echo -e "${YELLOW}Commit $COMMIT already present in this branch${NC}"
    return 0
  fi

  # Attempt cherry-pick
  if git cherry-pick $COMMIT --no-commit; then
    echo -e "${GREEN}Successfully applied $COMMIT${NC}"
    echo ""
    echo -e "${YELLOW}Staged changes. Review with:${NC}"
    echo "  git status"
    echo "  git diff --cached"
    echo ""
    echo -e "${YELLOW}To finalize:${NC}"
    echo "  git commit -m \"cherry-pick: $COMMIT\""
    echo "  Or: git reset --hard HEAD (to abort)"
  else
    echo -e "${RED}Failed to apply $COMMIT${NC}"
    echo -e "${YELLOW}Resolve conflicts manually, then:${NC}"
    echo "  git add . && git commit"
    echo "Or abort with: git reset --hard HEAD"
    exit 1
  fi
}

batch_apply() {
  local N=${1:-10}

  echo -e "${BLUE}=== BATCH APPLY: First $N safe commits ===${NC}"
  echo ""

  COMMITS=$(get_safe_commits | head -$N | awk '{print $1}')

  if [ -z "$COMMITS" ]; then
    echo -e "${YELLOW}No commits to apply${NC}"
    return
  fi

  echo -e "${YELLOW}This will apply $N commits as a single merge commit.${NC}"
  echo -e "${YELLOW}Individual commit history will be preserved.${NC}"
  echo ""

  # Create a temporary branch for the merge
  TEMP_BRANCH="temp-cherry-pick-$(date +%s)"
  git checkout -b $TEMP_BRANCH

  # Apply each commit
  FAILED=0
  for COMMIT in $COMMITS; do
    echo -e "Applying ${GREEN}$COMMIT${NC}..."
    if ! git cherry-pick $COMMIT --no-commit 2>/dev/null; then
      echo -e "${RED}Conflict in $COMMIT - skipping${NC}"
      git reset --hard HEAD
      FAILED=$((FAILED + 1))
    fi
  done

  # Go back to original branch and merge
  git checkout dev-bmad-integration
  git merge --squash $TEMP_BRANCH -m "cherry-pick: batch of $N commits from opencode"
  git branch -D $TEMP_BRANCH

  echo ""
  echo -e "${GREEN}Applied $((N - FAILED)) commits${NC}"
  if [ $FAILED -gt 0 ]; then
    echo -e "${YELLOW}$FAILED commits failed (conflicts)${NC}"
  fi
  echo ""
  echo -e "${YELLOW}Review changes with: git status${NC}"
}

# Main
case "${1:-list}" in
  list|--list|-l)
    list_commits
    ;;
  dry-run|--dry-run|-n)
    dry_run
    ;;
  apply|--apply|-a)
    apply_commit "$2"
    ;;
  batch|--batch|-b)
    batch_apply "$2"
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo "Unknown command: $1"
    show_help
    exit 1
    ;;
esac
