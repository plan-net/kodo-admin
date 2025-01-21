import { Badge } from "@/components/ui/badge"

interface FlowTagProps {
  tag: string
  isSelected: boolean
  onClick: (tag: string) => void
}

export function FlowTag({ tag, isSelected, onClick }: FlowTagProps) {
  return (
    <Badge
      className={`cursor-pointer ${
        isSelected
          ? 'bg-primary hover:bg-primary/80'
          : 'bg-secondary/20 hover:bg-secondary/40'
      } text-muted border border-border px-4 py-2 rounded-lg text-sm`}
      onClick={() => onClick(tag)}
    >
      {tag}
    </Badge>
  )
} 