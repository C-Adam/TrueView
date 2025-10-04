import { useLocation, useNavigate } from "react-router-dom";
import { AnalysisReasoning } from "@/components/AnalysisReasoning";

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
          deepfake_confidence: number;
          is_deepfake: boolean;
        };
      }
    | undefined;

  const fileUrl = state?.file?.path ? `http://localhost:8000${state.file.path}` : "";
  const isVideo = /\.(mp4|mov|mkv)$/i.test(fileUrl);

  const aiDetected = state?.file?.ai_detected ?? false;
  const aiConfidence = (state?.file?.ai_confidence ?? 0) * 100;
  const deepfakeDetected = state?.file?.is_deepfake ?? false;
  const deepfakeConfidence = (state?.file?.deepfake_confidence ?? 0) * 100;

  const reasoningPoints = aiDetected ? ["High monotonicity score indicates artificial pixel patterns", "Radius diffusion analysis shows synthetic characteristics", "DALL-E or Flux generation artifacts detected", "Color distribution matches AI generation patterns"] : ["Low monotonicity score indicates natural pixel variation patterns", "Radius diffusion analysis shows organic edge characteristics", "No DALL-E or Flux generation artifacts detected", "Color distribution matches typical camera sensor output"];

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
