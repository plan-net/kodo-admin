'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { FlowInfo } from '@/components/flow/flow-info'
import { api } from '@/lib/api'
import { refreshSidebarPinnedFlows } from '@/components/layout/sidebar'

export default function DashboardPage() {
  const [pinnedFlows, setPinnedFlows] = useState<any[]>([])
  const [allFlows, setAllFlows] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState('Dashboard')
  const [selectedFlow, setSelectedFlow] = useState<any>(null)

  // Centralized function to refresh pinned flows state
  const refreshPinnedFlows = async () => {
    const data = await api.getPinnedFlows()
    setPinnedFlows(data.items)
  }

  // Add this function to fetch all flows
  const fetchAllFlows = async () => {
    const data = await api.getFlows()
    setAllFlows(data.items)
  }

  useEffect(() => {
    refreshPinnedFlows()
    fetchAllFlows()
  }, [])

  const handlePin = async (flow: any) => {
    try {
      const isPinned = pinnedFlows.some(f => f.url === flow.url)
      if (isPinned) {
        await api.unpinFlow(flow.url)
      } else {
        await api.pinFlow(flow.url)
      }
      // Refresh pinned flows state after pin/unpin
      await refreshPinnedFlows()
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

  // Helper function to check if a flow is pinned
  const isFlowPinned = (flowUrl: string) => {
    return pinnedFlows.some(f => f.url === flowUrl)
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
                flows: allFlows.map(flow => ({
                  ...flow,
                  isPinned: isFlowPinned(flow.url)
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
