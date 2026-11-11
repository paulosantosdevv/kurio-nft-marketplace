import React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'amber' | 'neutral' | 'success' | 'ethereum' | 'polygon' | 'solana'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    amber: 'bg-[#d28a4c]/20 text-[#d28a4c] border border-[#d28a4c]/40',
    neutral: 'bg-[#241914] text-[#a69a8f] border border-[#3d2b21]',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
    ethereum: 'bg-[#627eea]/15 text-[#9ab0ff] border border-[#627eea]/30',
    polygon: 'bg-[#8247e5]/15 text-[#c19bff] border border-[#8247e5]/30',
    solana: 'bg-[#14f195]/15 text-[#5effc4] border border-[#14f195]/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
