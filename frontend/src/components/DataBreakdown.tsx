import { Card } from "@/components/ui/card";

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

const breakdownData: BreakdownItem[] = [
  { label: "Monotonicity", value: 9, color: "hsl(var(--real-indicator))" },
  { label: "Radius Diffusion", value: 4, color: "hsl(var(--real-indicator))" },
  { label: "DALL-E", value: 3, color: "hsl(var(--real-indicator))" },
  { label: "Flux", value: 2, color: "hsl(var(--real-indicator))" },
];

export const DataBreakdown = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Data Breakdown</h3>
        <span className="text-xs text-muted-foreground">Likelihood</span>
      </div>

      <div className="space-y-3">
        {breakdownData.map((item, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-foreground/90">{item.label}</span>
            </div>
            <span className="text-sm font-bold text-primary">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          These metrics analyze various aspects of the image to determine authenticity. 
          Lower percentages indicate characteristics more consistent with genuine content.
        </p>
      </div>
    </Card>
  );
};
