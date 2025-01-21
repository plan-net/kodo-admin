'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { FlowInfo } from '@/components/flow/flow-info'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [pinnedFlows, setPinnedFlows] = useState<any[]>([])

  useEffect(() => {
    const fetchPinnedFlows = async () => {
      const data = await api.getPinnedFlows()
      setPinnedFlows(data.items)
    }
    fetchPinnedFlows()
  }, [])

  const handlePin = async (flow: any) => {
    const isPinned = pinnedFlows.some(f => f.url === flow.url)
    if (isPinned) {
      await api.unpinFlow(flow.url)
      setPinnedFlows(prev => prev.filter(f => f.url !== flow.url))
    } else {
      await api.pinFlow(flow)
      setPinnedFlows(prev => [...prev, flow])
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 space-y-8">
            <FlowInfo data={{
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
            />
          </div>
        </div>
      </main>
    </div>
  )
}
