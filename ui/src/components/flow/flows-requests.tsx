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

interface FlowDetailsData {
  status: string;
  total: number;
  bootup: number;
  runtime: number;
  teardown: number;
  version: string;
  entry_point: string;
  flow: {
    url: string;
    name: string;
    description: string;
    author: string;
    tags: string[];
    entry: string;
  };
  fid: string;
  executor: string;
  ray: string | null;
  stdout: number;
  stderr: number;
  inactive: boolean | null;
  pid: number;
  ppid: number;
}

export function FlowsRequests({ data, onFlowRemoved }: FlowsRequestsProps) {
  const [popup, setPopup] = useState<{type: string; content: string} | null>(null)
  const [statusPopup, setStatusPopup] = useState<FlowDetailsData | null>(null)
  const [flowResults, setFlowResults] = useState(data.result)

  const handleResultClick = async (type: string, fid: string) => {
    try {
      let content = ''
      switch (type) {
        case 'Status':
          const details = await api.getFlowDetails(fid)
          setStatusPopup(details)
          return
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
      setFlowResults(prev => prev.filter(flow => flow.fid !== fid))
    } catch (error) {
      console.error('Error removing flow:', error)
    }
  }

  if (!flowResults) return null

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
          {flowResults.map((item) => (
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
                    onClick={() => handleResultClick('Status', item.fid)}
                  >
                    status
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

      {statusPopup && (
        <StatusPopup
          data={statusPopup}
          onClose={() => setStatusPopup(null)}
          onResultClick={handleResultClick}
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
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

function StatusPopup({ 
  data, 
  onClose,
  onResultClick 
}: { 
  data: FlowDetailsData; 
  onClose: () => void;
  onResultClick: (type: string, fid: string) => void;
}) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[50]"
      onClick={onClose}
    >
      <div 
        className="bg-[#101012] rounded-lg p-6 w-full max-w-4xl border border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-medium mb-6">Details</h3>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-400 mb-1">Flow ID</h4>
              <div className="flex items-center justify-between">
                <p className="font-mono truncate">{data.fid}</p>
                <button className="p-1 hover:bg-gray-800 rounded flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 1.5H11M1.5 3.5H13.5M12.5 3.5L11.957 12.5193C11.8885 13.3454 11.1838 14 10.3547 14H4.64534C3.81622 14 3.11148 13.3454 3.04301 12.5193L2.5 3.5H12.5ZM5.5 6.5V10.5V6.5ZM9.5 6.5V10.5V6.5Z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">Flow's Name</h4>
              <div className="flex items-center justify-between">
                <p className="truncate">{data.flow.name}</p>
                <button className="p-1 hover:bg-gray-800 rounded flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">Author</h4>
              <div className="flex items-center justify-between">
                <p className="truncate">{data.flow.author}</p>
                <button className="p-1 hover:bg-gray-800 rounded flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 1.5C4.5 1.5 2 4 2 7C2 10 4.5 12.5 7.5 12.5C10.5 12.5 13 10 13 7C13 4 10.5 1.5 7.5 1.5ZM7.5 11.5C5 11.5 3 9.5 3 7C3 4.5 5 2.5 7.5 2.5C10 2.5 12 4.5 12 7C12 9.5 10 11.5 7.5 11.5Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-400 mb-1">Organization</h4>
              <div className="flex items-center justify-between">
                <p className="truncate">{data.flow.url.split('/')[3]}</p>
                <button className="p-1 hover:bg-gray-800 rounded flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">Flow's Homepage</h4>
              <div className="flex items-center justify-between">
                <p className="text-blue-500 truncate">{data.flow.url}</p>
                <button className="p-1 hover:bg-gray-800 rounded flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-1">RESULT</h4>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                  onClick={() => onResultClick('Event Stream', data.fid)}
                >
                  event stream
                </button>
                <button
                  className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                  onClick={() => onResultClick('StdErr', data.fid)}
                >
                  stderr
                </button>
                <button
                  className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-secondary/80"
                  onClick={() => onResultClick('StdOut', data.fid)}
                >
                  stdout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 