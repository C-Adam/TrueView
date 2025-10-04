import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ConclusionPoint {
  text: string;
  isPositive: boolean;
}

const conclusionPoints: ConclusionPoint[] = [
  { text: "Image shows consistent lighting and shadow patterns typical of genuine photographs", isPositive: true },
  { text: "No detectable AI generation artifacts or anomalies in texture patterns", isPositive: true },
  { text: "Metadata and EXIF data are intact and consistent with the claimed source", isPositive: true },
  { text: "Minor compression artifacts detected, but within normal range for web images", isPositive: false },
  { text: "Overall authenticity confidence: High (87% likely genuine)", isPositive: true },
];

export const ConclusionSummary = () => {
  return (
    <Card className="w-full p-8 bg-gradient-to-br from-card via-card to-secondary/10 border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Conclusion</h2>
        </div>

        <div className="grid gap-4">
          {conclusionPoints.map((point, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {point.isPositive ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning-indicator flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-foreground/90 leading-relaxed">{point.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground text-center">
            This analysis uses multiple detection algorithms and should be used as guidance. 
            For critical verification, consult additional forensic tools.
          </p>
        </div>
      </div>
    </Card>
  );
};
