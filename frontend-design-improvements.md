# УЛУЧШЕНИЯ ДИЗАЙНА ФРОНТЕНДА: ИИ-АССИСТЕНТ

## 🎯 EXECUTIVE SUMMARY

**Проблема:** Текущее ТЗ содержит минимальное описание дизайна - только технологии и список компонентов. Отсутствует дизайн-система, что приведет к несогласованному UI и плохому UX.

**Решение:** Внедрить профессиональную дизайн-систему с учетом специфики приложения для руководителя.

---

## 1. ДИЗАЙН-СИСТЕМА

### 1.1. Цветовая палитра

**Проблема текущего ТЗ:** "Приятная цветовая схема (не слишком яркая)" - слишком расплывчато.

**Рекомендация:** Профессиональная палитра для productivity-приложения

```css
/* === PRIMARY COLORS === */
--color-primary-50: #f0f9ff;   /* Lightest blue */
--color-primary-100: #e0f2fe;
--color-primary-500: #0ea5e9;  /* Main brand color */
--color-primary-600: #0284c7;  /* Hover states */
--color-primary-700: #0369a1;  /* Active states */
--color-primary-900: #0c4a6e;  /* Text on light bg */

/* === NEUTRAL COLORS === */
--color-gray-50: #fafafa;      /* Backgrounds */
--color-gray-100: #f5f5f5;     /* Cards, panels */
--color-gray-200: #e5e5e5;     /* Borders */
--color-gray-400: #a3a3a3;     /* Disabled text */
--color-gray-600: #525252;     /* Secondary text */
--color-gray-800: #262626;     /* Primary text */
--color-gray-900: #171717;     /* Headings */

/* === STATUS COLORS === */
/* Success (зеленый для >7 оценки) */
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Warning (желтый для 5-7 оценки) */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Danger (красный для <5 оценки) */
--color-danger-50: #fef2f2;
--color-danger-500: #ef4444;
--color-danger-600: #dc2626;
--color-danger-700: #b91c1c;

/* Info (синий для информации) */
--color-info-50: #eff6ff;
--color-info-500: #3b82f6;
--color-info-600: #2563eb;

/* === SEMANTIC COLORS === */
--color-bg-primary: #ffffff;
--color-bg-secondary: var(--color-gray-50);
--color-bg-tertiary: var(--color-gray-100);

--color-text-primary: var(--color-gray-900);
--color-text-secondary: var(--color-gray-600);
--color-text-tertiary: var(--color-gray-400);

--color-border: var(--color-gray-200);
--color-border-focus: var(--color-primary-500);
```

### 1.2. Типографика

**Проблема:** Нет описания шрифтов и иерархии текста.

**Рекомендация:**

```css
/* === FONT FAMILIES === */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

/* === FONT SIZES === */
--text-xs: 0.75rem;    /* 12px - labels, captions */
--text-sm: 0.875rem;   /* 14px - body small */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - subtitle */
--text-xl: 1.25rem;    /* 20px - h3 */
--text-2xl: 1.5rem;    /* 24px - h2 */
--text-3xl: 1.875rem;  /* 30px - h1 */
--text-4xl: 2.25rem;   /* 36px - hero */

/* === FONT WEIGHTS === */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* === LINE HEIGHTS === */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

**Применение:**

```
H1 (Страница) - text-3xl / font-bold / leading-tight
H2 (Раздел) - text-2xl / font-semibold / leading-tight
H3 (Подраздел) - text-xl / font-semibold / leading-normal
Body - text-base / font-normal / leading-normal
Small - text-sm / font-normal / leading-normal
Caption - text-xs / font-medium / leading-normal
```

### 1.3. Spacing (Отступы)

**Проблема:** Может получиться хаотичное расположение элементов.

**Рекомендация:** Модульная шкала 4px

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

**Правила:**
- Между элементами в карточке: `spacing-4` (16px)
- Между разделами: `spacing-8` (32px)
- Padding карточек: `spacing-6` (24px)
- Margin страницы: `spacing-8` (32px)

### 1.4. Shadows (Тени)

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

**Применение:**
- Карточки: `shadow-sm`
- Модалы/поповеры: `shadow-lg`
- Dropdown: `shadow-md`

### 1.5. Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - inputs */
--radius-md: 0.5rem;    /* 8px - buttons, cards */
--radius-lg: 0.75rem;   /* 12px - larger cards */
--radius-xl: 1rem;      /* 16px - hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

---

## 2. КОМПОНЕНТЫ

### 2.1. Кнопки

**Проблема:** Нет спецификации состояний и вариантов кнопок.

**Рекомендация:** 4 типа кнопок

```tsx
// Primary Button (основные действия)
<button className="
  px-4 py-2
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-medium text-sm
  rounded-md
  transition-colors duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Получить оценку
