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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  onFlowRemoved?: () => void
}

export function FlowsRequests({ data, onFlowRemoved }: FlowsRequestsProps) {
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

  const handleRemoveFlow = async (fid: string) => {
    try {
      await api.removeFlow(fid)
      if (onFlowRemoved) {
        onFlowRemoved()
      }
    } catch (error) {
      console.error('Error removing flow:', error)
      // You might want to show an error message to the user
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-gray-800 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => handleRemoveFlow(item.fid)}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

interface ResultPopupProps {
  content: string
  onClose: () => void
}

function ResultPopup({ content, onClose }: ResultPopupProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#101012] rounded-lg p-4 w-full max-w-3xl max-h-[80vh] overflow-auto border border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Result</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded"
          >
            ✕
          </button>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-sm bg-black/30 p-4 rounded">
          {content}
        </pre>
      </div>
    </div>
  )
} 