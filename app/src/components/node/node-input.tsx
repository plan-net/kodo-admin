'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Expand, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"

interface NodeInputProps {
  onSubmit: (data: any) => void
  onClear: () => void
}

export function NodeInput({ onSubmit, onClear }: NodeInputProps) {
  return (
    <Card className="bg-background-darker border-border">
      <CardHeader>
        <CardTitle className="text-xl">Node Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Input 1 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Text Input 1</label>
            <span className="text-sm text-muted">127/250</span>
          </div>
          <div className="relative">
            <Input
              className="min-h-[96px]"
              placeholder="Input's description, provided by the node"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Text Input 2 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Text Input 2</label>
            <span className="text-sm text-muted">127/250</span>
          </div>
          <div className="relative">
            <Input
              className="min-h-[96px]"
              placeholder="Input's description, provided by the node"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Image Upload</label>
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-background-input rounded-lg flex items-center justify-center">
                <span className="text-2xl text-muted">+</span>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Node's Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Node's Mode</label>
          <select className="w-full bg-input text-foreground border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Select</option>
          </select>
        </div>

        {/* Features Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Turn Node's Features On/Off</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Feature 1</span>
              <div className="w-8 h-4 bg-primary rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Feature 2</span>
              <div className="w-8 h-4 bg-muted rounded-full" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClear}>Clear</Button>
          <Button onClick={() => onSubmit({})}>Submit</Button>
        </div>
      </CardContent>
    </Card>
  )
} 