</button>

// Secondary Button (второстепенные действия)
<button className="
  px-4 py-2
  bg-gray-100 hover:bg-gray-200 active:bg-gray-300
  text-gray-800 font-medium text-sm
  rounded-md
  transition-colors duration-150
">
  Отмена
</button>

// Outline Button (вспомогательные действия)
<button className="
  px-4 py-2
  border-2 border-gray-300 hover:border-gray-400
  text-gray-700 font-medium text-sm
  rounded-md
  transition-colors duration-150
">
  Редактировать
</button>

// Danger Button (опасные действия)
<button className="
  px-4 py-2
  bg-danger-500 hover:bg-danger-600
  text-white font-medium text-sm
  rounded-md
">
  Удалить
</button>
```

### 2.2. Карточки (Cards)

**Проблема:** Нет унифицированного стиля карточек.

**Рекомендация:**

```tsx
// Standard Card
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-6
  shadow-sm
  hover:shadow-md
  transition-shadow duration-200
">
  {/* Контент */}
</div>

// Highlight Card (для важных элементов, например "Сегодняшний день")
<div className="
  bg-gradient-to-br from-primary-50 to-white
  border-2 border-primary-200
  rounded-lg
  p-6
  shadow-md
">
  {/* Контент */}
</div>

// Status Card (для оценок)
<div className={`
  bg-white border-l-4 rounded-lg p-6 shadow-sm
  ${score >= 7 ? 'border-success-500' :
    score >= 5 ? 'border-warning-500' :
    'border-danger-500'}
`}>
  {/* Контент */}
</div>
```

### 2.3. Формы (Inputs, Textareas)

```tsx
// Text Input
<input className="
  w-full px-4 py-2
  bg-white
  border border-gray-300
  rounded-md
  text-gray-900 text-base
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
  disabled:bg-gray-100 disabled:cursor-not-allowed
" />

// Textarea (для планов и фактов)
<textarea className="
  w-full px-4 py-3
  bg-white
  border border-gray-300
  rounded-md
  text-gray-900 text-base
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
  resize-vertical
  min-h-[120px]
" />

// Label
<label className="
  block mb-2
  text-sm font-medium text-gray-700
">
  План на день
</label>
```

### 2.4. Badge (для статусов alignment)

```tsx
// Success Badge
<span className="
  inline-flex items-center gap-1
  px-2.5 py-1
  bg-success-50 text-success-700
  text-xs font-medium
  rounded-full
">
  ✅ Работает
</span>

// Warning Badge
<span className="
  inline-flex items-center gap-1
  px-2.5 py-1
  bg-warning-50 text-warning-700
  text-xs font-medium
  rounded-full
">
  ⚠️ Частично
</span>

// Danger Badge
<span className="
  inline-flex items-center gap-1
  px-2.5 py-1
  bg-danger-50 text-danger-700
  text-xs font-medium
  rounded-full
">
  ❌ Не работает
</span>
```

---

## 3. УЛУЧШЕНИЯ UX

### 3.1. Loading States

**Проблема:** В ТЗ упомянут только "spinner во время запроса к Claude API".

**Рекомендация:** Полноценная система состояний загрузки

```tsx
// Inline Spinner (для кнопок)
<button disabled className="relative">
  <span className="opacity-0">Получить оценку</span>
  <div className="absolute inset-0 flex items-center justify-center">
    <svg className="animate-spin h-5 w-5 text-white" />
  </div>
</button>

// Page Loader (для загрузки страницы)
<div className="flex items-center justify-center min-h-screen">
  <div className="text-center">
    <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" />
    <p className="text-gray-600">Загрузка данных...</p>
  </div>
