---
description: Automatically update all README, documentation, and CLAUDE.md files based on recent code changes
allowed-tools: Bash(git diff:*), Bash(git log:*), Read, Write, Edit, Glob, Grep
---

# Auto-Update Documentation Command

This command will analyze recent code changes and automatically update your documentation files to reflect the current state of the codebase.

## Usage
```
/update-docs [optional-commit-range]
```

## What it does:
1. Analyzes recent code changes using git diff
2. Reviews current codebase structure
3. Updates README.md files to reflect current features and structure
4. Updates CLAUDE.md with latest development guidance
5. Updates any other documentation files found in the project
6. Provides a summary of changes made

## Process:

### Step 1: Analyze Recent Changes
First, let's see what has changed recently in the codebase:

```bash
# Get recent commits (last 5)
git log --oneline -5

# Show changes since last documentation update or specified range
git diff ${1:-HEAD~1} --name-only
git diff ${1:-HEAD~1} --stat
```

### Step 2: Scan Current Codebase Structure
Analyze the current state of all important files:

- Scan all source files for new features, functions, and components
- Check for new dependencies or configuration changes
- Identify any architectural changes
- Review any new or modified API endpoints or interfaces

### Step 3: Update Documentation Files

#### README.md Updates
- Update feature lists based on current functionality
- Refresh installation/setup instructions if needed
- Update usage examples to match current UI/UX
- Add any new dependencies or requirements
- Update file structure if changed

#### CLAUDE.md Updates
- Update development commands if any have changed
- Refresh architecture overview with any structural changes
- Update data models if schemas have changed
- Add any new development patterns or practices
- Update testing approaches or deployment notes

#### Other Documentation
- Update any other .md files in the project
- Refresh inline code comments if needed
- Update configuration documentation

### Step 4: Generate Summary
Provide a detailed summary of:
- Which files were updated
- What specific sections were changed
- Any new features or changes documented
- Recommendations for manual review

## Arguments:
- `$1` (optional): Git commit range or branch to compare against (defaults to HEAD~1)

## Examples:
- `/update-docs` - Update docs based on changes since last commit
- `/update-docs HEAD~5` - Update docs based on changes in last 5 commits
- `/update-docs main` - Update docs based on changes since main branch

Let me analyze your recent code changes and update all documentation files accordingly.

I'll start by examining what's changed recently and then systematically update each documentation file to reflect the current state of your D14 Trader Extension project.