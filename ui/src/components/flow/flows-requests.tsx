import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { api } from '@/lib/api'

interface FlowsRequestsProps {
  data: {
    result: Array<{
      fid: string
      status: string
      start_time: string
      end_time: string
      total: number
      flow: {
        url: string
        name: string
        description: string
        author: string
        tags: string[]
      }
      inactive: boolean | null
      alive: boolean | null
      event_stream: string
      stderr: string
      stdout: string
      state: string
    }>
    total: number
    p: number
    pp: number
  }
}

function ResultPopup({ content, onClose }: { content: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-background p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  )
}

export function FlowsRequests({ data }: FlowsRequestsProps) {
  const [popup, setPopup] = useState<{type: string; content: string} | null>(null)

  const handleResultClick = async (type: string, fid: string) => {
    try {
      let content = ''
      switch (type) {
        case 'Event Stream':
          content = await api.getFlowSteps(fid)
          break
        case 'StdErr':
          content = await api.getFlowErrors(fid)
          break
        case 'StdOut':
          content = await api.getFlowOutput(fid)
          break
        case 'State':
          content = item.state // This comes directly from the table data
          break
      }
      setPopup({ type, content })
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
      setPopup({ type, content: `Error fetching ${type} data` })
    }
  }

  if (!data?.result) return null

  return (
    <div className="rounded-lg border border-gray-800 bg-[#101012]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-800">
            <TableHead className="text-gray-400">
              <input type="checkbox" className="rounded border-gray-700" />
            </TableHead>
            <TableHead className="text-gray-400">Flow</TableHead>
            <TableHead className="text-gray-400">Time</TableHead>
            <TableHead className="text-gray-400">Duration</TableHead>
            <TableHead className="text-gray-400">Author</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Result</TableHead>
            <TableHead className="text-gray-400 w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.result.map((item) => (
            <TableRow key={item.fid} className="border-gray-800">
              <TableCell>
                <input type="checkbox" className="rounded border-gray-700" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{item.flow.name}</span>
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">{item.flow.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{new Date(item.start_time).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">{new Date(item.start_time).toLocaleTimeString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <span>{item.total.toFixed(2)}s</span>
              </TableCell>
              <TableCell>
                <span>{item.flow.author}</span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    item.status === 'running' ? 'default' :
                    item.status === 'error' ? 'destructive' :
                    item.status === 'pending' ? 'secondary' :
                    'success'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                    onClick={() => handleResultClick('Event Stream', item.fid)}
                  >
                    event stream
                  </button>
                  <button
                    className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                    onClick={() => handleResultClick('StdErr', item.fid)}
                  >
                    stderr
                  </button>
                  <button
                    className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                    onClick={() => handleResultClick('StdOut', item.fid)}
                  >
                    stdout
                  </button>
                  <button
                    className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                    onClick={() => handleResultClick('State', item.fid)}
                  >
                    state
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <button className="p-2 hover:bg-gray-800 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {popup && (
        <ResultPopup
          content={popup.content}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
} 