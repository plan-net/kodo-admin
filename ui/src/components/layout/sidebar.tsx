'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
import { LayoutDashboard, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

// Update Flow interface to match FlowCard's data structure exactly
interface Flow {
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
}

// Add props interface
interface SidebarProps {
  selectedAction: string;
  onActionSelect: (action: string) => void;
  onFlowSelect?: (flow: Flow) => void;
  pinnedFlows: Flow[];
}

function SidebarContent({ 
  selectedAction, 
  onActionSelect, 
  onFlowSelect,
  pinnedFlows  // Add this prop
}: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const selectedFlowId = searchParams.get('flowId')
  const showFlowRef = useRef<((flow: Flow) => void) | null>(null)

  const handleFlowClick = (flow: Flow) => {
    if (onFlowSelect) {  // Use the passed down prop instead of showFlowRef
      onFlowSelect(flow)
    }
  }

  return (
    <div 
      data-sidebar 
      ref={(el) => {
        if (el) {
          // @ts-ignore - we'll add a custom property to the element
          el.setShowFlow = (fn: (flow: Flow) => void) => {
            showFlowRef.current = fn
          }
        }
      }}
      className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen text-gray-100 fixed left-0 top-0 flex flex-col border-r border-border/50 transition-all duration-300`}
    >
      <div className="p-4 flex-1">
        {/* Logo section with toggle button */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50 relative">
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 bg-primary rounded"></div>
              <span className="font-semibold">kodosoumi</span>
            </>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-card hover:bg-card-hover rounded-full flex items-center justify-center transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Pinned Flows section */}
        <div>
          {!isCollapsed && (
            <h2 className="text-xs font-medium text-muted-foreground uppercase mb-2 px-2">
              Pinned ({pinnedFlows.length})
            </h2>
          )}
          <nav className="space-y-1 bg-card-background p-2 rounded-lg border border-border/50">
            {pinnedFlows.length > 0 ? (
              pinnedFlows.map((flow) => (
                <button
                  key={flow.url}
                  onClick={() => handleFlowClick(flow)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFlowId === flow.url.split('/').pop()
                      ? 'bg-card-hover text-foreground'
                      : 'hover:bg-card-hover/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {isCollapsed ? (
                      <span>{flow.name.charAt(0)}</span>
                    ) : (
                      <span>{flow.name}</span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-2">
                No pinned flows
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="p-4 mb-auto">
        <nav className="space-y-1 bg-card-background p-2 rounded-lg border border-border/50">
          <button
            onClick={() => onActionSelect('Dashboard')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              selectedAction === 'Dashboard'
                ? 'bg-card-hover text-foreground' 
                : 'hover:bg-card-hover/50 text-muted-foreground'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>
        </nav>
      </div>
    </div>
  )
}

// Update Sidebar component to pass through props
export function Sidebar({ selectedAction, onActionSelect, onFlowSelect, pinnedFlows }: SidebarProps) {
  return (
    <Suspense fallback={<div>Loading sidebar...</div>}>
      <SidebarContent 
        selectedAction={selectedAction} 
        onActionSelect={onActionSelect}
        onFlowSelect={onFlowSelect}
        pinnedFlows={pinnedFlows}
      />
    </Suspense>
  )
} 