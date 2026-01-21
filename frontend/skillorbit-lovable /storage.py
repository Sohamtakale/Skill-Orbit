import json
import os
from typing import List, Dict, Optional
from datetime import datetime

# File paths
DATA_DIR = "data"
ANALYSES_FILE = os.path.join(DATA_DIR, "analyses.json")
INTERVIEWS_FILE = os.path.join(DATA_DIR, "interviews.json")
COURSES_FILE = os.path.join(DATA_DIR, "courses.json")
ACHIEVEMENTS_FILE = os.path.join(DATA_DIR, "achievements.json")

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize files if they don't exist
for file_path in [ANALYSES_FILE, INTERVIEWS_FILE, COURSES_FILE, ACHIEVEMENTS_FILE]:
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump([], f)


def load_json(file_path: str) -> List[Dict]:
    """Load data from JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return []


def save_json(file_path: str,  List[Dict]):
    """Save data to JSON file"""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving to {file_path}: {e}")
        return False


def save_analysis(user_id: str, analysis_ Dict):
    """Save skill analysis result"""
    analyses = load_json(ANALYSES_FILE)
    
    record = {
        "user_id": user_id,
        "timestamp": datetime.now().isoformat(),
        **analysis_data
    }
    
    analyses.append(record)
    save_json(ANALYSES_FILE, analyses)
    
    # Check for achievements
    check_analysis_achievements(user_id, len([a for a in analyses if a["user_id"] == user_id]))
    
    return record


def save_interview(user_id: str, interview_ Dict):
    """Save mock interview result"""
    interviews = load_json(INTERVIEWS_FILE)
    
    record = {
        "user_id": user_id,
        "timestamp": datetime.now().isoformat(),
        **interview_data
    }
    
    interviews.append(record)
    save_json(INTERVIEWS_FILE, interviews)
    
    # Check for achievements
    check_interview_achievements(user_id, len([i for i in interviews if i["user_id"] == user_id]))
    
    return record


def get_user_analyses(user_id: str) -> List[Dict]:
    """Get all analyses for a user"""
    analyses = load_json(ANALYSES_FILE)
    return [a for a in analyses if a["user_id"] == user_id]


def get_user_interviews(user_id: str) -> List[Dict]:
    """Get all interviews for a user"""
    interviews = load_json(INTERVIEWS_FILE)
    return [i for i in interviews if i["user_id"] == user_id]


def get_user_courses(user_id: str) -> List[Dict]:
    """Get enrolled courses for a user"""
    courses = load_json(COURSES_FILE)
    return [c for c in courses if c["user_id"] == user_id]


def enroll_course(user_id: str, course_ Dict):
    """Enroll user in a course"""
    courses = load_json(COURSES_FILE)
    
    record = {
        "user_id": user_id,
        "enrolled_at": datetime.now().isoformat(),
        "completed": False,
        "progress": 0,
        **course_data
    }
    
    courses.append(record)
    save_json(COURSES_FILE, courses)
    return record


def update_course_progress(user_id: str, course_id: str, progress: int, completed: bool = False):
    """Update course progress"""
    courses = load_json(COURSES_FILE)
    
    for course in courses:
        if course["user_id"] == user_id and course.get("course_id") == course_id:
            course["progress"] = progress
            course["completed"] = completed
            if completed:
                course["completed_at"] = datetime.now().isoformat()
            break
    
    save_json(COURSES_FILE, courses)
    
    # Check for achievements
    if completed:
        user_courses = get_user_courses(user_id)
        completed_count = len([c for c in user_courses if c.get("completed")])
        check_course_achievements(user_id, completed_count)


def get_user_achievements(user_id: str) -> List[Dict]:
    """Get all achievements for a user"""
    achievements = load_json(ACHIEVEMENTS_FILE)
    return [a for a in achievements if a["user_id"] == user_id]


def award_achievement(user_id: str, achievement_type: str, title: str, description: str, icon: str):
    """Award an achievement to a user"""
    achievements = load_json(ACHIEVEMENTS_FILE)
    
    # Check if already awarded
    existing = [a for a in achievements if a["user_id"] == user_id and a["achievement_type"] == achievement_type]
    if existing:
        return None
    
    record = {
        "user_id": user_id,
        "achievement_type": achievement_type,
        "title": title,
        "description": description,
        "icon": icon,
        "earned_at": datetime.now().isoformat()
    }
    
    achievements.append(record)
    save_json(ACHIEVEMENTS_FILE, achievements)
    return record


def check_analysis_achievements(user_id: str, count: int):
    """Check and award analysis-related achievements"""
    if count == 1:
        award_achievement(user_id, "first_analysis", "First Step", "Completed your first skill analysis", "🎯")
    elif count == 5:
        award_achievement(user_id, "analysis_5", "Analyzer", "Completed 5 skill analyses", "📊")
    elif count == 10:
        award_achievement(user_id, "analysis_10", "Expert Analyzer", "Completed 10 skill analyses", "🔥")


def check_interview_achievements(user_id: str, count: int):
    """Check and award interview-related achievements"""
    if count == 1:
        award_achievement(user_id, "first_interview", "Interview Rookie", "Completed your first mock interview", "🎤")
    elif count == 3:
        award_achievement(user_id, "interview_3", "Interview Pro", "Completed 3 mock interviews", "💼")
    elif count == 10:
        award_achievement(user_id, "interview_10", "Interview Master", "Completed 10 mock interviews", "👑")


def check_course_achievements(user_id: str, count: int):
    """Check and award course-related achievements"""
    if count == 1:
        award_achievement(user_id, "first_course", "Lifelong Learner", "Completed your first course", "📚")
    elif count == 5:
        award_achievement(user_id, "course_5", "Knowledge Seeker", "Completed 5 courses", "🎓")
    elif count == 10:
        award_achievement(user_id, "course_10", "Scholar", "Completed 10 courses", "🏆")
