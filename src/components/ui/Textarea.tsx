"use client";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">{label}</label>}
        <textarea ref={ref} id={inputId} className={cn(
          "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary placeholder:text-text-muted resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200",
          error ? "border-red-500" : "border-border hover:border-text-muted", className
        )} {...props} />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export default Textarea;
