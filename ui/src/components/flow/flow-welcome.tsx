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
        let htmlContent = await response.text()
        
        // Remove existing stylesheet links and modify classes to use Tailwind
        htmlContent = htmlContent
          .replace(/<link.*?>/g, '') // Remove external stylesheets
          .replace(/<header>/g, '<header class="mb-8">')
          .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-foreground mb-4">')
          .replace(/<p>/g, '<p class="text-secondary-foreground mb-4">')
          .replace(/<form/g, '<form class="space-y-4"')
          .replace(/<input type="submit"/g, '<input type="submit" class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer"')

        setContent(htmlContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [html])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle the form submission here
    // You might want to make an API call or handle the navigation
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
      </div>
    )
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