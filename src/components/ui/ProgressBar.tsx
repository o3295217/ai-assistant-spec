import React from 'react'

interface ProgressBarProps {
  show: boolean
  message?: string
}

export function ProgressBar({ show, message }: ProgressBarProps) {
  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-600 animate-pulse">
        <div className="h-full bg-blue-400 animate-progress"></div>
      </div>
      {message && (
        <div className="bg-blue-600 text-white text-sm text-center py-2 px-4 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  )
}
