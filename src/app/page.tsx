import Link from 'next/link'

// Updated: v2.0 - proper spacing
export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Personal AI Effectiveness Assistant
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-10">
          Личный помощник для достижения мечты
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">О проекте</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Веб-приложение для ежедневного планирования с иерархической системой целей
              и автоматической оценкой через Anthropic Claude API.
            </p>
            <ul className="space-y-3 text-base text-gray-600 dark:text-gray-400">
              <li>✓ 7 уровней целей: День → Неделя → Месяц → Квартал → Полугодие → Год → Мечта</li>
              <li>✓ Оценка дня по 4 критериям с помощью ИИ</li>
              <li>✓ Анализ выравнивания целей (alignment)</li>
              <li>✓ История и аналитика прогресса</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Быстрый старт</h2>
            <div className="space-y-4">
              <Link
                href="/goals"
                className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div>
                  <div className="text-lg font-semibold">1. Установите цели</div>
                  <div className="text-sm text-blue-100 mt-1">
                    Определите мечту и цели на разные периоды
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </Link>
              
              <Link
                href="/daily"
                className="flex items-center justify-between p-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div>
                  <div className="text-lg font-semibold">2. Планируйте день</div>
                  <div className="text-sm text-green-100 mt-1">
                    Создайте план утром, добавьте факт вечером
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </Link>
              
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md opacity-75">
                <div>
                  <div className="text-lg font-semibold">3. Получите оценку</div>
                  <div className="text-sm text-purple-100 mt-1">
                    ИИ проанализирует ваш день и даст обратную связь
                  </div>
                </div>
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <Link
            href="/history"
            className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div>
              <div className="text-2xl font-semibold">📊 Просмотр истории</div>
              <div className="text-base text-indigo-100 mt-2">
                Посмотрите все ваши записи и прогресс за любой период
              </div>
            </div>
            <span className="text-3xl">→</span>
          </Link>

          <Link
            href="/reports"
            className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div>
              <div className="text-2xl font-semibold">📈 Построение отчёта</div>
              <div className="text-base text-orange-100 mt-2">
                Создайте детальный отчёт за выбранный период времени
              </div>
            </div>
            <span className="text-3xl">→</span>
          </Link>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 shadow-md border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-3 text-gray-900 dark:text-white">
            <span className="text-2xl">⚠️</span>
            Настройка
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Перед использованием оценки от ИИ необходимо добавить ваш API ключ Anthropic в файл <code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded text-sm font-mono">.env.local</code>
          </p>
        </div>
      </div>
    </main>
  )
}
