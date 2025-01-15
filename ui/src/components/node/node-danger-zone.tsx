'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NodeDangerZoneProps {
  onPurgeHistory: () => void
  onPurgeLogs: () => void
  onRemoveNode: () => void
}

export function NodeDangerZone({
  onPurgeHistory,
  onPurgeLogs,
  onRemoveNode
}: NodeDangerZoneProps) {
  return (
    <Card className="p-6 bg-card-background border-border">
      <h2 className="text-xl font-semibold mb-6">Permanent Actions</h2>
      <div className="space-y-4">
        <Button 
          variant="destructive" 
          onClick={onPurgeHistory}
          className="w-full justify-start bg-card-hover hover:bg-card-hover/80 text-muted-foreground"
        >
          Purge Running History
        </Button>
        <Button 
          variant="destructive"
          onClick={onPurgeLogs}
          className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-gray-200"
        >
          Purge Logs
        </Button>
        <Button 
          variant="destructive"
          onClick={onRemoveNode}
          className="w-full justify-start bg-red-900/50 hover:bg-red-900/70 text-red-200"
        >
          Remove Node from the Registry
        </Button>
      </div>
    </Card>
  )
} 