</div>

// Skeleton (для списков)
<div className="space-y-4">
  {[1,2,3].map(i => (
    <div key={i} className="animate-pulse">
      <div className="h-20 bg-gray-200 rounded-lg"></div>
    </div>
  ))}
</div>

// Progress Bar (для длинных операций)
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
```

### 3.2. Empty States

**Проблема:** Не описано, что показывать когда нет данных.

**Рекомендация:**

```tsx
// No Goals Yet
<div className="text-center py-12">
  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Нет целей на этот период
  </h3>
  <p className="text-gray-600 mb-6">
    Создайте первую цель, чтобы начать планирование
  </p>
  <button className="btn-primary">
    Создать цель
  </button>
</div>

// No Evaluations
<div className="text-center py-12">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Нет оценок за этот период
  </h3>
  <p className="text-gray-600">
    Добавьте факт выполнения и получите оценку от ИИ
  </p>
</div>
```

### 3.3. Error States

**Проблема:** Не описана обработка ошибок UI.

**Рекомендация:**

```tsx
// Inline Error (для форм)
<div className="mt-2 text-sm text-danger-600 flex items-center gap-2">
  <svg className="w-4 h-4" />
  <span>Поле обязательно для заполнения</span>
</div>

// Alert Error (для API ошибок)
<div className="
  bg-danger-50 border-l-4 border-danger-500
  p-4 rounded-md
">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-danger-500 mt-0.5" />
    <div className="ml-3">
      <h3 className="text-sm font-medium text-danger-800">
        Ошибка при получении оценки
      </h3>
      <p className="mt-1 text-sm text-danger-700">
        Claude API не отвечает. Попробуйте позже.
      </p>
    </div>
  </div>
</div>

// Error Page (для критических ошибок)
<div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
    <p className="text-xl text-gray-600 mb-8">
      Что-то пошло не так
    </p>
    <button className="btn-primary">
      Вернуться на главную
    </button>
  </div>
</div>
```

### 3.4. Toast Notifications

**Проблема:** Нет системы уведомлений для действий пользователя.

**Рекомендация:** Использовать библиотеку `react-hot-toast` или `sonner`

```tsx
// Success Toast
toast.success('План сохранен', {
  duration: 3000,
  position: 'top-right',
});

// Error Toast
toast.error('Не удалось сохранить план', {
  duration: 4000,
});

// Loading Toast
const toastId = toast.loading('Получение оценки...');
// После завершения
toast.success('Оценка получена', { id: toastId });
```

---

## 4. LAYOUT & NAVIGATION

### 4.1. Главная навигация

**Проблема:** В ТЗ только "Header с навигацией" - нет деталей.

**Рекомендация:** Боковая навигация + Top Bar

```tsx
// Sidebar Navigation
<aside className="
  w-64 h-screen fixed left-0 top-0
  bg-gray-900 text-white
  flex flex-col
">
  {/* Logo */}
  <div className="p-6 border-b border-gray-800">
    <h1 className="text-xl font-bold">AI Assistant</h1>
  </div>

  {/* Navigation Links */}
  <nav className="flex-1 p-4 space-y-2">
    <a className="
      flex items-center gap-3 px-4 py-3
      text-gray-300 hover:text-white hover:bg-gray-800
      rounded-lg transition-colors
    ">
      <svg className="w-5 h-5" />
      <span>Главная</span>
    </a>
    {/* ... остальные ссылки */}
  </nav>

  {/* User Section */}
  <div className="p-4 border-t border-gray-800">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-500 rounded-full" />
      <div>
        <p className="text-sm font-medium">Пользователь</p>
        <p className="text-xs text-gray-400">Руководитель</p>
      </div>
    </div>
  </div>
</aside>

// Main Content Area
<main className="ml-64 min-h-screen bg-gray-50">
  {/* Top Bar */}
  <header className="
    bg-white border-b border-gray-200
    px-8 py-4
    sticky top-0 z-10
  ">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">
        {pageTitle}
      </h1>
      <div className="flex items-center gap-4">
        {/* Date, Notifications, etc */}
      </div>
    </div>
  </header>

  {/* Page Content */}
  <div className="p-8">
    {children}
  </div>
