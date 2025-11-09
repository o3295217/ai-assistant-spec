import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Personal AI Effectiveness Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Личный помощник для достижения мечты
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 shadow">
            <h2 className="text-2xl font-semibold mb-3">О проекте</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Веб-приложение для ежедневного планирования с иерархической системой целей
              и автоматической оценкой через Anthropic Claude API.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✓ 7 уровней целей: День → Неделя → Месяц → Квартал → Полугодие → Год → Мечта</li>
              <li>✓ Оценка дня по 4 критериям с помощью ИИ</li>
              <li>✓ Анализ выравнивания целей (alignment)</li>
              <li>✓ История и аналитика прогресса</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 shadow">
            <h2 className="text-2xl font-semibold mb-3">Быстрый старт</h2>
            <div className="space-y-3">
              <Link
                href="/goals"
                className="block p-3 bg-white dark:bg-gray-800 rounded hover:shadow-md transition"
              >
                <div className="font-semibold">1. Установите цели</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Определите мечту и цели на разные периоды
                </div>
              </Link>
              <Link
                href="/daily"
                className="block p-3 bg-white dark:bg-gray-800 rounded hover:shadow-md transition"
              >
                <div className="font-semibold">2. Планируйте день</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Создайте план утром, добавьте факт вечером
                </div>
              </Link>
              <div className="block p-3 bg-white dark:bg-gray-800 rounded opacity-75">
                <div className="font-semibold">3. Получите оценку</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ИИ проанализирует ваш день и даст обратную связь
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
            Настройка
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Перед использованием оценки от ИИ необходимо добавить ваш API ключ Anthropic в файл <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code>
          </p>
        </div>
      </div>
    </main>
  )
}
