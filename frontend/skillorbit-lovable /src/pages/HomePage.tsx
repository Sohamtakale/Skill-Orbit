import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, TrendingUp, Mic } from "lucide-react";
import { useState } from "react";
import { testBackend } from "../api";

const HomePage = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    const result = await testBackend();
    setTestResult(result);
    setIsLoading(false);
    console.log("Backend result:", result);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">SkillOrbit</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            to="/interview"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Mock Interview
          </Link>
          <Link 
            to="/analyze"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Start Analysis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-8 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 opacity-0 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Career Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-up animation-delay-200">
            <span className="text-foreground">Future-Proof</span>
            <br />
            <span className="gradient-text">Your Career</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-up animation-delay-400">
            AI-powered skill gap analysis that maps your expertise to tomorrow's job market demands
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center opacity-0 animate-fade-up animation-delay-600">
            <Link to="/analyze" className="btn-gradient inline-flex items-center gap-3 text-lg">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            {/* MOCK INTERVIEW BUTTON */}
            <Link 
              to="/interview"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold inline-flex items-center gap-3 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              <Mic className="w-5 h-5" />
              Mock Interview
            </Link>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="mt-8 p-6 rounded-2xl glass-card border border-green-500/30 text-left max-w-2xl mx-auto animate-fade-up">
              <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Backend Connected!</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Status: <span className="text-foreground font-medium">{testResult.status}</span></p>
                <p className="text-muted-foreground">Future-Proofing Score: <span className="text-primary font-bold text-xl">{testResult.future_proofing_score}/100</span></p>
                <p className="text-muted-foreground">Top Skills: <span className="text-foreground font-medium">{testResult.top_skills?.join(", ")}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="Skill Mapping"
            description="Extract and analyze skills from your resume using advanced AI"
            delay="animation-delay-200"
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Gap Analysis"
            description="Identify skill gaps between your profile and target roles"
            delay="animation-delay-400"
          />
          <FeatureCard
            icon={<Mic className="w-6 h-6" />}
            title="Mock Interviews"
            description="Practice technical interviews with AI-powered feedback"
            delay="animation-delay-600"
          />
        </div>
      </main>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div className={`glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 opacity-0 animate-fade-up ${delay}`}>
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
