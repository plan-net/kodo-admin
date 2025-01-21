'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { FlowHeader } from './flow-header'
import { FlowSearch } from './flow-search'
import { FlowCard } from './flow-card'
import { TopFlowBar } from './top-flow-bar'

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
    flows: FlowData[]
  }
}

export function FlowInfo({ data }: FlowInfoProps) {
  const [selectedAction, setSelectedAction] = useState('Welcome')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filteredFlows, setFilteredFlows] = useState<FlowData[]>(data?.flows || [])

  // Handle search results from FlowSearch
  const handleSearchResults = (results: { items: FlowData[] }) => {
    setFilteredFlows(results.items)
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
        <div className="space-y-8 py-8">
          <FlowHeader 
            name={data.registryName}
            description={data.registryDescription}
          />
          
          <FlowSearch 
            onSearchChange={handleSearchResults}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={Array.from(new Set(data.flows.flatMap(flow => flow.tags)))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlows.map((flow) => (
              <FlowCard 
                key={flow.url}
                data={flow}
                onPin={() => console.log('Pin flow:', flow.url)}
                onShow={() => console.log('Show flow:', flow.url)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 