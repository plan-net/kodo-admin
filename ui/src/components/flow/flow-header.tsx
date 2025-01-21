'use client'

interface FlowHeaderProps {
  name: string
  description: string
  subtitle?: string
}

export function FlowHeader({ name, description, subtitle }: FlowHeaderProps) {
  return (
    <div className="space-y-4 pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {name || "Registry name"}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground">
          {description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>
        {description && (
          <div className="flex gap-4 text-sm">
            <a 
              href="#" 
              className="text-blue-500 hover:text-blue-400 hover:underline"
            >
              Terms and Conditions
            </a>
            <a 
              href="#" 
              className="text-blue-500 hover:text-blue-400 hover:underline"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-blue-500 hover:text-blue-400 hover:underline"
            >
              Customer Support
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 