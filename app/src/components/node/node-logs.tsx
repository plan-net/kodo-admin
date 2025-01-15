'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { api } from '@/lib/api'
import { ExportButton } from '@/components/ui/export-button'

interface NodeLogsProps {
  nodeId: string
}

export function NodeLogs({ nodeId }: NodeLogsProps) {
  const [logs, setLogs] = useState<string>('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await api.getNodeLogs(nodeId)
        setLogs(logsData.logs)
      } catch (error) {
        console.error('Error fetching logs:', error)
      }
    }

    fetchLogs()
  }, [nodeId])

  const handleExport = () => {
    // Create blob and download
    const blob = new Blob([logs], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'node-logs.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Logs</h2>
        <ExportButton onExport={handleExport} />
      </div>
      <div className="relative">
        <pre className="bg-background p-4 rounded-lg border border-border text-sm font-mono text-muted-foreground max-h-[400px] overflow-auto">
          {logs}
        </pre>
      </div>
    </div>
  )
} 