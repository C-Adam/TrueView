import { Card } from "@/components/ui/card";

interface AnalysisReasoningProps {
  reasons: string[];
}

export const AnalysisReasoning = ({ reasons }: AnalysisReasoningProps) => {
  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-semibold text-foreground mb-3">Brief Points for Reasoning</h3>
      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="text-primary mt-0.5">•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
