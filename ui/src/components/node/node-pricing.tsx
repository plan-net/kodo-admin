'use client'

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface NodePricingProps {
  basePrice: number
  totalPrice: number
  externalNodes: Array<{
    id: number
    price: number
  }>
  onBasePriceChange: (value: number) => void
  onExternalNodePriceChange: (id: number, value: number) => void
}

export function NodePricing({
  basePrice,
  totalPrice,
  externalNodes,
  onBasePriceChange,
  onExternalNodePriceChange
}: NodePricingProps) {
  return (
    <Card className="p-6 bg-card-background border-border">
      <h2 className="text-xl font-semibold mb-6">Permanent Actions</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Set price per run</label>
            <div className="relative">
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => onBasePriceChange(Number(e.target.value))}
                className="pl-6 bg-card-background border-border"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Total auto-calculated price</label>
            <div className="relative">
              <Input
                type="number"
                value={totalPrice}
                disabled
                className="pl-6 bg-[#18181B] border-gray-700"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {externalNodes.map((node) => (
            <div key={node.id} className="space-y-2">
              <label className="text-sm text-gray-400">Price of external node {node.id}</label>
              <div className="relative">
                <Input
                  type="number"
                  value={node.price}
                  onChange={(e) => onExternalNodePriceChange(node.id, Number(e.target.value))}
                  className="pl-6 bg-[#18181B] border-gray-700"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
} 