</main>
```

### 4.2. Breadcrumbs

**Добавить навигационную цепочку:**

```tsx
<nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
  <a href="/" className="hover:text-gray-900">Главная</a>
  <span>/</span>
  <a href="/history" className="hover:text-gray-900">История</a>
  <span>/</span>
  <span className="text-gray-900 font-medium">10 ноября 2025</span>
</nav>
```

---

## 5. СПЕЦИФИЧНЫЕ УЛУЧШЕНИЯ СТРАНИЦ

### 5.1. Dashboard (Главная)

**Текущее ТЗ:**
- Карточка "Сегодняшний день"
- График оценок
- Виджет "Иерархия целей"

**Улучшения:**

```
┌────────────────────────────────────────────────┐
│  📊 Главная                          🔔 🌙 👤  │ <- Top Bar
├────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 🎯 СЕГОДНЯ: 19 ноября 2025              │  │ <- Hero Section
│  │                                          │  │
│  │ Оценка вчера: 7.5 ↗️ (+0.5)             │  │
│  │                                          │  │
│  │ [Создать план] [Добавить факт]          │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────────┐ ┌────────────────────┐   │
│  │ 📈 ДИНАМИКА     │ │ 📋 НЕЗАКРЫТЫЕ      │   │ <- Cards Row
│  │ 30 дней         │ │ ЗАДАЧИ             │   │
│  │                 │ │                    │   │
│  │ [график]        │ │ • Задача 1         │   │
│  │                 │ │ • Задача 2         │   │
│  └─────────────────┘ └────────────────────┘   │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 🎯 ИЕРАРХИЯ ЦЕЛЕЙ (expand/collapse)     │  │ <- Collapsible
│  │                                          │  │
│  │ > Мечта (5 лет)                         │  │
│  │ > Год 2025 (4 цели)                     │  │
│  │ v Неделя 18-24 ноября                   │  │
│  │   • Задача 1                            │  │
│  │   • Задача 2                            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└────────────────────────────────────────────────┘
```

**Дополнительные виджеты:**
- Прогресс по недельным целям (progress bar)
- Quick stats (средняя оценка за месяц, streak дней с оценкой >7)
- Upcoming tasks (что запланировано на сегодня из контекста)

### 5.2. Страница оценки дня

**Улучшения визуализации alignment:**

**Вместо текстовой цепочки:**
```
День → Неделя → Месяц → Квартал → Полугодие → Год → Мечта
```

**Визуальная цепочка:**

```
┌─────────────────────────────────────────────────────────┐
│  ALIGNMENT: ВЫРАВНИВАНИЕ ЦЕЛЕЙ                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [🟢 День]  ──✅──>  [🟡 Неделя]  ──⚠️──>  [🟢 Месяц]  │
│       │                   │                    │         │
│       └───────────────────┴────────────────────┘         │
│                           │                              │
│                           ↓                              │
│                    [🟢 Квартал]                          │
│                           │                              │
│                           ↓                              │
│                   [🔴 Полугодие]                         │
│                           │                              │
│                           ↓                              │
│                       [🟢 Год]                           │
│                           │                              │
│                           ↓                              │
│                      [🟢 Мечта]                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Каждый элемент кликабелен:**

```tsx
<div className="relative">
  {/* Connection Line */}
  <div className={`
    absolute left-1/2 top-0 w-0.5 h-full -z-10
    ${status === 'works' ? 'bg-success-500' :
      status === 'partial' ? 'bg-warning-500' :
      'bg-danger-500'}
  `} />

  {/* Period Card */}
  <div className={`
    relative bg-white rounded-lg p-4 mb-4
    border-2 cursor-pointer
    hover:shadow-lg transition-all
    ${status === 'works' ? 'border-success-500' :
      status === 'partial' ? 'border-warning-500' :
      'border-danger-500'}
  `}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-900">{periodName}</h3>
        <p className="text-sm text-gray-600">{goalCount} целей</p>
      </div>
      <Badge status={status} />
    </div>

    {/* Expanded Details */}
    {isExpanded && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">{alignmentText}</p>
      </div>
    )}
  </div>
</div>
```

