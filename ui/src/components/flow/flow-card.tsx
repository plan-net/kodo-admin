import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { refreshSidebarPinnedFlows } from '@/components/layout/sidebar'
import { FlowTag } from "./flow-tag"

interface FlowCardProps {
  data: {
    url: string
    name: string
    description: string
    tags: string[]
    price: number
    author: string
    organization: string
    created: string
    modified: string
    isPinned: boolean
  }
  onPin: (flow: any) => void
  onShow: (data: { url: string; name: string; description: string; tags: string[]; price: number; author: string; organization: string; created: string; modified: string }) => void
  selectedTags?: string[]
  onTagClick?: (tag: string) => void
}

export function FlowCard({ data, onPin, onShow, selectedTags = [], onTagClick = () => {} }: FlowCardProps) {
  const [isPinned, setIsPinned] = useState(data.isPinned)

  useEffect(() => {
    api.isFlowPinned(data.url).then(setIsPinned)
  }, [data.url])

  const handlePinClick = async () => {
    try {
      if (isPinned) {
        await api.unpinFlow(data.url)
        setIsPinned(false)
      } else {
        await api.pinFlow(data.url)
        setIsPinned(true)
      }
      
      // Call the onPin prop handler
      onPin(data)
      
      // Trigger sidebar refresh
      refreshSidebarPinnedFlows()
    } catch (error) {
      console.error('Error toggling pin status:', error)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">{data.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {data.tags.map((tag) => (
          <FlowTag
            key={tag}
            tag={tag}
            isSelected={selectedTags.includes(tag)}
            onClick={onTagClick}
          />
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
            onClick={handlePinClick}
            className="flex-1"
          >
            {isPinned ? 'Unpin' : 'Pin to Favorites'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onShow(data)}
            className="w-20"
          >
            Show
          </Button>
        </div>
      </div>
    </div>
  )
} 