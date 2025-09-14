#!/bin/bash

# Auto-commit script for Claude Code hooks
# Automatically commits successful code changes to GitHub

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[AUTO-COMMIT]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[AUTO-COMMIT WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[AUTO-COMMIT ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Not in a git repository"
    exit 1
fi

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    log "No changes to commit"
    exit 0
fi

# Get the list of changed files
CHANGED_FILES=$(git diff --cached --name-only 2>/dev/null || git diff --name-only 2>/dev/null || echo "")

if [ -z "$CHANGED_FILES" ]; then
    # If no staged files, stage all changes
    git add .
    CHANGED_FILES=$(git diff --cached --name-only)
fi

if [ -z "$CHANGED_FILES" ]; then
    log "No changes to commit after staging"
    exit 0
fi

# Generate intelligent commit message based on changed files
generate_commit_message() {
    local files="$1"
    local message=""
    local emoji=""

    # Analyze file types and changes
    if echo "$files" | grep -q "manifest.json\|package.json"; then
        emoji="📦"
        message="Update configuration"
    elif echo "$files" | grep -q "\.js$\|\.ts$"; then
        emoji="✨"
        message="Update JavaScript functionality"
    elif echo "$files" | grep -q "\.css$\|\.scss$"; then
        emoji="💄"
        message="Update styles"
    elif echo "$files" | grep -q "\.html$"; then
        emoji="🔨"
        message="Update HTML structure"
    elif echo "$files" | grep -q "README\|\.md$"; then
        emoji="📚"
        message="Update documentation"
    elif echo "$files" | grep -q "\.json$"; then
        emoji="🔧"
        message="Update configuration files"
    elif echo "$files" | grep -q "agents/\|commands/"; then
        emoji="🤖"
        message="Update Claude Code configuration"
    else
        emoji="🔄"
        message="Update project files"
    fi

    # Add file details to message
    local file_count=$(echo "$files" | wc -l)
    if [ $file_count -eq 1 ]; then
        local filename=$(basename "$files")
        message="$message: $filename"
    elif [ $file_count -le 3 ]; then
        local filenames=$(echo "$files" | xargs -I {} basename {} | tr '\n' ', ' | sed 's/,$//')
        message="$message: $filenames"
    else
        message="$message ($file_count files)"
    fi

    echo "$emoji $message

🤖 Generated with Claude Code Auto-Commit

Files changed:
$(echo "$files" | sed 's/^/- /')"
}

# Generate commit message
COMMIT_MESSAGE=$(generate_commit_message "$CHANGED_FILES")

# Stage all changes if not already staged
git add .

# Create the commit
if git commit -m "$COMMIT_MESSAGE"; then
    log "Successfully committed changes:"
    echo "$CHANGED_FILES" | sed 's/^/  - /'

    # Try to push to remote if it exists
    if git remote get-url origin > /dev/null 2>&1; then
        log "Pushing to remote repository..."
        if git push; then
            log "Successfully pushed to remote"
        else
            warn "Failed to push to remote (you may need to push manually)"
        fi
    else
        warn "No remote repository configured"
    fi
else
    error "Failed to create commit"
    exit 1
fi

log "Auto-commit completed successfully"