### 5.3. Страница истории (Calendar View)

**Вместо простого календаря, использовать Heat Map:**

```
┌──────────────────────────────────────────────┐
│  📅 ИСТОРИЯ ОЦЕНОК                           │
├──────────────────────────────────────────────┤
│                                               │
│  Ноябрь 2025                                 │
│                                               │
│  Пн  Вт  Ср  Чт  Пт  Сб  Вс                 │
│       1   2   3   4   5   6                  │
│  🟢  🟢  🟡  🟢  ⚪  ⚪                       │
│  7   8   9   10  11  12  13                  │
│  🟡  🟢  🔴  🟢  🟢  ⚪  ⚪                  │
│  14  15  16  17  18  19  20                  │
│  🟢  🟢  🟢  🟡  🟢  ⬜  ⬜                  │
│                                               │
│  Легенда:                                    │
│  🟢 >7  🟡 5-7  🔴 <5  ⚪ выходной  ⬜ нет  │
│                                               │
└──────────────────────────────────────────────┘
```

**Интерактивность:**
- Hover: показать подсказку с оценкой
- Click: открыть детали дня

### 5.4. Страница ежедневного планирования

**Улучшенный layout:**

```
┌─────────────────────────────────────────────────────┐
│  📝 Планирование: 19 ноября 2025           [◀ ▶]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────┐  ┌──────────────────────────┐  │
│  │ 📋 ПЛАН        │  │ 🎯 КОНТЕКСТ              │  │
│  │                │  │                          │  │
│  │ [textarea]     │  │ Цели недели:             │  │
│  │                │  │ • Задача 1               │  │
│  │                │  │ • Задача 2               │  │
│  │                │  │                          │  │
│  │ [Сохранить]    │  │ Цели месяца:             │  │
│  └────────────────┘  │ • Задача 3               │  │
│                      │ • Задача 4               │  │
│  ┌────────────────┐  │                          │  │
│  │ ✅ ФАКТ        │  │ Незакрытые:              │  │
│  │                │  │ ⚠️ Задача А              │  │
│  │ [textarea]     │  └──────────────────────────┘  │
│  │                │                                 │
│  │ [Получить      │                                 │
│  │  оценку]       │                                 │
│  └────────────────┘                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Улучшения:**
- Split-screen: план слева, контекст справа
- Sticky контекст при скролле
- Auto-save (сохранение каждые 30 сек)
- Character counter для textarea
- Markdown preview (опционально)

---

## 6. АДАПТИВНОСТЬ

**Проблема:** "Мобильная версия - nice to have" - слишком поверхностно.

**Рекомендация:** Desktop-first, но с корректной мобильной версией

### Breakpoints:

```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
```

### Мобильная навигация:

- Боковое меню -> Bottom Tab Bar
- Скрыть sidebar -> Hamburger menu
- 2-колоночный layout -> 1 колонка

```tsx
// Desktop: Sidebar
<aside className="hidden lg:block w-64 ...">

// Mobile: Bottom Tab Bar
<nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t">
  <div className="flex justify-around py-2">
    <a className="flex flex-col items-center">
      <svg className="w-6 h-6" />
      <span className="text-xs">Главная</span>
    </a>
    {/* ... */}
  </div>
</nav>
```

---

## 7. ACCESSIBILITY (A11Y)

**Проблема:** Нет упоминания о доступности.

**Рекомендация:**

### 7.1. Keyboard Navigation

- Все интерактивные элементы доступны через Tab
- Escape закрывает модалы
- Enter/Space активирует кнопки
- Arrows для навигации в календаре

### 7.2. ARIA Labels

```tsx
<button
  aria-label="Получить оценку от ИИ"
  aria-busy={isLoading}
>
  Получить оценку
</button>

<input
  aria-invalid={hasError}
  aria-describedby="error-message"
/>
{hasError && (
  <p id="error-message" role="alert">
    Поле обязательно
  </p>
)}
```

### 7.3. Color Contrast

- Все тексты должны иметь контраст минимум 4.5:1
- Использовать не только цвет для статусов (добавлять иконки)

### 7.4. Focus States

```css
/* Видимый focus для всех элементов */
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

