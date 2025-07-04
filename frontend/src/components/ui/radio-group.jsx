import * as React from "react"

const RadioGroup = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div className={`grid gap-2 sm:gap-3 ${className}`} {...props} ref={ref} role="radiogroup" />
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
      <input
        ref={ref}
        type="radio"
        className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
        {...props}
      />
      {children && <span className="text-sm sm:text-base text-gray-200 select-none">{children}</span>}
    </label>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
