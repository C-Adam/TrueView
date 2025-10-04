import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-orbitron font-black text-2xl md:text-3xl text-primary">
            TRUEVIEW
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-primary/30 text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground">
              Welcome to TrueView
            </h2>
            <p className="text-xl text-foreground/70">
              Your journey to media truth begins here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-orbitron font-bold text-xl text-foreground mb-2">
                Verify
              </h3>
              <p className="text-foreground/60">
                Authenticate media sources with advanced AI
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-orbitron font-bold text-xl text-foreground mb-2">
                Analyze
              </h3>
              <p className="text-foreground/60">
                Deep dive into content authenticity
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-orbitron font-bold text-xl text-foreground mb-2">
                Trust
              </h3>
              <p className="text-foreground/60">
                Build confidence in your media consumption
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
