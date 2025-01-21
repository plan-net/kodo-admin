import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FlowCardProps {
  data: {
    id: string
    name: string
    description: string
    tags: string[]
    price: number
    author: string
    organization: string
    created: string
    modified: string
  }
  onPin: () => void
  onShow: () => void
}

export function FlowCard({ data, onPin, onShow }: FlowCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">{data.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {data.tags.map((tag) => (
          <Badge 
            key={tag}
            variant="secondary"
            className="px-2 py-0.5 text-xs font-normal"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <div>
          {console.log('Price value:', data.price)}
          <Badge variant="outline" className="text-xs">
            Price: ${data.price?.toFixed(2) || '0.00'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPin}
            className="flex-1"
          >
            Pin to Favorites
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onShow}
            className="w-20"
          >
            Show
          </Button>
        </div>
      </div>
    </div>
  )
} 