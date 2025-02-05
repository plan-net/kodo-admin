'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { FlowInfo } from '@/components/flow/flow-info'
import { api } from '@/lib/api'
import { refreshSidebarPinnedFlows } from '@/components/layout/sidebar'

export default function DashboardPage() {
  const [pinnedFlows, setPinnedFlows] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState('Dashboard')
  const [selectedFlow, setSelectedFlow] = useState<any>(null)

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

  const handleShowFlow = (flow: any) => {
    setSelectedFlow(flow)
    setSelectedAction('Welcome')
  }

  return (
    <div className="flex">
      <Sidebar 
        selectedAction={selectedAction}
        onActionSelect={setSelectedAction}
        pinnedFlows={pinnedFlows}
        onFlowSelect={handleShowFlow}
      />

      <main className="flex-1 ml-[250px] min-h-screen text-gray-100">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 space-y-8">
            <FlowInfo 
              data={{
                registryName: "Registry name",
                registryDescription: "Lorem ipsum dolor sit amet",
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
                }))
              }}
              selectedAction={selectedAction}
              onActionSelect={setSelectedAction}
              onPin={handlePin}
              selectedTags={selectedTags}
              onTagClick={(tag) => handleTagsChange(
                selectedTags.includes(tag)
                  ? selectedTags.filter(t => t !== tag)
                  : [...selectedTags, tag]
              )}
              selectedFlow={selectedFlow}
              onShowFlow={handleShowFlow}
              ref={(flowInfo) => {
                if (flowInfo) {
                  const sidebar = document.querySelector('[data-sidebar]')
                  if (sidebar) {
                    // @ts-ignore - use the custom setShowFlow method
                    sidebar.setShowFlow((flow) => flowInfo.handleShowFlow(flow))
                  }
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
