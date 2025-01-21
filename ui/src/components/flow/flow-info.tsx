'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { FlowHeader } from './flow-header'
import { FlowSearch } from './flow-search'
import { FlowCard } from './flow-card'
import { TopFlowBar } from './top-flow-bar'
import { NodeLogs } from '@/components/node/node-logs'
import { RequestsTable } from '@/components/node/requests-table'
import { NodeRevenueChart } from '@/components/node/revenue-chart'
import { NodeRevenueStats } from '@/components/node/revenue-stats'
import { NodeInput } from '@/components/node/node-input'
import { NodeOutput } from '@/components/node/node-output'
import { NodeMainSettings } from '@/components/node/node-main-settings'
import { NodePricing } from '@/components/node/node-pricing'
import { NodeDangerZone } from '@/components/node/node-danger-zone'
import { ExportButton } from "@/components/ui/export-button"

interface FlowData {
  id?: string
  url: string
  name: string
  description: string
  tags: string[]
  price: number
  author: string
  organization: string
  created: string
  modified: string
}

interface FlowInfoProps {
  data: {
    registryName: string
    registryDescription: string
    flows: Array<{
      id: string
      url: string
      name: string
      description: string
      tags: string[]
      price: number
      author: string
      organization: string
      created: string
      modified: string
      isPinned: boolean
    }>
  }
  onPin: (flow: any) => void
  selectedTags: string[]
  onTagClick: (tag: string) => void
}

export function FlowInfo({ 
  data, 
  onPin, 
  selectedTags, 
  onTagClick 
}: FlowInfoProps) {
  const [selectedAction, setSelectedAction] = useState('Welcome')
  const [filteredFlows, setFilteredFlows] = useState(data?.flows || [])

  const handleSearchResults = (results: { items: any[] }) => {
    setFilteredFlows(results.items)
  }

  const renderContent = () => {
    switch (selectedAction) {
      case 'Welcome':
        return (
          <div className="space-y-8">
            <FlowHeader 
              name={data.registryName}
              description={data.registryDescription}
            />
            
            <FlowSearch 
              onSearchChange={handleSearchResults}
              selectedTags={selectedTags}
              onTagsChange={(tags) => onTagClick(tags[tags.length - 1])}
              availableTags={Array.from(new Set(data.flows.flatMap(flow => flow.tags)))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlows.map((flow) => (
                <FlowCard 
                  key={flow.url}
                  data={flow}
                  onPin={onPin}
                  onShow={() => console.log('Show flow:', flow.url)}
                  selectedTags={selectedTags}
                  onTagClick={onTagClick}
                />
              ))}
            </div>
          </div>
        )

      case 'Run':
        return (
          <>
            <FlowHeader 
              name={data.registryName}
              description={data.registryDescription}
            />
            <div className="grid grid-cols-2 gap-6">
              <NodeInput 
                onSubmit={(data) => console.log('Submit:', data)}
                onClear={() => console.log('Clear input')}
              />
              <NodeOutput
                nodeId={data.flows[0]?.id || ''}
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

      case 'Requests':
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
            // ... more mock data as needed
          ]
        }

        return (
          <>
            <FlowHeader 
              name={data.registryName}
              description={data.registryDescription}
            />
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Flow's Requests Table</h2>
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
          </>
        )

      case 'Logs':
        return (
          <>
            <FlowHeader 
              name={data.registryName}
              description={data.registryDescription}
            />
            <div className="rounded-lg border border-border bg-background p-6 w-full">
              <NodeLogs nodeId={data.flows[0]?.id || ''} />
            </div>
          </>
        )

      case 'Usage':
        const mockRevenueData = {
          monthly: [
            { month: 'Jan', value: 1200, growth: 10 },
            { month: 'Feb', value: 1400, growth: 15 },
          ],
          current: {
            percentage: 75,
            amount: 1500,
            growth: 12
          }
        }

        return (
          <>
            <FlowHeader 
              name={data.registryName}
              description={data.registryDescription}
            />
            <div className="rounded-lg border border-border bg-background p-6 w-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold">Usage Over Time</h2>
                <ExportButton onExport={() => {}} />
              </div>
              <div className="h-[300px] w-full">
                <NodeRevenueChart data={mockRevenueData} />
              </div>
            </div>
            <NodeRevenueStats data={mockRevenueData} />
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

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-secondary rounded-lg w-1/4 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-secondary rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-secondary rounded-lg w-2/3 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TopFlowBar
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
        <div className="py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 