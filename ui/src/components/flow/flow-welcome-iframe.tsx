'use client'

import React from 'react';

interface FlowWelcomeProps {
  url?: string;
  reloadCounter?: number;
}

export function FlowWelcomeIFrame({ url, reloadCounter }: FlowWelcomeProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);
    setKey(prev => prev + 1);
  }, [url, reloadCounter]);

  return (
    <div className="rounded-lg border border-border bg-background p-6 w-full h-[800px] relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 z-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      <iframe
        key={key}
        allow="same-origin"
        allowScripts
        src={url}
        className="w-full h-full"
        frameBorder="0"
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
} 