---

## 8. PERFORMANCE

### 8.1. Оптимизация загрузки

```tsx
// Lazy loading страниц
const HistoryPage = lazy(() => import('./pages/History'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));

// Suspense с fallback
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/history" element={<HistoryPage />} />
  </Routes>
</Suspense>
```

### 8.2. Оптимизация графиков

```tsx
// Использовать react-virtualized для больших списков
import { VirtualScroll } from 'react-virtualized';

// Debounce для поиска
const debouncedSearch = useDebouncedCallback(
  (value) => performSearch(value),
  300
);
```

### 8.3. Оптимизация изображений

- SVG для иконок (inline или sprite)
- WebP для картинок
- Lazy loading для изображений ниже fold

---

## 9. DARK MODE (Опциональное улучшение)

**Обоснование:** Приложение для ежедневного использования -> комфорт глаз.

**Реализация:**

```tsx
// Добавить переключатель темы
const [theme, setTheme] = useState<'light' | 'dark'>('light');

// Темная палитра
const darkColors = {
  '--color-bg-primary': '#1a1a1a',
  '--color-bg-secondary': '#2a2a2a',
  '--color-text-primary': '#f5f5f5',
  '--color-text-secondary': '#d4d4d4',
  // ...
};

// Применять через CSS variables
document.documentElement.style.setProperty(
  '--color-bg-primary',
  theme === 'dark' ? darkColors['--color-bg-primary'] : lightColors['--color-bg-primary']
);
```

---

## 10. БИБЛИОТЕКИ ДЛЯ UI

**Дополнение к ТЗ:**

```json
{
  "dependencies": {
    // Уже в ТЗ
    "next": "^14.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "recharts": "^2.0.0",

    // Рекомендуемые дополнения
    "@headlessui/react": "^1.7.0",    // Unstyled компоненты (modal, dropdown)
    "@heroicons/react": "^2.0.0",     // Иконки
    "clsx": "^2.0.0",                 // Условные className
    "date-fns": "^2.30.0",            // Работа с датами (уже в ТЗ)
    "react-hot-toast": "^2.4.0",      // Toast notifications
    "framer-motion": "^10.0.0",       // Анимации (опционально)
    "react-hook-form": "^7.0.0",      // Управление формами
    "zod": "^3.22.0"                  // Валидация схем
  }
}
```

---

## 11. ПРИОРИТИЗАЦИЯ УЛУЧШЕНИЙ

### КРИТИЧЕСКИЕ (Must Have):

1. ✅ Дизайн-система (цвета, типографика, spacing)
2. ✅ Базовые компоненты (кнопки, карточки, формы)
3. ✅ Loading/Error/Empty states
4. ✅ Toast notifications
5. ✅ Адаптивная навигация

### ВАЖНЫЕ (Should Have):

6. ✅ Улучшенная визуализация alignment
7. ✅ Heat map календарь
8. ✅ Улучшенный layout страницы планирования
9. ✅ Breadcrumbs
10. ✅ Accessibility (keyboard, ARIA)

### ЖЕЛАТЕЛЬНЫЕ (Nice to Have):

11. ✅ Dark mode
12. ✅ Анимации (framer-motion)
13. ✅ Markdown preview
14. ✅ Auto-save
15. ✅ Advanced analytics (тренды, прогнозы)

---

## 12. КОНКРЕТНЫЕ ДЕЙСТВИЯ

### ШАГ 1: Создать дизайн-систему

**Файл:** `src/styles/design-tokens.css`

```css
:root {
  /* Все переменные из раздела 1 */
}
```

**Файл:** `tailwind.config.js`

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        // ...
      },
      // ...
    }
  }
}
```

### ШАГ 2: Создать компоненты

**Структура:**

```
src/
  components/
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Textarea.tsx
      Badge.tsx
      Spinner.tsx
      Toast.tsx
    layout/
      Sidebar.tsx
      TopBar.tsx
      PageLayout.tsx
    domain/
      AlignmentChain.tsx
      ScoreCard.tsx
      GoalsList.tsx
      CalendarHeatMap.tsx
