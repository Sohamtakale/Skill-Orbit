import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, BookOpen, Clock, Star, Target, AlertCircle } from "lucide-react";
import SkillRadarChart from "../components/SkillRadarChart";
import { SifuChatbot } from "../components/SifuChatbot";

const ResultsPage = () => {
  const location = useLocation();
  const { analysisData, fileName } = location.state || {};
  
  // If no data, show error
  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Analysis Data</h2>
          <p className="text-muted-foreground mb-6">Please upload a resume to analyze</p>
          <Link to="/analyze" className="btn-gradient inline-flex items-center gap-2">
            Go to Analyze Page
          </Link>
        </div>
      </div>
    );
  }

  const {
    extracted_skills,
    future_proofing_score,
    skill_gaps,
    insights,
    target_role,
    target_year,
    recommended_courses,
    recommended_projects
  } = analysisData;

  // Separate matched and missing skills
  const matchedSkills = skill_gaps.filter((gap: any) => gap.status === "matched");
  const missingSkills = skill_gaps.filter((gap: any) => gap.status === "missing");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link to="/analyze" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
        <div className="text-sm text-muted-foreground">
          Target: <span className="text-foreground font-medium">{target_role}</span> · {target_year}
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 py-8">
        {/* Score Section */}
        <div className="text-center mb-16 opacity-0 animate-fade-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Future-Proofing Score</h1>
          <p className="text-sm text-muted-foreground mb-8">Analyzed: {fileName}</p>
          
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="12"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${future_proofing_score * 6.28} 628`}
                className="transition-all duration-1000 ease-out"
                style={{ animationDelay: "0.5s" }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold gradient-text">{future_proofing_score}</span>
              <span className="text-muted-foreground text-sm mt-1">out of 100</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights && insights.length > 0 && (
          <section className="mb-12 opacity-0 animate-fade-up animation-delay-200">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Key Insights
            </h2>
            <div className="space-y-3">
              {insights.map((insight: string, index: number) => (
                <div key={index} className="glass-card rounded-xl p-4">
                  <p className="text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Radar Chart Visualization */}
        {analysisData.radar_data && (
          <section className="mb-12 opacity-0 animate-fade-up animation-delay-250">
            <SkillRadarChart radarData={analysisData.radar_data} />
          </section>
        )}

        {/* Extracted Skills */}
        <section className="mb-12 opacity-0 animate-fade-up animation-delay-300">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Your Extracted Skills ({extracted_skills.length} found)
          </h2>
          <div className="flex flex-wrap gap-3">
            {extracted_skills.length > 0 ? (
              extracted_skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground hover:border-primary/50 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-muted-foreground">No skills detected. Try uploading a more detailed resume.</p>
            )}
          </div>
        </section>

        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <section className="mb-12 opacity-0 animate-fade-up animation-delay-400">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              ✅ Matched Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {matchedSkills.map((gap: any) => (
                <span
                  key={gap.skill}
                  className="px-4 py-2 rounded-full glass-card text-sm font-medium text-green-400 border-green-500/30 cursor-default"
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Skill Gaps */}
        {missingSkills.length > 0 && (
          <section className="mb-12 opacity-0 animate-fade-up animation-delay-500">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              ⚠️ Skills to Learn
            </h2>
            <div className="space-y-5">
              {missingSkills.map((gap: any) => (
                <div key={gap.skill} className="glass-card rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-foreground">{gap.skill}</span>
                    <span className="text-sm text-red-400">
                      Missing - Priority: High
                    </span>
                  </div>
                  <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 rounded-full bg-red-500/30"
                      style={{ width: `${gap.current}%` }}
                    />
                    <div 
                      className="absolute inset-y-0 h-full w-1 bg-foreground/50"
                      style={{ left: `${gap.required_level * 20}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Required for <span className="text-primary font-medium">{target_role}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Courses */}
        {recommended_courses && recommended_courses.length > 0 && (
          <section className="mb-12 opacity-0 animate-fade-up animation-delay-600">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recommended Courses</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommended_courses.map((course: any, index: number) => (
                <a
                  key={index}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.provider}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {course.matching_skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Project-Based Suggestions - NEW! */}
        {recommended_projects && recommended_projects.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-650 mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">🚀 Hands-On Projects to Build</h2>
            <p className="text-muted-foreground mb-6">
              Build these projects to validate your skills and create a strong portfolio
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {recommended_projects.map((project: any, index: number) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{project.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {project.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {project.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Skills you'll learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills_learned?.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-primary font-medium">
                      🎯 Builds: {project.target_skill}
                    </span>
                    <a
                      href={project.github_example}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Examples
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No courses fallback */}
        {(!recommended_courses || recommended_courses.length === 0) && missingSkills.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-600 mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recommended Learning Path</h2>
            <div className="glass-card rounded-xl p-6 text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Focus on these skills</h3>
              <p className="text-muted-foreground mb-4">
                Priority skills to learn: {missingSkills.slice(0, 3).map((g: any) => g.skill).join(", ")}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {missingSkills.slice(0, 3).map((gap: any) => (
                  <span
                    key={gap.skill}
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                  >
                    {gap.skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center mt-16 opacity-0 animate-fade-up animation-delay-700">
          <Link to="/analyze" className="btn-gradient inline-flex items-center gap-2">
            Analyze Another Resume
          </Link>
        </div>

        {/* Sifu AI Chatbot */}
        <SifuChatbot analysisData={analysisData} />
      </main>
    </div>
  );
};

export default ResultsPage;
