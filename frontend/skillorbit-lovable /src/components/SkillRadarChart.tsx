import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface SkillRadarChartProps {
  radarData: {
    labels: string[];
    scores: number[];
  };
}

const SkillRadarChart = ({ radarData }: SkillRadarChartProps) => {
  // Safety check
  if (!radarData || !radarData.labels || !radarData.scores) {
    return null;
  }

  // Transform data for recharts format
  const chartData = radarData.labels.map((label, index) => ({
    skill: label,
    score: radarData.scores[index] || 0,
    fullScore: 100
  }));

  return (
    <div className="w-full h-96 glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Skill Assessment Radar
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
          />
          <Radar
            name="Target (100%)"
            dataKey="fullScore"
            stroke="hsl(var(--accent))"
            fill="hsl(var(--accent))"
            fillOpacity={0.1}
            strokeDasharray="3 3"
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: 'hsl(var(--foreground))'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
