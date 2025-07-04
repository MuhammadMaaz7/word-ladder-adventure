import React from 'react'

export function Progress({ className = "", value = 0, ...props }) {
  return (
    <div className={`relative h-3 sm:h-4 w-full overflow-hidden rounded-full bg-gray-700 ${className}`} {...props}>
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-500 ease-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}
