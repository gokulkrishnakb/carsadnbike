"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, iconRight, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input-base",
              icon && "pl-10",
              iconRight && "pr-10",
              error && "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "iconRight"> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);
    return (
      <Input
        ref={ref}
        {...props}
        type={show ? "text" : "password"}
        iconRight={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "input-base resize-none min-h-[100px]",
            error && "border-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
