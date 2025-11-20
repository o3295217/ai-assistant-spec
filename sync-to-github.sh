#!/bin/bash

# Auto-sync script for ai-assistant-spec
# Automatically commits and pushes all changes to GitHub

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BRANCH="claude/read-project-file-011CUxhFPATd3uJNSpJNTcGw"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Auto-sync to GitHub                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if there are any changes
if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✓ Нет изменений для синхронизации${NC}"
    exit 0
fi

# Show changes
echo -e "${YELLOW}Изменённые файлы:${NC}"
git status -s
echo ""

# Add all changes
echo -e "${BLUE}📦 Добавляю изменения...${NC}"
git add -A

# Create commit with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Auto-sync: $TIMESTAMP"

# If user provides a custom message, use it
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
fi

echo -e "${BLUE}💾 Создаю коммит: ${COMMIT_MSG}${NC}"
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo -e "${BLUE}🚀 Отправляю на GitHub...${NC}"
git push -u origin "$BRANCH"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ Изменения успешно синхронизированы с GitHub!          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Branch:${NC} $BRANCH"
echo -e "${YELLOW}Последний коммит:${NC} $(git log -1 --oneline)"
