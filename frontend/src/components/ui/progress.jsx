import React from 'react'

export function Progress({
  className = "",
  value = 0,
  ...props
}) {
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-700 ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-purple-600 transition-all duration-500"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}
