import React from 'react'

const buttonVariants = {
  default: "bg-purple-600 text-white hover:bg-purple-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-600 bg-transparent hover:bg-gray-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  ghost: "hover:bg-gray-700",
  link: "text-purple-400 underline-offset-4 hover:underline"
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8",
  icon: "h-10 w-10"
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
