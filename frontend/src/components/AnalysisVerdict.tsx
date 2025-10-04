import { Card } from "@/components/ui/card";

interface AnalysisVerdictProps {
  value: number;
  type: "AI" | "Real";
}

export const AnalysisVerdict = ({ value, type }: AnalysisVerdictProps) => {
  const getColor = () => {
    return type === "AI" ? "hsl(var(--fake-indicator))" : "hsl(var(--real-indicator))";
  };

  return (
    <Card className="p-4 bg-[hsl(var(--metric-bg))] border-[hsl(var(--metric-border))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
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
          <div>
            <h3 className="text-sm font-medium text-foreground/60 mb-1">Analysis</h3>
            <p className="text-lg font-bold text-foreground">{value}% {type}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
