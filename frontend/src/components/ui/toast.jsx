import * as React from "react"

const ToastProvider = ({ children }) => {
  return <div>{children}</div>
}

const ToastViewport = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-3 sm:p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:left-auto sm:flex-col md:max-w-[420px] ${className}`}
    {...props}
  />
))
ToastViewport.displayName = "ToastViewport"

const Toast = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-gray-700 bg-gray-800 text-gray-100",
    destructive: "border-red-500 bg-red-900/90 text-red-100",
    success: "border-green-500 bg-green-900/90 text-green-100",
  }

  return (
    <div
      ref={ref}
      className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-2 sm:space-x-4 overflow-hidden rounded-md border p-4 sm:p-6 pr-6 sm:pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full ${variants[variant]} ${className}`}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef(({ className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-transparent px-3 text-xs sm:text-sm font-medium transition-colors hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef(({ className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`absolute right-1 top-1 sm:right-2 sm:top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-purple-400 group-hover:opacity-100 ${className}`}
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm sm:text-base font-semibold [&+div]:text-xs [&+div]:sm:text-sm ${className}`}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-xs sm:text-sm opacity-90 ${className}`} {...props} />
))
ToastDescription.displayName = "ToastDescription"

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
