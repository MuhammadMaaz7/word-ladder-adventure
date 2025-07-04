import React from 'react'

const badgeVariants = {
  default: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-600 text-gray-200 hover:bg-gray-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-yellow-600 text-white hover:bg-yellow-700",
}

export function Badge({ className = "", variant = "default", ...props }) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold transition-colors cursor-default select-none ${badgeVariants[variant]} ${className}`}
      {...props}
    />
  )
}
