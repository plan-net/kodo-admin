'use client'

import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

interface NodeMainSettingsProps {
  enabled: boolean
  public: boolean
  onToggleEnabled: (value: boolean) => void
  onTogglePublic: (value: boolean) => void
}

export function NodeMainSettings({ 
  enabled, 
  public: isPublic, 
  onToggleEnabled, 
  onTogglePublic 
}: NodeMainSettingsProps) {
  return (
    <Card className="p-6 bg-card-background border-border">
      <h2 className="text-xl font-semibold mb-6">Main</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Node is enabled</span>
          <Switch 
            checked={enabled}
            onCheckedChange={onToggleEnabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Node is public</span>
          <Switch 
            checked={isPublic}
            onCheckedChange={onTogglePublic}
          />
        </div>
      </div>
    </Card>
  )
} 