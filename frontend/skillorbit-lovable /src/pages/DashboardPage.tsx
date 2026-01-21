import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  Target,
  Calendar,
  ArrowLeft,
  Trophy,
  Zap
} from 'lucide-react';

interface DashboardData {
  stats: {
    total_analyses: number;
    total_interviews: number;
    total_courses: number;
    completed_courses: number;
    completion_rate: number;
    total_achievements: number;
  };
  progress: {
    analysis_scores: number[];
    interview_scores: number[];
    latest_score: number;
  };
  recent_analyses: any[];
  recent_interviews: any[];
  courses: any[];
  achievements: any[];
}

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = "demo_user";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/dashboard/${userId}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No data yet. Start your journey!</p>
          <Link to="/analyze" className="btn-gradient">
            Analyze Your Skills
          </Link>
        </div>
      </div>
    );
  }

  const { stats, progress, recent_analyses, recent_interviews, achievements } = dashboardData;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
        <div className="flex gap-4">
          <Link to="/learning-path" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Learning Path
          </Link>
          <Link to="/analyze" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            New Analysis
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Progress Dashboard</h1>
          <p className="text-muted-foreground text-lg">Track your learning journey and growth</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Skill Analyses"
            value={stats.total_analyses}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Zap className="w-6 h-6" />}
            label="Mock Interviews"
            value={stats.total_interviews}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Courses Completed"
            value={`${stats.completed_courses}/${stats.total_courses}`}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6" />}
            label="Achievements"
            value={stats.total_achievements}
            color="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Skill Analysis Trend */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Future-Proofing Score Trend
            </h3>
            {progress.analysis_scores.length > 0 ? (
              <div className="space-y-3">
                {progress.analysis_scores.map((score, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">
                      Analysis {idx + 1}
                    </span>
                    <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-primary w-12">
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Complete your first analysis to see progress
              </p>
            )}
          </div>

          {/* Interview Scores Trend */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Interview Performance
            </h3>
            {progress.interview_scores.length > 0 ? (
              <div className="space-y-3">
                {progress.interview_scores.map((score, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">
                      Interview {idx + 1}
                    </span>
                    <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-purple-500 w-12">
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Take your first mock interview to see progress
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Recent Analyses */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Analyses
            </h3>
            {recent_analyses.length > 0 ? (
              <div className="space-y-3">
                {recent_analyses.map((analysis, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{analysis.target_role}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {analysis.future_proofing_score}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No analyses yet</p>
            )}
          </div>

          {/* Recent Interviews */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Recent Interviews
            </h3>
            {recent_interviews.length > 0 ? (
              <div className="space-y-3">
                {recent_interviews.map((interview, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{interview.target_role}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(interview.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-500">
                        {interview.grade}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {interview.total_score}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No interviews yet</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Achievements
          </h3>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <p className="font-semibold text-foreground">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Complete activities to earn achievements!
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default DashboardPage;
