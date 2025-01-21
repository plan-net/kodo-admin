"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { type InputProps } from "./input";

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: (tags: string[]) => void;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          "flex w-full flex-wrap gap-2 rounded-lg bg-secondary px-4 py-2 text-foreground",
          className
        )}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary" className="bg-secondary/20 text-muted border border-border px-2 py-1 rounded-md text-sm">
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-4 w-4 hover:bg-secondary/40"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
        <input
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };