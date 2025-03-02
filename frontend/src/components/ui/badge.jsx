import React from 'react'

const badgeVariants = {
  default: "bg-purple-600 text-white",
  secondary: "bg-gray-600 text-white",
  destructive: "bg-red-600 text-white",
  outline: "border border-gray-600 text-gray-200"
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${badgeVariants[variant]} ${className}`}
      {...props}
    />
  )
}
