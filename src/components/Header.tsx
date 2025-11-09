'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Цели', href: '/goals' },
  { name: 'Сегодня', href: '/daily' },
  { name: 'История', href: '/history' },
  { name: 'Аналитика', href: '/analytics' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                AI Assistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'border-blue-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
