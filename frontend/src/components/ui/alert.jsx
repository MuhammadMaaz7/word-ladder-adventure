import * as React from "react"

const alertVariants = {
  default: "bg-gray-800 text-gray-100 border-gray-700",
  destructive: "border-red-500/50 text-red-400 bg-red-900/20 [&>svg]:text-red-400",
  success: "border-green-500/50 text-green-400 bg-green-900/20 [&>svg]:text-green-400",
  warning: "border-yellow-500/50 text-yellow-400 bg-yellow-900/20 [&>svg]:text-yellow-400",
  info: "border-blue-500/50 text-blue-400 bg-blue-900/20 [&>svg]:text-blue-400",
}

const Alert = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={`relative w-full rounded-lg border p-3 sm:p-4 [&>svg~*]:pl-6 sm:[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-3 sm:[&>svg]:left-4 [&>svg]:top-3 sm:[&>svg]:top-4 [&>svg]:text-foreground transition-colors ${alertVariants[variant]} ${className}`}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight text-sm sm:text-base ${className}`}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-xs sm:text-sm [&_p]:leading-relaxed ${className}`} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
