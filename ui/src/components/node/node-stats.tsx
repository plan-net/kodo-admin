'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Activity, Clock, LineChart, Users, ListOrdered } from "lucide-react"
import { ExportButton } from "@/components/ui/export-button"

interface NodeStatsProps {
  data: {
    status: {
      attached: {
        status: boolean
        timestamp: string
      }
      responds: {
        status: boolean
        value: string
      }
      taskStatus: {
        status: string
        message: string
      }
      callsAmount: {
        value: string
        trend: string
      }
      maxWorkers: {
        value: number
        description: string
      }
      queueLength: {
        value: number
        description: string
      }
    }
  }
}

export function NodeStats({ data }: NodeStatsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Node status</h2>
        <ExportButton onExport={() => {}} />
      </div>

      <div className="grid gap-4">
        {/* First row */}
        <div className="grid gap-4 grid-cols-3">
          <Card className="p-6 bg-card-background border-border">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <h3 className="font-medium">Attached</h3>
                <p className="text-sm text-muted-foreground">{data.status.attached.timestamp}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card-background border-border">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-chart-2" />
              <div>
                <h3 className="font-medium">Responds</h3>
                <p className="text-sm text-muted-foreground">{data.status.responds.value}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card-background border-border">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-muted-foreground animate-spin" />
              <div>
                <h3 className="font-medium">Task Status</h3>
                <p className="text-sm text-muted-foreground">{data.status.taskStatus.message}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Second row */}
        <div className="grid gap-4 grid-cols-3">
          <Card className="p-6 bg-card-background border-border">
            <div className="flex items-center gap-4">
              <LineChart className="w-8 h-8 text-chart-1" />
              <div>
                <h3 className="font-medium">Calls Amount</h3>
                <p className="text-sm text-muted-foreground">{data.status.callsAmount.value}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card-background border-border">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-chart-1" />
              <div>
                <h3 className="font-medium">Max Amount of Workers</h3>
                <p className="text-sm text-muted-foreground">{data.status.maxWorkers.value}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card-background border-border">
            <div className="flex items-center gap-4">
              <ListOrdered className="w-8 h-8 text-chart-1" />
              <div>
                <h3 className="font-medium">Current Queue Length</h3>
                <p className="text-sm text-muted-foreground">{data.status.queueLength.value}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 