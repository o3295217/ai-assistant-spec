#!/bin/bash

# Docker Logs Script for Personal AI Effectiveness Assistant
# This script shows container logs

# Colors for output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Логи контейнера (Ctrl+C для выхода):${NC}"
echo ""

docker-compose logs -f --tail=100
