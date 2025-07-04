import React from 'react'

export function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`flex h-10 sm:h-11 w-full rounded-md border border-gray-600 bg-gray-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors touch-manipulation ${className}`}
      {...props}
    />
  )
}
