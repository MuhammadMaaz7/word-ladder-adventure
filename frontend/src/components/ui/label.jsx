import * as React from "react"

const Label = React.forwardRef(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors ${className}`}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
