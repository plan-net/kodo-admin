'use client'

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { FlowHeader } from './flow-header'
import { FlowSearch } from './flow-search'
import { FlowCard } from './flow-card'
import { TopFlowBar } from './top-flow-bar'
import { NodeLogs } from '@/components/node/node-logs'
import { NodeStats } from '@/components/node/node-stats'
import { FlowWelcomeIFrame } from './flow-welcome-iframe'
import { FlowsRequests } from './flows-requests'
import { api } from '@/lib/api'

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
  logs: Array<{
    timestamp: string
    level: string
    message: string
  }>
  requests: Array<{
    id: string
    timestamp: string
    user: string
    role: string
    input: string
    inputTokens: number
    output: string
    outputTokens: number
    status: string
    kind: string
  }>
  output: string
  flowSteps: string[]
  status: {
    running: boolean
    step: number
    totalSteps: number
  }
}

interface FlowInstancesData {
  result: Array<{
    fid: string
    status: string
    start_time: string
    end_time: string
    total: number
    flow: {
      url: string
      name: string
      description: string
      author: string
      tags: string[]
    }
    inactive: boolean | null
    alive: boolean | null
  }>
  total: number
  p: number
  pp: number
}

interface FlowInfoProps {
  data: {6
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
  const [selectedFlow, setSelectedFlow] = useState<FlowData | null>(null)
  const [flowInstances, setFlowInstances] = useState<FlowInstancesData | null>(null)

  useEffect(() => {
   // if (selectedAction === 'Requests') {
      api.getFlowInstances()
        .then(data => setFlowInstances(data))
        .catch(error => console.error('Error fetching flow instances:', error))
    //}
  }, [selectedAction])


  const handleSearchResults = (results: { items: any[] }) => {
    setFilteredFlows(results.items)
  }

  const handleShowFlow = (flow: FlowData) => {
    setSelectedFlow(flow)
    setSelectedAction('Run')
  }

  const renderContent = () => {
    switch (selectedAction) {
      case 'Welcome':
        return (
          <div className="space-y-8">
            
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
                  onShow={() => handleShowFlow(flow)}
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
            {selectedFlow?.url && (
              <>
                <FlowHeader 
                  name={selectedFlow.name}
                  description={selectedFlow.description}
                />
                <FlowWelcomeIFrame url={selectedFlow.url} />
              </>
            )}
          </>
        )

      case 'Jobs':
        return (
          <>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Flow's Jobs Table</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
                    <span className="text-muted">Jan 20, 2023 - Feb 09, 2023</span>
                  </div>
                  <button className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80">
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              {flowInstances ? (
                <FlowsRequests 
                  data={flowInstances} 
                  onFlowRemoved={() => {
                    api.getFlowInstances()
                      .then(data => setFlowInstances(data))
                      .catch(error => console.error('Error fetching flow instances:', error))
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                </div>
              )}
            </div>
          </>
        )

      case 'Logs':
        return (
          <>
            <FlowHeader 
              name={selectedFlow?.name || data.registryName}
              description={selectedFlow?.description || data.registryDescription}
            />
            <NodeStats data={{
              status: {
                attached: {
                  status: true,
                  timestamp: selectedFlow?.created || ''
                },
                responds: {
                  status: true,
                  value: '200ms'
                },
                taskStatus: {
                  status: 'Running',
                  message: 'Active'
                },
                callsAmount: {
                  value: selectedFlow?.requests?.length.toString() || '0',
                  trend: 'up'
                },
                maxWorkers: {
                  value: 5,
                  description: 'Active workers'
                },
                queueLength: {
                  value: 0,
                  description: 'Pending requests'
                }
              }
            }} />
            <div className="rounded-lg border border-border bg-background p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Logs</h2>
              </div>
              {selectedFlow?.logs ? (
                <div className="space-y-4">
                  {selectedFlow.logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        log.level === 'error' ? 'bg-red-500/10 text-red-500' :
                        log.level === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{new Date(log.timestamp).toLocaleString()}</span>
                        <Badge variant={
                          log.level === 'error' ? 'destructive' :
                          log.level === 'warning' ? 'warning' :
                          'secondary'
                        }>
                          {log.level}
                        </Badge>
                      </div>
                      <p className="mt-2">{log.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <NodeLogs nodeId={selectedFlow?.id || ''} />
              )}
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
          hasSelectedFlow={!!selectedFlow}
        />
        <div className="py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 