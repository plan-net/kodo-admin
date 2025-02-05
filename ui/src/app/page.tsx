'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { FlowInfo } from '@/components/flow/flow-info'
import { api } from '@/lib/api'
import { refreshSidebarPinnedFlows } from '@/components/layout/sidebar'

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pinnedFlows, setPinnedFlows] = useState<any[]>([])
  const [allFlows, setAllFlows] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState('Dashboard')
  const [selectedFlow, setSelectedFlow] = useState<any>(null)
  const [reloadCounter, setReloadCounter] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        await Promise.all([
          refreshPinnedFlows(),
          fetchAllFlows()
        ])
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Centralized pin handling function
  const handlePin = async (flow: any) => {
    try {
      const isPinned = pinnedFlows.some(f => f.url === flow.url)
      if (isPinned) {
        await api.unpinFlow(flow.url)
      } else {
        await api.pinFlow(flow.url)
      }
      // Refresh both pinned flows and all flows to ensure consistency
      await refreshPinnedFlows()
      await fetchAllFlows()
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
    setReloadCounter(prev => prev + 1)
  }

  // Helper function to check if a flow is pinned
  const isFlowPinned = (flowUrl: string) => {
    return pinnedFlows.some(f => f.url === flowUrl)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar 
        selectedAction={selectedAction}
        onActionSelect={setSelectedAction}
        pinnedFlows={pinnedFlows}
        onFlowSelect={handleShowFlow}
        isCollapsed={isCollapsed}
        onCollapse={setIsCollapsed}
      />

      <main className={`flex-1 transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="h-full overflow-auto">
          <div className="p-8 space-y-8">
            <FlowInfo 
              data={{
                registryName: "Registry name",
                registryDescription: "Lorem ipsum dolor sit amet",
                flows: allFlows.map(flow => ({
                  ...flow,
                  isPinned: pinnedFlows.some(f => f.url === flow.url)
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
              pinnedFlows={pinnedFlows}
              reloadCounter={reloadCounter}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
