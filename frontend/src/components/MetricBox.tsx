import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MetricBoxProps {
  label: string;
  value: number;
  description: string;
  isWarning?: boolean;
}

export const MetricBox = ({ label, value, description, isWarning = false }: MetricBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getColor = () => {
    if (isWarning) return "hsl(var(--warning-indicator))";
    return value > 50 ? "hsl(var(--fake-indicator))" : "hsl(var(--real-indicator))";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-[hsl(var(--metric-bg))] border-[hsl(var(--metric-border))] hover:border-primary/30 transition-all duration-300">
        <CollapsibleTrigger className="w-full p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="8"
                    strokeDasharray={`${(value / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold" style={{ color: getColor() }}>
                    {value}%
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground/90">{label}</span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-foreground/60 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 border-t border-border/50">
            <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
