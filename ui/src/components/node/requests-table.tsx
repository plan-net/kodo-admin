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

interface RequestsTableProps {
  data: {
    requests: Array<{
      id: string
      timestamp: string
      user: string
      role: string
      input: string
      inputTokens: number
      output: string | null
      outputTokens: number
      status: string
      kind: string
    }>
  }
}

export function RequestsTable({ data }: RequestsTableProps) {
  if (!data?.requests) return null

  return (
    <div className="rounded-lg border border-gray-800 bg-[#101012]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-800">
            <TableHead className="text-gray-400">
              <input type="checkbox" className="rounded border-gray-700" />
            </TableHead>
            <TableHead className="text-gray-400">Timestamp</TableHead>
            <TableHead className="text-gray-400">User</TableHead>
            <TableHead className="text-gray-400">Input</TableHead>
            <TableHead className="text-gray-400">Output</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Kind</TableHead>
            <TableHead className="text-gray-400 w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.requests.map((request) => (
            <TableRow key={request.id} className="border-gray-800">
              <TableCell>
                <input type="checkbox" className="rounded border-gray-700" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{new Date(request.timestamp).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">{new Date(request.timestamp).toLocaleTimeString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{request.user}</span>
                  <span className="text-sm text-gray-500">{request.role}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="truncate max-w-[200px]">{request.input}</span>
                  <span className="text-sm text-gray-500">Tokens: {request.inputTokens}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="truncate max-w-[200px]">{request.output || 'NULL'}</span>
                  <span className="text-sm text-gray-500">Tokens: {request.outputTokens}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    request.status === 'Running' ? 'default' :
                    request.status === 'Error' ? 'destructive' :
                    request.status === 'Input required' ? 'secondary' :
                    'success'
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={request.kind === 'Multi Node' ? 'secondary' : 'outline'}
                  className="border-blue-500/20 bg-blue-500/10 text-blue-500"
                >
                  {request.kind}
                </Badge>
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