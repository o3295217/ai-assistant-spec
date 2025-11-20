#!/bin/bash

# СУПЕР БЫСТРЫЙ коммит для Олега
# Один клик = всё готово!

cd /Users/oleggluskov/Documents/GooglDisk/ai-assistant-spec 2>/dev/null || exit 1

# Проверяем изменения
if [[ -z $(git status --short) ]]; then
    osascript -e 'display notification "Нет изменений для коммита" with title "Git"'
    exit 0
fi

# Автосообщение
msg="✨ $(date '+%d.%m %H:%M')"

# Коммит и пуш
git add -A
git commit -m "$msg" >/dev/null 2>&1
git push >/dev/null 2>&1

# Уведомление
if [ $? -eq 0 ]; then
    osascript -e 'display notification "Изменения отправлены на GitHub" with title "✅ Готово!"'
else
    osascript -e 'display notification "Ошибка при отправке" with title "❌ Ошибка"'
fi
