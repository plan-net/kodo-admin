'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Expand } from "lucide-react"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"

interface NodeOutputProps {
  nodeId: string
  status: {
    running: boolean
    step: number
    totalSteps: number
  }
  output: string
  flowSteps: string[]
  onInterrupt: () => void
  onClear: () => void
  onRetry: () => void
}

export function NodeOutput({ 
  nodeId, 
  status, 
  output,
  flowSteps,
  onInterrupt, 
  onClear, 
  onRetry 
}: NodeOutputProps) {
  const [outputData, setOutputData] = useState<{
    output: string;
    flowSteps: string[];
  }>({
    output: output || "No output available",
    flowSteps: flowSteps || []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutput = async () => {
      try {
        setError(null);
        const data = await api.getNodeOutput(nodeId)
        setOutputData(data)
      } catch (error) {
        console.error("Failed to fetch node output:", error)
        setError("Failed to load node output. Please try again later.")
        setOutputData({
          output: "Error loading output",
          flowSteps: []
        })
      }
    }

    if (nodeId) {
      fetchOutput()
    }
  }, [nodeId])

  return (
    <Card className="bg-card-background border-border">
      <CardHeader>
        <CardTitle className="text-xl">Node Output</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-100/10 rounded-lg border border-red-200/20">
            {error}
          </div>
        )}
        {/* Final Output */}
        <div className="space-y-2">
          <label className="text-lg font-semibold">Final Output</label>
          <div className="relative">
            <pre className="bg-background p-4 rounded-lg border border-border text-sm font-mono text-muted-foreground max-h-[400px] overflow-auto">
              {outputData.output}
            </pre>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="space-y-2">
          <label className="text-lg font-semibold">Flow Steps</label>
          <div className="relative">
            <pre className="bg-background p-4 rounded-lg border border-border text-sm font-mono text-muted-foreground max-h-[400px] overflow-auto">
              {outputData.flowSteps.map((step, index) => (
                <div key={index} className="py-1">{step}</div>
              ))}
            </pre>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Flow Status and Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-sm">Running... Step {status.step}/{status.totalSteps}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onInterrupt}>Interrupt</Button>
            <Button variant="outline" onClick={onClear}>Clear</Button>
            <Button onClick={onRetry}>Retry</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 