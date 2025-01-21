'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

interface Flow {
  name: string
  description: string
  url: string
  heartbeat: string | null
  tags: string[]
}

export function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [flows, setFlows] = useState<Flow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const selectedFlowId = searchParams.get('flowId')
  
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const response = await api.getFlows()
        setFlows(response.items)
      } catch (error) {
        console.error('Failed to fetch flows:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlows()
  }, [])

  const handleFlowClick = (flowUrl: string) => {
    const flowId = flowUrl.split('/').pop()
    router.push(`/?flowId=${flowId}`)
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen text-gray-100 fixed left-0 top-0 flex flex-col border-r border-border/50 transition-all duration-300`}>
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
        
        {/* Flows section */}
        <div>
          {!isCollapsed && <h2 className="text-xs font-medium text-muted-foreground uppercase mb-2 px-2">Flows</h2>}
          <nav className="space-y-1 bg-card-background p-2 rounded-lg border border-border/50">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-10 bg-gray-800/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              flows.map((flow) => (
                <button
                  key={flow.url}
                  onClick={() => handleFlowClick(flow.url)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFlowId === flow.url.split('/').pop()
                      ? 'bg-card-hover text-foreground'
                      : 'hover:bg-card-hover/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {isCollapsed ? (
                      <span className={`w-2 h-2 rounded-full mx-auto ${
                        flow.heartbeat ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    ) : (
                      <>
                        <span>{flow.name}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          flow.heartbeat ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </>
                    )}
                  </div>
                </button>
              ))
            )}
          </nav>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="p-4 mb-auto">
        <nav className="space-y-1 bg-card-background p-2 rounded-lg border border-border/50">
          <button
            onClick={() => router.push('/')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              !selectedFlowId 
                ? 'bg-card-hover text-foreground' 
                : 'hover:bg-card-hover/50 text-muted-foreground'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>
          <Link
            href="/registry-health"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === '/registry-health'
                ? 'bg-card-hover text-foreground'
                : 'hover:bg-card-hover/50 text-muted-foreground'
            }`}
          >
            <Activity className="w-4 h-4" />
            {!isCollapsed && <span>Registry Health</span>}
          </Link>
        </nav>
      </div>
    </div>
  )
} 