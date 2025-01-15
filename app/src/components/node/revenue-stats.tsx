import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface NodeRevenueStatsProps {
  data: {
    current: {
      percentage: number
      amount: number
      growth: number
    }
  }
}

export function NodeRevenueStats({ data }: NodeRevenueStatsProps) {
  if (!data?.current) return null

  const { current } = data

  return (
    <div className="grid gap-4 grid-cols-3">
      <div className="rounded-lg border border-border bg-card-background p-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-2">Total Revenue</span>
          <span className="text-2xl font-bold">${current.amount.toLocaleString()}</span>
          <div className="flex items-center mt-2 text-sm">
            {current.growth > 0 ? (
              <span className="text-green-500 flex items-center">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                +{current.growth}%
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <ArrowDownIcon className="w-4 h-4 mr-1" />
                {current.growth}%
              </span>
            )}
            <span className="text-gray-400 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card-background p-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-2">Conversion Rate</span>
          <span className="text-2xl font-bold">{current.percentage}%</span>
          <span className="text-sm text-muted-foreground mt-2">with Node 2.3</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card-background p-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-2">Active Revenue</span>
          <span className="text-2xl font-bold">${(current.amount * 0.4).toLocaleString()}</span>
          <span className="text-sm text-muted-foreground mt-2">+201 since last hour</span>
        </div>
      </div>
    </div>
  )
} 