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
    }>
    total: number
    p: number
    pp: number
  }
}

export function FlowsRequests({ data }: FlowsRequestsProps) {
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
            <TableHead className="text-gray-400">Tags</TableHead>
            <TableHead className="text-gray-400 w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.result.map((flow) => (
            <TableRow key={flow.fid} className="border-gray-800">
              <TableCell>
                <input type="checkbox" className="rounded border-gray-700" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{flow.flow.name}</span>
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">{flow.flow.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{new Date(flow.start_time).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">{new Date(flow.start_time).toLocaleTimeString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <span>{flow.total.toFixed(2)}s</span>
              </TableCell>
              <TableCell>
                <span>{flow.flow.author}</span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    flow.status === 'running' ? 'default' :
                    flow.status === 'error' ? 'destructive' :
                    flow.status === 'pending' ? 'secondary' :
                    'success'
                  }
                >
                  {flow.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {flow.flow.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="outline"
                      className="border-blue-500/20 bg-blue-500/10 text-blue-500"
                    >
                      {tag}
                    </Badge>
                  ))}
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
    </div>
  )
} 