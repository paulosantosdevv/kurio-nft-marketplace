import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      // Focus the dialog
      dialogRef.current?.focus()
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg bg-[#1b120e] border border-[#3d2b21] rounded-2xl p-6 shadow-2xl text-[#f7f4ed] outline-none',
          'animate-in zoom-in-95 duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a69a8f] hover:text-[#f7f4ed] hover:bg-[#241914] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <h2 id="dialog-title" className="text-xl font-bold tracking-tight mb-1">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-[#a69a8f] mb-6">{description}</p>
        )}

        {children}
      </div>
    </div>
  )
}
