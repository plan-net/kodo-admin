'use client'

import { Button } from "@/components/ui/button"
import LoginButton from '@/components/ui/login-btn' 

interface TopFlowBarProps {
  selectedAction: string
  setSelectedAction: (action: string) => void
  hasSelectedFlow?: boolean
}

export function TopFlowBar({ selectedAction, setSelectedAction, hasSelectedFlow }: TopFlowBarProps) {
  const actions = ['Welcome', 'Jobs']

  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex gap-1">
        {actions.map((action) => {
          if (!hasSelectedFlow) return null;  // Hide both Welcome and Jobs when no flow selected
          return (
            <Button
              key={action}
              variant="ghost"
              onClick={() => setSelectedAction(action)}
              className={`${
                selectedAction === action
                  ? 'bg-secondary'
                  : 'hover:bg-secondary'
              }`}
            >
              {action}
            </Button>
          );
        })}
      </div>
      <LoginButton />
    </div>
  )
} 