import { Card } from "@/components/ui/card";

interface AnalysisVerdictProps {
  label: string;
  value: number;
  type: "AI" | "Deepfake";
  detected: boolean;
}

export const AnalysisVerdict = ({ label, value, type, detected }: AnalysisVerdictProps) => {
  // Pick colors dynamically
  const color = detected ? "text-red-500" : "text-green-500";
  const ringColor = detected ? "text-red-500" : "text-green-500";

  // Dynamic status text logic
  let statusText = "";
  if (type === "AI") {
    statusText = detected ? "Made by AI" : "Not Made by AI";
  } else if (type === "Deepfake") {
    statusText = detected ? "Deepfake Detected" : "Not a Deepfake";
  }

  return (
    <Card className="p-4 bg-white/10 backdrop-blur-lg border border-white/20 flex items-center gap-4 w-full">
      {/* Circular progress ring */}
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-600/40" />
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${(value / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`} strokeLinecap="round" className={ringColor} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${color}`}>{value.toFixed(1)}%</span>
        </div>
      </div>

      {/* Text area */}
      <div>
        <p className="text-sm text-gray-300">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{statusText}</p>
      </div>
    </Card>
  );
};
