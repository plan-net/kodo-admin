'use client'

import { useEffect, useState } from 'react'
import { RequestsTable } from '@/components/node/requests-table'
import { NodeRevenueStats } from '@/components/node/revenue-stats'
import { NodeRevenueChart } from '@/components/node/revenue-chart'
import { Sidebar } from '@/components/layout/sidebar'
import { NodeInfo } from '@/components/node/node-info'
import { api } from '@/lib/api'
import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const selectedNodeId = searchParams.get('nodeId')
  
  const [data, setData] = useState({
    nodes: null,
    requests: null,
    stats: null,
    selectedNode: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (selectedNodeId) {
        const nodeDetails = await api.getNodeDetails(selectedNodeId)
        setData(prev => ({ ...prev, selectedNode: nodeDetails }))
      } else {
        const [nodes, requests, stats] = await Promise.all([
          api.getNodes(),
          api.getRequestsData(),
          api.getStatsData(),
        ])
        setData({ nodes, requests, stats, selectedNode: null })
      }
    }
    fetchData()
  }, [selectedNodeId])

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 space-y-8">
            {selectedNodeId ? (
              <NodeInfo data={data.selectedNode} />
            ) : (
              <>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <NodeStatus data={data.nodes} />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <NodeRevenueStats data={data.stats} />
                </div>

                <div className="grid gap-4">
                  <RequestsTable data={data.requests} />
                </div>

                <div className="grid gap-4">
                  <NodeRevenueChart data={data.stats?.revenue} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
