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
    extracted_skills = [],
    future_proofing_score = 0,
    skill_gaps = [],
    radar_data,
    insights = [],
    target_role = "Unknown",
    target_year = new Date().getFullYear() + 3,
    recommended_courses = [],
    recommended_projects = []
  } = analysisData;

  const missingSkills = skill_gaps.filter((gap: any) => gap.status === "missing");
  const matchedSkills = skill_gaps.filter((gap: any) => gap.status === "matched");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/analyze" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Analysis
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 opacity-0 animate-fade-up">
              Your Future-Proofing Report
            </h1>
            <p className="text-muted-foreground text-lg opacity-0 animate-fade-up animation-delay-100">
              Analysis for <span className="text-primary font-semibold">{fileName}</span>
            </p>

            {/* Score Card */}
            <div className="glass-card rounded-2xl p-8 mt-8 opacity-0 animate-fade-up animation-delay-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-muted-foreground mb-2">Future-Proofing Score</p>
                  <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-6xl font-bold text-primary">{future_proofing_score}</span>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Target: <span className="text-foreground font-semibold">{target_role}</span> by {target_year}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skills Matched</span>
                      <span className="text-foreground font-semibold">{matchedSkills.length}/{skill_gaps.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skills to Learn</span>
                      <span className="text-foreground font-semibold">{missingSkills.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12 max-w-6xl">
        {/* Insights */}
        {insights.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-300">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Key Insights</h2>
            <div className="grid gap-4">
              {insights.map((insight: string, idx: number) => (
                <div key={idx} className="glass-card rounded-xl p-4 flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Radar Chart */}
        {radar_data && radar_data.labels && radar_data.labels.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-400">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Skills Assessment</h2>
            <SkillRadarChart radarData={radar_data} />
          </section>
        )}

        {/* Extracted Skills */}
        {extracted_skills.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-450">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Your Skills ({extracted_skills.length} found)
            </h2>
            <div className="flex flex-wrap gap-3">
              {extracted_skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-475">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              ✅ Matched Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {matchedSkills.map((gap: any) => (
                <span
                  key={gap.skill}
                  className="px-4 py-2 rounded-full glass-card text-sm font-medium text-green-400 border-green-500/30"
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Skill Gaps */}
        {missingSkills.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-500">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              ⚠️ Skills to Learn
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {missingSkills.map((gap: any, idx: number) => (
                <div key={idx} className="glass-card rounded-xl p-5 border-l-4 border-red-500/50">
                  <h3 className="font-semibold text-foreground mb-2">{gap.skill}</h3>
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <span>Missing - Priority: {gap.importance}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Courses */}
        {recommended_courses && recommended_courses.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-600">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Recommended Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recommended_courses.map((course: any, idx: number) => (
                <a
                  key={idx}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.provider}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {course.matching_skills && course.matching_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.matching_skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Projects */}
        {recommended_projects && recommended_projects.length > 0 && (
          <section className="opacity-0 animate-fade-up animation-delay-650">
            <h2 className="text-2xl font-semibold text-foreground mb-6">🚀 Hands-On Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recommended_projects.map((project: any, idx: number) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-semibold text-foreground mb-2">{project.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
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
                  
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  
                  {project.skills_learned && project.skills_learned.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Skills you'll learn:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skills_learned.map((skill: string, skillIdx: number) => (
                          <span
                            key={skillIdx}
                            className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-primary font-medium">
                      🎯 {project.target_skill}
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
