'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  onExport: () => void
  className?: string
}

export function ExportButton({ onExport, className }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onExport}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <Download className="w-4 h-4" />
      Export
    </Button>
  )
} 