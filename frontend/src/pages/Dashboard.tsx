import { useLocation, useNavigate } from "react-router-dom";
import { AnalysisReasoning } from "@/components/AnalysisReasoning";

const AnalysisVerdict = ({ isAIGenerated, confidence }: { isAIGenerated: boolean; confidence: number }) => {
  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90 w-16 h-16">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-600/40" />
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={0} className={isAIGenerated ? "text-red-500" : "text-green-500"} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${isAIGenerated ? "text-red-500" : "text-green-500"}`}>{confidencePercent}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-300">Analysis</p>
          <p className={`text-2xl font-bold ${isAIGenerated ? "text-red-500" : "text-green-500"}`}>{isAIGenerated ? "AI Generated" : "Not AI Generated"}</p>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, description }: { label: string; value: number; description: string }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-purple-400">{value}</div>
          <h3 className="text-lg font-semibold text-white">{label}</h3>
        </div>
      </div>
      <p className="text-sm text-gray-300 mt-2">{description}</p>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Expect flat structure, not nested
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
        };
      }
    | undefined;

  const fileUrl = state?.file?.path ? `http://localhost:8000${state.file.path}` : "";
  const isVideo = /\.(mp4|mov|mkv)$/i.test(fileUrl);
  const isAIGenerated = state?.file?.ai_detected ?? false;
  const confidence = state?.file?.ai_confidence ?? 0;

  // ✅ Use briefOverview from backend if available, otherwise use fallback
  const briefOverview = state?.file?.briefOverview || "";
  
  // Debug logging
  console.log("Dashboard received state:", state);
  console.log("Brief Overview:", briefOverview);
  
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

  const metricsData = [
    {
      label: "Monotonicity",
      value: 9,
      description: "Measures pixel uniformity and smoothness. Higher values indicate artificial generation patterns.",
    },
    {
      label: "Radius Diffusion",
      value: 4,
      description: "Analyzes how light spreads. Natural images show irregular patterns; AI ones show uniform diffusion.",
    },
    {
      label: "DALL-E Detection",
      value: 3,
      description: "Detects artifacts and composition markers typical of DALL-E images.",
    },
    {
      label: "Flux Detection",
      value: 2,
      description: "Identifies visual blending and layer patterns unique to Flux-based models.",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* === Background Video === */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-20">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/* === Content === */}
      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <div className="flex justify-end">
          <button onClick={() => navigate("/upload")} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-purple-400/30 transition">
            ← Back to Upload
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI or Not Report</h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Side */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">{isVideo ? <video src={fileUrl} controls className="w-full rounded-xl" /> : <img src={fileUrl} alt="Uploaded Media" className="w-full rounded-xl" />}</div>

            <AnalysisVerdict isAIGenerated={isAIGenerated} confidence={confidence} />
            <AnalysisReasoning reasons={reasoningPoints} />
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            {metricsData.map((metric, index) => (
              <MetricBox key={index} label={metric.label} value={metric.value} description={metric.description} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
