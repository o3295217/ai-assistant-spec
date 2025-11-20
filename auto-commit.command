#!/bin/bash

# Автоматический коммит с timestamp
# Двойной клик = мгновенный коммит и пуш

cd "$(dirname "$0")"

echo "🚀 Автокоммит..."

# Проверяем изменения
if [[ -z $(git status --short) ]]; then
    echo "✅ Нет изменений"
    sleep 2
    exit 0
fi

# Автоматическое сообщение с датой и временем
commit_msg="Auto commit: $(date '+%Y-%m-%d %H:%M:%S')"

git add -A
git commit -m "$commit_msg"

current_branch=$(git branch --show-current)
git push origin "$current_branch" 2>/dev/null || git push -u origin "$current_branch"

if [ $? -eq 0 ]; then
    echo "✅ Готово!"
else
    echo "❌ Ошибка"
fi

sleep 2
