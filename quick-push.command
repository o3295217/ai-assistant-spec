#!/bin/bash

# Быстрый коммит и пуш (с автосообщением)
# Для ленивых 😎

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 1

clear
echo "⚡ QUICK PUSH ⚡"
echo ""

# Проверяем изменения
if [[ -z $(git status --short) ]]; then
    echo "✅ Нет изменений"
    sleep 1
    exit 0
fi

# Показываем что будет закоммичено
echo "📦 Файлы:"
git status --short
echo ""

# Автосообщение с датой
timestamp=$(date '+%Y-%m-%d %H:%M')
commit_msg="Update: $timestamp"

echo "💬 Сообщение: $commit_msg"
echo ""

# Быстрое подтверждение
read -p "👉 Отправить? (Enter = Да, Ctrl+C = Нет) "

# Коммит и пуш
git add -A
git commit -m "$commit_msg"

current_branch=$(git branch --show-current)
git push origin "$current_branch" 2>/dev/null || git push -u origin "$current_branch"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Готово! → $current_branch"
else
    echo ""
    echo "❌ Ошибка при отправке"
fi

sleep 2
