'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

interface Node {
  id: string
  name: string
  status: string
}

export function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const selectedNodeId = searchParams.get('nodeId')
  
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await api.getNodes()
        setNodes(response.nodes)
      } catch (error) {
        console.error('Failed to fetch nodes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNodes()
  }, [])

  const handleNodeClick = (nodeId: string) => {
    router.push(`/?nodeId=${nodeId}`)
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
        
        {/* Nodes section */}
        <div>
          {!isCollapsed && <h2 className="text-xs font-medium text-muted-foreground uppercase mb-2 px-2">Nodes</h2>}
          <nav className="space-y-1 bg-card-background p-2 rounded-lg border border-border/50">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-10 bg-gray-800/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedNodeId === node.id
                      ? 'bg-card-hover text-foreground'
                      : 'hover:bg-card-hover/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {isCollapsed ? (
                      <span className={`w-2 h-2 rounded-full mx-auto ${
                        node.status === 'Running' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    ) : (
                      <>
                        <span>{node.name}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          node.status === 'Running' ? 'bg-green-500' : 'bg-red-500'
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
              !selectedNodeId 
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