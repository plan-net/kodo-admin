'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { FlowInfo } from '@/components/flow/flow-info'
import { FlowSearch } from '@/components/flow/flow-search'
import { api } from '@/lib/api'
import { refreshSidebarPinnedFlows } from '@/components/layout/sidebar'

export default function DashboardPage() {
  const [pinnedFlows, setPinnedFlows] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<{ items: any[] }>({ items: [] })

  useEffect(() => {
    const fetchPinnedFlows = async () => {
      const data = await api.getPinnedFlows()
      setPinnedFlows(data.items)
    }
    fetchPinnedFlows()
  }, [])

  const handlePin = async (flow: any) => {
    try {
      const isPinned = pinnedFlows.some(f => f.url === flow.url)
      if (isPinned) {
        await api.unpinFlow(flow.url)
        setPinnedFlows(prev => prev.filter(f => f.url !== flow.url))
      } else {
        await api.pinFlow(flow.url)
        setPinnedFlows(prev => [...prev, flow])
      }
      // Trigger sidebar refresh
      refreshSidebarPinnedFlows()
    } catch (error) {
      console.error('Error handling pin:', error)
    }
  }

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags)
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 space-y-8">
            <FlowSearch
              onSearchChange={setSearchResults}
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              availableTags={[]}
            />

            <FlowInfo 
              data={{
                registryName: "Pinned Flows",
                registryDescription: "Your favorite flows that you've pinned for quick access",
                flows: pinnedFlows.map(flow => ({
                  id: flow.url.split('/').pop() || '',
                  name: flow.name,
                  description: flow.description,
                  tags: flow.tags,
                  price: 42.00,
                  author: flow.author,
                  organization: flow.organization,
                  created: flow.created,
                  modified: flow.modified,
                  isPinned: true
                })) || []
              }}
              onPin={handlePin}
              selectedTags={selectedTags}
              onTagClick={(tag) => handleTagsChange(
                selectedTags.includes(tag)
                  ? selectedTags.filter(t => t !== tag)
                  : [...selectedTags, tag]
              )}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
