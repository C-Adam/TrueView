import { Card } from "@/components/ui/card";

interface AnalysisReasoningProps {
  reasons: string[];
}

export const AnalysisReasoning = ({ reasons }: AnalysisReasoningProps) => {
  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-white mb-3">Brief Points for Reasoning</h3>
      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
