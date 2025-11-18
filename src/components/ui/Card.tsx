import React from 'react'

interface CardProps {
  children: React.ReactNode
  hover?: boolean
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, hover = false, className = '', padding = 'md' }: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 
        rounded-2xl 
        border border-gray-100 dark:border-gray-700
        card-shadow 
        ${hover ? 'hover:card-shadow-hover transition-shadow cursor-pointer' : ''} 
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
