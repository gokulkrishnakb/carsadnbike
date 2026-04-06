"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

/* ── Bare shadcn Input ─────────────────────────────── */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 border border-input bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

/* ── Rich Input with label / icon / error / hint ──── */
export interface LabeledInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ className, label, error, hint, icon, iconRight, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
          <InputPrimitive
            ref={ref}
            id={inputId}
            data-slot="input"
            className={cn(
              "h-9 w-full min-w-0 border border-input bg-background text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
              icon ? "pl-10 pr-3 py-2" : "px-3 py-2",
              iconRight ? "pr-10" : "",
              error && "border-destructive focus-visible:ring-destructive/30",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  }
)
LabeledInput.displayName = "LabeledInput"

/* ── Password Input ───────────────────────────────── */
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export type PasswordInputProps = Omit<LabeledInputProps, "type" | "iconRight">

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [show, setShow] = useState(false)
    return (
      <LabeledInput
        ref={ref}
        {...props}
        type={show ? "text" : "password"}
        iconRight={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />
    )
  }
)
PasswordInput.displayName = "PasswordInput"

/* ── Textarea ─────────────────────────────────────── */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[100px] border border-input bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 resize-none",
            error && "border-destructive",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// LabeledInput is exported as "Input" for backward compatibility with form pages
export { Input as InputBase, LabeledInput as Input, LabeledInput, PasswordInput, Textarea }
