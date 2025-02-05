'use client'

import { useState, useEffect } from 'react'
import { api } from "@/lib/api"
import { refreshSidebarPinnedFlows } from '@/components/layout/sidebar'

interface FlowHeaderProps {
  name: string
  description: string
  subtitle?: string
  tags?: string[]
  url: string
  isPinned: boolean
  onPin: (flow: FlowData) => Promise<void>
  onTagClick?: (tag: string) => void
}

export function FlowHeader({ 
  name, 
  description, 
  subtitle,
  tags = [],
  url,
  isPinned,
  onPin,
  onTagClick 
}: FlowHeaderProps) {

  const handlePinClick = () => {
    onPin({
      url,
      name,
      description,
      tags
    })
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {name || "Registry name"}
          </h1>
          <button
            onClick={handlePinClick}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400"
          >
            {isPinned ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L9.5 8.5 2 9.8l5 4.7L5.5 22l6.5-3.4 6.5 3.4-1.5-7.5 5-4.7-7.5-1.3z"/>
                </svg>
                Unpin
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L9.5 8.5 2 9.8l5 4.7L5.5 22l6.5-3.4 6.5 3.4-1.5-7.5 5-4.7-7.5-1.3z"/>
                </svg>
                Pin
              </>
            )}
          </button>
        </div>
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
        <div className="flex flex-col items-end gap-2">
          {tags && tags.length > 0 && (
            <div className="flex gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="px-2 py-1 text-xs rounded-full bg-secondary hover:bg-secondary/80"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          {description && (
            <div className="flex justify-end gap-4 text-sm">
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
    </div>
  )
} 