#!/bin/bash

# Быстрый коммит для Олега
# Путь: /Users/oleggluskov/Documents/GooglDisk/ai-assistant-spec

# Переходим в проект
cd /Users/oleggluskov/Documents/GooglDisk/ai-assistant-spec || {
    echo "❌ Папка проекта не найдена!"
    echo "Проверьте путь: /Users/oleggluskov/Documents/GooglDisk/ai-assistant-spec"
    read -p "Нажмите Enter..."
    exit 1
}

clear
echo "======================================"
echo "   🚀 Быстрый коммит и пуш"
echo "======================================"
echo ""
echo "📂 Проект: ai-assistant-spec"
echo ""

# Проверяем изменения
if [[ -z $(git status --short) ]]; then
    echo "✅ Нет изменений для коммита"
    echo ""
    read -p "Нажмите Enter для выхода..."
    exit 0
fi

# Показываем изменения
echo "📊 Изменённые файлы:"
git status --short
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Запрашиваем сообщение
read -p "📝 Сообщение коммита (Enter для автосообщения): " commit_message

# Если пустое - автосообщение
if [[ -z "$commit_message" ]]; then
    commit_message="Обновление: $(date '+%d.%m.%Y %H:%M')"
fi

echo ""
echo "💬 Сообщение: $commit_message"
echo ""

# Добавляем все файлы
echo "➕ Добавляем файлы..."
git add -A

# Коммитим
echo "💾 Создаём коммит..."
git commit -m "$commit_message"

# Получаем ветку
current_branch=$(git branch --show-current)

# Пушим
echo "🚀 Отправляем на GitHub (ветка: $current_branch)..."
git push origin "$current_branch" 2>/dev/null || git push -u origin "$current_branch"

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✅ Готово! Изменения на GitHub"
    echo ""
    echo "📍 Ветка: $current_branch"
else
    echo ""
    echo "❌ Ошибка при отправке"
fi

echo ""
read -p "Нажмите Enter для выхода..."
