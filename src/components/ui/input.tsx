import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-none border border-gray-300 bg-white px-3 py-1 text-base text-gray-900 placeholder:text-gray-400  transition-colors",
          "focus:outline-none  focus:ring-primary focus:border-primary",
          "hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
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
