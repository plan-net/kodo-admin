'use client'

import { useEffect, useState } from 'react'

interface FlowWelcomeProps {
  html: string;
}

export function FlowWelcome({ html }: FlowWelcomeProps) {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(html)
        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }
        const htmlContent = await response.text()
        setContent(htmlContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [html])

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-secondary/20 rounded-lg" />
  }

  if (error) {
    return <div className="text-red-500 p-4 border border-red-200 rounded-lg">{error}</div>
  }

  return (
    <div 
      className="rounded-lg border border-border bg-background p-6 w-full"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 