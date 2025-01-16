import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex w-full rounded-md border border-input  px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50
          text-black text-opacity-50 text-xs font-normal   mb-3
            h-10 transition-all 
          hover:bg-slate-300 hover:cursor-pointer focus:cursor-auto 
          focus:outline-4 focus:outline-slate-300 focus:bg-slate-200

         `,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
