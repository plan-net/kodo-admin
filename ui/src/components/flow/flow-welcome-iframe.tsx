'use client'

interface FlowWelcomeProps {
  url?: string;
}

export function FlowWelcomeIFrame({ url }: FlowWelcomeProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-6 w-full h-[800px]">
      <iframe
        allow="same-origin" allow-scripts
        src={url}
        className="w-full h-full"
        frameBorder="0"
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
} 