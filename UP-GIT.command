#!/bin/bash

# UP-GIT: Коммит и пуш изменений на GitHub
# Использование: ./UP-GIT.command

# Переход в директорию скрипта
cd "$(dirname "$0")"

set -e  # Остановка при ошибке

echo "📊 Статус репозитория:"
git status --short

echo ""
echo "📝 Добавление всех изменений..."
git add .

echo ""
echo "🔍 Файлы для коммита:"
git status --short

echo ""
echo "💬 Введите сообщение коммита (или Enter для автосообщения):"
read -r COMMIT_MESSAGE

if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="Update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Использую автосообщение: $COMMIT_MESSAGE"
fi

echo ""
echo "💾 Создание коммита..."
git commit -m "$COMMIT_MESSAGE"

echo ""
echo "🚀 Отправка на GitHub..."
git push origin $(git branch --show-current)

echo ""
echo "✅ Готово! Изменения отправлены на GitHub"
echo ""
echo "Информация о коммите:"
git log -1 --oneline
echo ""
echo "Текущая ветка: $(git branch --show-current)"
echo "Удалённый репозиторий: $(git remote get-url origin)"
