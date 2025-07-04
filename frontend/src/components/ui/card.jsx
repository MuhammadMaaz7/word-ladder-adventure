import React from 'react'

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-700 bg-gray-800 text-card-foreground shadow-sm transition-shadow hover:shadow-md ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`flex flex-col space-y-1 sm:space-y-1.5 p-4 sm:p-6 ${className}`} {...props} />
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={`text-lg sm:text-xl lg:text-2xl font-semibold leading-tight sm:leading-none tracking-tight ${className}`}
      {...props}
    />
  )
}

export function CardDescription({ className = "", ...props }) {
  return <p className={`text-xs sm:text-sm text-gray-400 leading-relaxed ${className}`} {...props} />
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 sm:p-6 pt-0 ${className}`} {...props} />
}

export function CardFooter({ className = "", ...props }) {
  return <div className={`flex items-center p-4 sm:p-6 pt-0 ${className}`} {...props} />
}
