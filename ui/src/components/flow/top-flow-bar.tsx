'use client'

import { Button } from "@/components/ui/button"

interface TopFlowBarProps {
  selectedAction: string
  setSelectedAction: (action: string) => void
}

export function TopFlowBar({ selectedAction, setSelectedAction }: TopFlowBarProps) {
  const actions = ['Welcome', 'Run', 'Requests', 'Logs', 'Usage']

  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex gap-1">
        {actions.map((action) => (
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
        ))}
      </div>
      <Button variant="outline">Profile</Button>
    </div>
  )
} 