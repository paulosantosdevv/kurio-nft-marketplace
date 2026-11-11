import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || props.name || (label ? label.toLowerCase().replace(/[^a-z0-9]/gi, '-') : Math.random().toString(36).substring(2, 9))

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#a69a8f]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#786b62]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[#1b120e] text-[#f7f4ed] border border-[#3d2b21] rounded-lg px-3.5 py-2.5 text-sm',
              'placeholder:text-[#786b62] focus:border-[#d28a4c] focus:outline-none focus:ring-1 focus:ring-[#d28a4c]',
              'disabled:opacity-50 disabled:bg-[#140d0a] transition-colors',
              leftIcon ? 'pl-10' : 'pl-3.5',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
        {helperText && !error && <span className="text-xs text-[#786b62]">{helperText}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
