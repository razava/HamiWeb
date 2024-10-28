import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
         `flex  w-full rounded-md border border-input px-3 py-2  ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none   focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          text-black text-opacity-50 text-xs font-normal  bg-slate-200 
          3xl:min-h-[150px] min-h-[100px]`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