```

### ШАГ 3: Создать страницы с новым дизайном

**Использовать компоненты:**

```tsx
// pages/index.tsx
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  return (
    <PageLayout title="Главная">
      <Card variant="highlight">
        <h2>Сегодня: {format(new Date(), 'dd MMMM yyyy')}</h2>
        {/* ... */}
      </Card>
      {/* ... */}
    </PageLayout>
  );
}
```

---

## 13. ПРИМЕРЫ КОДА

### Компонент Card

```tsx
// src/components/ui/Card.tsx
import clsx from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'status';
  statusColor?: 'success' | 'warning' | 'danger';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  statusColor,
  className
}: CardProps) {
  return (
    <div className={clsx(
      'rounded-lg p-6 transition-shadow duration-200',
      {
        // Default
        'bg-white border border-gray-200 shadow-sm hover:shadow-md':
          variant === 'default',

        // Highlight
        'bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 shadow-md':
          variant === 'highlight',

        // Status
        'bg-white border-l-4 shadow-sm': variant === 'status',
        'border-success-500': variant === 'status' && statusColor === 'success',
        'border-warning-500': variant === 'status' && statusColor === 'warning',
        'border-danger-500': variant === 'status' && statusColor === 'danger',
      },
      className
    )}>
      {children}
    </div>
  );
}
```

### Компонент Button

```tsx
// src/components/ui/Button.tsx
import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium rounded-md transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',

        // Variants
        {
          'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white':
            variant === 'primary',
          'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800':
            variant === 'secondary',
          'border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-transparent':
            variant === 'outline',
          'bg-danger-500 hover:bg-danger-600 text-white':
            variant === 'danger',
        },

        // Sizes
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },

        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Загрузка...
        </span>
      ) : children}
    </button>
  );
}
```

### Компонент AlignmentChain

```tsx
// src/components/domain/AlignmentChain.tsx
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

interface AlignmentItem {
  period: string;
  status: 'works' | 'partial' | 'no';
  explanation: string;
  goalsCount: number;
}

interface AlignmentChainProps {
  alignment: AlignmentItem[];
}

export function AlignmentChain({ alignment }: AlignmentChainProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getStatusColor = (status: AlignmentItem['status']) => {
    switch (status) {
      case 'works': return 'success';
      case 'partial': return 'warning';
      case 'no': return 'danger';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Выравнивание целей
      </h2>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {alignment.map((item, index) => (
          <div key={index} className="relative mb-4 last:mb-0">
            {/* Circle Indicator */}
            <div className={clsx(
              'absolute left-6 w-4 h-4 rounded-full border-4 bg-white z-10',
              {
                'border-success-500': item.status === 'works',
                'border-warning-500': item.status === 'partial',
                'border-danger-500': item.status === 'no',
              }
            )} />

            {/* Card */}
            <div className="ml-16">
              <Card
                variant="status"
                statusColor={getStatusColor(item.status)}
                className={clsx(
                  'cursor-pointer transition-all',
                  expandedIndex === index && 'shadow-lg'
                )}
                onClick={() => setExpandedIndex(
                  expandedIndex === index ? null : index
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.period}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.goalsCount} {item.goalsCount === 1 ? 'цель' : 'целей'}
                    </p>
                  </div>

                  <Badge status={item.status} />
                </div>

                {/* Expanded Details */}
                {expandedIndex === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Arrow between items */}
            {index < alignment.length - 1 && (
              <div className="absolute left-7 -bottom-2 text-gray-400">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ЗАКЛЮЧЕНИЕ

**Текущее состояние ТЗ:** Функционально полное, но дизайн описан поверхностно.

**Результат предложенных улучшений:**
- ✅ Профессиональный внешний вид
- ✅ Согласованный UI на всех страницах
- ✅ Отличный UX (loading, errors, empty states)
- ✅ Доступность (a11y)
- ✅ Адаптивность (responsive)
- ✅ Производительность (performance)

**Следующие шаги:**
1. Утвердить дизайн-систему (цвета, шрифты)
2. Создать UI Kit (набор компонентов)
3. Применить к страницам приложения
4. Протестировать на разных устройствах

---

**Автор:** AI Assistant
**Дата:** 19 ноября 2025
**Версия:** 1.0
