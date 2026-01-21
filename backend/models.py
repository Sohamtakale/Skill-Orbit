from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

# User Profile
class UserProfile(BaseModel):
    user_id: str
    name: str
    email: str
    created_at: datetime = datetime.now()
    target_role: str
    current_skills: List[str] = []

# Analysis History
class AnalysisRecord(BaseModel):
    analysis_id: str
    user_id: str
    timestamp: datetime = datetime.now()
    target_role: str
    target_year: int
    future_proofing_score: int
    skill_gaps: List[str]
    recommended_skills: List[str]
    file_name: str

# Interview History
class InterviewRecord(BaseModel):
    interview_id: str
    user_id: str
    timestamp: datetime = datetime.now()
    target_role: str
    total_score: float
    grade: str
    questions_answered: int
    strong_areas: List[str]
    weak_areas: List[str]

# Course Progress
class CourseProgress(BaseModel):
    user_id: str
    course_name: str
    course_url: str
    skill_addressed: str
    status: str  # "Recommended", "Started", "In Progress", "Completed"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

# Achievement/Milestone
class Achievement(BaseModel):
    user_id: str
    achievement_type: str  # "first_interview", "skill_gap_closed", "high_score"
    title: str
    description: str
    earned_at: datetime = datetime.now()
    icon: str  # emoji or icon name
