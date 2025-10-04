import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // For now, just navigate to upload - actual auth will be added later
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        {/* Logo and Tagline */}
        <div className="text-center space-y-3">
          <h1 className="font-orbitron font-black text-5xl md:text-6xl text-primary tracking-wider">
            TRUEVIEW
          </h1>
          <p className="text-foreground/80 text-lg font-medium">
            See the truth behind every media
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border border-border shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg py-6 rounded-lg shadow-[var(--glow-yellow)] hover:shadow-[0_0_30px_hsl(48_100%_50%/0.4)] transition-all"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full border-primary/30 text-foreground hover:bg-primary/10 hover:text-primary font-semibold transition-all"
            >
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
            </Button>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-100"></div>
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
