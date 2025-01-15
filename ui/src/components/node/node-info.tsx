'use client'

import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { NodeStats } from './node-stats'
import { RequestsTable } from './requests-table'
import { NodeRevenueChart } from './revenue-chart'
import { NodeRevenueStats } from './revenue-stats'
import { NodeLogs } from '@/components/node/node-logs'
import { ExportButton } from "@/components/ui/export-button"
import { NodeInput } from '@/components/node/node-input'
import { NodeOutput } from '@/components/node/node-output'
import { NodeMainSettings } from '@/components/node/node-main-settings'
import { NodePricing } from '@/components/node/node-pricing'
import { NodeDangerZone } from '@/components/node/node-danger-zone'
import { TopBar } from '@/components/layout/top-bar'


interface NodeInfoProps {
  data: {
    id: string
    name: string
    description: string
    tags: string[]
    status: {
      attached: boolean
      attachedTime: string
      responds: boolean
      responseTime: string
      taskStatus: string
    }
    metrics: {
      callsAmount: number
      workersAmount: number
      queueLength: number
    }
    revenue: {
      monthly: Array<{
        month: string
        value: number
        growth: number
      }>
      current: {
        percentage: number
        amount: number
        growth: number
      }
    }
  } | null
}

function NodeHeader({ name, description, tags }: { name: string, description: string, tags: string[] }) {
  return (
    <div className="space-y-4 bg-card-background">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-4">{name}</h1>
          <p className="text-gray-400 text-lg mb-6 max-w-3xl">
            {description}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            Action
          </button>
          <button className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/80">
            Action
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge 
            key={tag} 
            className="bg-secondary/20 hover:bg-secondary/40 text-muted border border-border px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <span className="text-lg">⚪</span>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function NodeInfo({ data }: NodeInfoProps) {
  const [selectedAction, setSelectedAction] = useState('Overview')

  if (!data) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="h-8 bg-secondary rounded-lg w-1/4 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-secondary rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-secondary rounded-lg w-2/3 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-6 w-20 bg-secondary rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Transform the data to match NodeStats component expectations
  const statsData = {
    status: {
      attached: {
        status: data.status.attached,
        timestamp: data.status.attachedTime
      },
      responds: {
        status: data.status.responds,
        value: data.status.responseTime
      },
      taskStatus: {
        status: data.status.taskStatus,
        message: data.status.taskStatus === 'Running' ? 'Pending ...' : data.status.taskStatus
      },
      callsAmount: {
        value: data.metrics.callsAmount.toString(),
        trend: 'up'
      },
      maxWorkers: {
        value: data.metrics.workersAmount,
        description: 'Lorem ipsum'
      },
      queueLength: {
        value: data.metrics.queueLength,
        description: 'Lorem ipsum'
      }
    }
  }

  // Mock requests data for the table
  const requestsData = {
    requests: [
      {
        id: 'req-1',
        timestamp: '2024-11-25T04:20:00',
        user: 'Jane Doe',
        role: 'Admin',
        input: 'Create a report...',
        inputTokens: 324,
        output: '...',
        outputTokens: 156,
        status: 'Running',
        kind: 'Single Node'
      },
      {
        id: 'req-2',
        timestamp: '2024-11-25T04:20:00',
        user: 'Jane Doe',
        role: 'Admin',
        input: 'Create a report...',
        inputTokens: 324,
        output: null,
        outputTokens: 0,
        status: 'Error',
        kind: 'Single Node'
      },
      {
        id: 'req-3',
        timestamp: '2024-11-25T04:20:00',
        user: 'Jane Doe',
        role: 'Admin',
        input: 'Create a report...',
        inputTokens: 324,
        output: null,
        outputTokens: 0,
        status: 'Input required',
        kind: 'Multi Node'
      },
      {
        id: 'req-4',
        timestamp: '2024-11-25T04:20:00',
        user: 'Jane Doe',
        role: 'Admin',
        input: 'Create a report...',
        inputTokens: 324,
        output: null,
        outputTokens: 0,
        status: 'Finished',
        kind: 'Single Node'
      }
    ]
  }

  const renderContent = () => {
    switch (selectedAction) {
      case 'Logs':
        return (
          <>
            <NodeHeader 
              name={data.name}
              description={data.description}
              tags={data.tags}
            />
            <NodeStats data={statsData} />
            <div className="rounded-lg border border-border bg-background p-6 w-full">
              <NodeLogs nodeId={data.id} />
            </div>
          </>
        )
      case 'Overview':
        return (
          <>
            <NodeHeader 
              name={data.name}
              description={data.description}
              tags={data.tags}
            />
            <NodeStats data={statsData} />
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Node's Requests Table</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
                    <span className="text-muted">Jan 20, 2023 - Feb 09, 2023</span>
                  </div>
                  <button className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80">
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              <RequestsTable data={requestsData} />
            </div>
            <div className="rounded-lg border border-border bg-background p-6 w-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold">Revenue Over Time</h2>
                <ExportButton onExport={() => {}} />
              </div>
              <div className="h-[300px] w-full">
                <NodeRevenueChart data={data.revenue} />
              </div>
            </div>
            <NodeRevenueStats data={data.revenue} />
          </>
        )
      case 'Testing':
        return (
          <>
            <NodeHeader 
              name={data.name}
              description={data.description}
              tags={data.tags}
            />
            <NodeStats data={statsData} />
            <div className="grid grid-cols-2 gap-6">
              <NodeInput 
                onSubmit={(data) => console.log('Submit:', data)}
                onClear={() => console.log('Clear input')}
              />
              <NodeOutput
                nodeId={data.id}
                
                status={{
                  running: true,
                  step: 2,
                  totalSteps: 7
                }}
                onInterrupt={() => console.log('Interrupt')}
                onClear={() => console.log('Clear output')}
                onRetry={() => console.log('Retry')}
              />
            </div>
          </>
        )
      case 'Management':
        return (
          <>
            <NodeHeader 
              name={data.name}
              description={data.description}
              tags={data.tags}
            />
            <NodeStats data={statsData} />
            <div className="grid gap-6">
              <NodeMainSettings
                enabled={true}
                public={false}
                onToggleEnabled={(value) => console.log('Toggle enabled:', value)}
                onTogglePublic={(value) => console.log('Toggle public:', value)}
              />
              <NodePricing
                basePrice={42.00}
                totalPrice={80.00}
                externalNodes={[
                  { id: 1, price: 23.00 },
                  { id: 2, price: 12.00 },
                  { id: 3, price: 3.00 }
                ]}
                onBasePriceChange={(value) => console.log('Base price changed:', value)}
                onExternalNodePriceChange={(id, value) => console.log('External node price changed:', id, value)}
              />
              <NodeDangerZone
                onPurgeHistory={() => console.log('Purge history')}
                onPurgeLogs={() => console.log('Purge logs')}
                onRemoveNode={() => console.log('Remove node')}
              />
            </div>
          </>
        )
      default:
        return (
          <div className="p-6 text-center text-gray-400">
            Content for {selectedAction} tab is not implemented yet.
          </div>
        )
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <TopBar 
          selectedAction={selectedAction} 
          setSelectedAction={setSelectedAction}
        />
      </div>
      <div className="space-y-8 p-8">
        {renderContent()}
      </div>
    </div>
  )
}