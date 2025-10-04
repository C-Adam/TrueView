import { ImageViewer } from "@/components/ImageViewer";
import { AnalysisReasoning } from "@/components/AnalysisReasoning";

const AnalysisVerdict = ({ isAIGenerated }: { isAIGenerated: boolean }) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90 w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={0}
              className={isAIGenerated ? "text-red-500" : "text-green-500"}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${isAIGenerated ? "text-red-500" : "text-green-500"}`}>
              {isAIGenerated ? "AI" : "✓"}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Analysis</p>
          <p className="text-2xl font-bold text-foreground">
            {isAIGenerated ? "AI Generated" : "Not AI Generated"}
          </p>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, description }: { label: string; value: number; description: string }) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-green-500">
            {value}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{label}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
};

const Index = () => {
  // CHANGE THIS VALUE: Set to true for "AI Generated", false for "Not AI Generated"
  const isAIGenerated = false;
  
  const reasoningPoints = isAIGenerated 
    ? [
        "High monotonicity score indicates artificial pixel patterns",
        "Radius diffusion analysis shows synthetic characteristics",
        "DALL-E or Flux generation artifacts detected",
        "Color distribution matches AI generation patterns"
      ]
    : [
        "Low monotonicity score indicates natural pixel variation patterns",
        "Radius diffusion analysis shows organic edge characteristics",
        "No DALL-E or Flux generation artifacts detected",
        "Color distribution matches typical camera sensor output"
      ];

  const metricsData = [
    { 
      label: "Monotonicity", 
      value: 9, 
      description: "Measures pixel uniformity and smoothness. Lower values suggest more natural variation typical of real images, while higher values may indicate artificial generation patterns."
    },
    { 
      label: "Radius Diffusion", 
      value: 4, 
      description: "Analyzes how light and colors spread from central points. Natural images show irregular diffusion patterns, while AI-generated images often display more uniform spreading."
    },
    { 
      label: "DALL-E Detection", 
      value: 3, 
      description: "Checks for specific artifacts and patterns characteristic of DALL-E generated images, including texture consistency and composition markers."
    },
    { 
      label: "Flux Detection", 
      value: 2, 
      description: "Identifies generation signatures specific to Flux models, analyzing layer blending and detail rendering patterns unique to this AI system."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI or Not Report</h1>
        </div>

        {/* Main Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Image + Analysis */}
          <div className="space-y-4">
            <ImageViewer 
              imageUrl="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
            />
            <AnalysisVerdict isAIGenerated={isAIGenerated} />
            <AnalysisReasoning reasons={reasoningPoints} />
          </div>

          {/* Right Column: Metrics */}
          <div className="space-y-4">
            {metricsData.map((metric, index) => (
              <MetricBox 
                key={index}
                label={metric.label}
                value={metric.value}
                description={metric.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;