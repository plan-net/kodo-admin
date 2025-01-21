'use client'

interface FlowHeaderProps {
  name: string
  description: string
}

export function FlowHeader({ name, description }: FlowHeaderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {name}
      </h1>
      <div className="space-y-2">
        <p className="text-muted-foreground">
          {description}
        </p>
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
      </div>
    </div>
  )
} 