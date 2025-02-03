'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Expand } from "lucide-react"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"

interface FlowOutputProps {
  flowId: string
  initialOutput?: string
  initialSteps?: string
}

export function FlowOutput({ 
  flowId,
  initialOutput = "No output available",
  initialSteps = "No steps available"
}: FlowOutputProps) {
  const [outputData, setOutputData] = useState<{
    output: string;
    flowSteps: string[];
  }>({
    output: initialOutput,
    flowSteps: [initialSteps]
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!flowId) return;

    console.log('Fetching data for flowId:', flowId);

    const fetchData = async () => {
      try {
        // Fetch output and steps in parallel
        const [outputResult, stepsResult] = await Promise.all([
          api.getFlowOutput(flowId),
          api.getFlowSteps(flowId)
        ]);

        // Handle output
        try {
          const parsedOutput = JSON.parse(outputResult);
          setOutputData(prev => ({
            ...prev,
            output: parsedOutput.output || parsedOutput
          }));
        } catch (e) {
          setOutputData(prev => ({
            ...prev,
            output: outputResult
          }));
        }

        // Handle steps
        try {
          const parsedSteps = JSON.parse(stepsResult);
          setOutputData(prev => ({
            ...prev,
            flowSteps: [parsedSteps.step || parsedSteps]
          }));
        } catch (e) {
          setOutputData(prev => ({
            ...prev,
            flowSteps: [stepsResult]
          }));
        }
      } catch (err) {
        setError('Failed to fetch flow data');
        console.error('Error fetching flow data:', err);
      }
    };

    fetchData();
  }, [flowId]);

  return (
    <Card className="bg-card-background border-border">
      <CardHeader>
        <CardTitle className="text-xl">Flow Output</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-100/10 rounded-lg border border-red-200/20">
            {error}
          </div>
        )}
        {/* Output Stream */}
        <div className="space-y-2">
          <label className="text-lg font-semibold">Output Stream</label>
          <div className="relative">
            <pre className="bg-background p-4 rounded-lg border border-border text-sm font-mono text-muted-foreground max-h-[400px] overflow-auto">
              {outputData.output}
            </pre>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => navigator.clipboard.writeText(outputData.output)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="space-y-2">
          <label className="text-lg font-semibold">Flow Steps</label>
          <div className="relative">
            <pre className="bg-background p-4 rounded-lg border border-border text-sm font-mono text-muted-foreground max-h-[400px] overflow-auto">
              {outputData.flowSteps.map((step, index) => (
                <div key={index} className="py-1">{step}</div>
              ))}
            </pre>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => navigator.clipboard.writeText(outputData.flowSteps.join('\n'))}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 