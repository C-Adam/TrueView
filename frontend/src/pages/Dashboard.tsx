import { useLocation, useNavigate } from "react-router-dom";
import { AnalysisReasoning } from "@/components/AnalysisReasoning";
import { useState } from "react";

interface VerdictProps {
  label: string;
  value: number;
  detected: boolean;
  type: "AI" | "Deepfake";
}

const AnalysisVerdict = ({ label, value, detected, type }: VerdictProps) => {
  const color = detected ? "text-red-500" : "text-green-500";
  const ringColor = detected ? "text-red-500" : "text-green-500";

  // Separate logic for AI vs Deepfake
  let statusText = "";
  if (type === "AI") {
    statusText = detected ? "Made by AI" : "Not Made by AI";
  } else if (type === "Deepfake") {
    statusText = detected ? "Deepfake Detected" : "Not a Deepfake";
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 flex items-center gap-4 w-full">
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-600/40" />
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${(value / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`} strokeLinecap="round" className={ringColor} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${color}`}>{value.toFixed(1)}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-300">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{statusText}</p>
      </div>
    </div>
  );
};

interface MetricData {
  display_name: string;
  actual_value: number;
  expected_range: string;
  analysis: string;
  status: string;
}

const MetricBox = ({ metric }: { metric: MetricData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-400';
      case 'suspicious_low':
      case 'suspicious_high':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`text-3xl font-bold ${getStatusColor(metric.status)}`}>
              {typeof metric.actual_value === 'number' 
                ? metric.actual_value.toFixed(2) 
                : metric.actual_value}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{metric.display_name}</h3>
              <p className="text-sm text-gray-400">Expected: {metric.expected_range}</p>
            </div>
          </div>
          <div className="text-white text-xl">
            {isOpen ? '▼' : '▶'}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-white/10">
          <p className="text-sm text-gray-300 leading-relaxed">
            {metric.analysis}
          </p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safe destructure from navigation state
  const state = location.state as
    | {
        file: {
          path: string;
          filename: string;
          size: number;
          type: string;
          ai_confidence: number;
          ai_detected: boolean;
          briefOverview?: string;
          metricExplanations?: MetricData[];
          deepfake_confidence: number;
          is_deepfake: boolean;
        };
      }
    | undefined;

  const fileUrl = state?.file?.path ? `http://localhost:8000${state.file.path}` : "";
  const isVideo = state?.file?.type === 'video';

  const aiDetected = state?.file?.ai_detected ?? false;
  const aiConfidence = (state?.file?.ai_confidence ?? 0) * 100;
  const deepfakeDetected = state?.file?.is_deepfake ?? false;
  const deepfakeConfidence = (state?.file?.deepfake_confidence ?? 0) * 100;

  // ✅ Use briefOverview from backend if available
  const briefOverview = state?.file?.briefOverview || "";
  
  // ✅ Get metric explanations from backend
  const metricExplanations = state?.file?.metricExplanations || [];
  
  // Debug logging
  console.log("Dashboard received state:", state);
  console.log("Brief Overview:", briefOverview);
  console.log("Metric Explanations:", metricExplanations);
  
  const reasoningPoints = briefOverview
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      return line.replace(/^[•\-\*]\s*/, '')  // Remove •, -, * bullets
                 .replace(/^\d+\.\s*/, '')     // Remove numbered lists (1., 2., etc.)
                 .replace(/^\*\*\d+\.\*\*\s*/, '') // Remove **1.** style
                 .trim();
    })
    .filter(line => line.length > 0);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* === Background Video === */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-20">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/* === Content === */}
      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-end">
          <button onClick={() => navigate("/upload")} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-purple-400/30 transition">
            ← Back to Upload
          </button>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI or Not Report</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">{isVideo ? <video src={fileUrl} controls className="w-full rounded-xl" /> : <img src={fileUrl} alt="Uploaded Media" className="w-full rounded-xl" />}</div>

            {/* Two side-by-side verdicts */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AnalysisVerdict label="AI Analysis" type="AI" value={aiConfidence} detected={aiDetected} />
              <AnalysisVerdict label="Deepfake Detection" type="Deepfake" value={deepfakeConfidence} detected={deepfakeDetected} />
            </div>

            <AnalysisReasoning reasons={reasoningPoints} />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            {metricExplanations.length > 0 ? (
              metricExplanations.map((metric, index) => (
                <MetricBox key={index} metric={metric} />
              ))
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <p className="text-gray-300">Loading metrics...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
