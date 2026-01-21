from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import PyPDF2
import io
import re
import os
from textblob import TextBlob
import random
from datetime import datetime
import uuid

try:
    from groq import Groq
    from dotenv import load_dotenv
    load_dotenv()
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
    print(f"✅ Groq initialized: {groq_client is not None}")
except Exception as e:
    print(f"⚠️  Groq not configured - {e}")
    groq_client = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skill requirements database
ROLE_SKILLS = {
    "Data Scientist": {
        "core": ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
        "advanced": ["Deep Learning", "NLP", "Computer Vision", "Big Data", "MLOps"],
        "emerging": ["LLMs", "Transformers", "AutoML", "Edge AI"]
    },
    "Full Stack Developer": {
        "core": ["JavaScript", "HTML/CSS", "React", "Node.js", "Git"],
        "advanced": ["TypeScript", "Docker", "CI/CD", "MongoDB", "PostgreSQL"],
        "emerging": ["Next.js", "GraphQL", "Kubernetes", "Serverless"]
    },
    "AI Engineer": {
        "core": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"],
        "advanced": ["Neural Networks", "Computer Vision", "NLP", "Model Optimization"],
        "emerging": ["LLMs", "Transformers", "Reinforcement Learning", "Edge AI"]
    },
    "Cloud Architect": {
        "core": ["AWS", "Azure", "Cloud Infrastructure", "Networking", "Security"],
        "advanced": ["Kubernetes", "Docker", "Terraform", "CI/CD", "Microservices"],
        "emerging": ["Serverless", "Multi-Cloud", "Cloud Native", "Service Mesh"]
    },
    "Product Manager": {
        "core": ["Product Strategy", "Roadmapping", "Stakeholder Management", "Agile", "Data Analysis"],
        "advanced": ["User Research", "A/B Testing", "Product Analytics", "Go-to-Market"],
        "emerging": ["AI Product Management", "Growth Hacking", "Product-Led Growth"]
    }
}

PROJECTS_DATABASE = {
    "Machine Learning": [
        {"title": "Customer Churn Prediction", "difficulty": "Intermediate", "url": "https://www.kaggle.com/competitions/customer-churn-prediction"}
    ],
    "Python": [
        {"title": "Build a REST API", "difficulty": "Beginner", "url": "https://realpython.com/api-integration-in-python/"}
    ]
}

INTERVIEW_QUESTIONS = {
    "Data Scientist": [
        {
            "question": "What is the difference between supervised and unsupervised learning?",
            "difficulty": "Easy",
            "category": "Machine Learning Basics",
            "expected_keywords": ["labeled data", "classification", "regression", "clustering", "training"]
        },
        {
            "question": "Explain overfitting and how to prevent it.",
            "difficulty": "Medium",
            "category": "Machine Learning",
            "expected_keywords": ["generalization", "regularization", "validation", "cross-validation", "complexity"]
        },
        {
            "question": "What is gradient descent and how does it work?",
            "difficulty": "Medium",
            "category": "Optimization",
            "expected_keywords": ["optimization", "loss function", "learning rate", "convergence", "backpropagation"]
        },
        {
            "question": "Explain the bias-variance tradeoff.",
            "difficulty": "Hard",
            "category": "Machine Learning Theory",
            "expected_keywords": ["bias", "variance", "underfitting", "overfitting", "model complexity"]
        },
        {
            "question": "How would you handle missing data in a dataset?",
            "difficulty": "Easy",
            "category": "Data Preprocessing",
            "expected_keywords": ["imputation", "deletion", "mean", "median", "predictive modeling"]
        }
    ],
    "Full Stack Developer": [
        {
            "question": "What is the difference between REST and GraphQL?",
            "difficulty": "Medium",
            "category": "API Design",
            "expected_keywords": ["endpoints", "query", "flexibility", "over-fetching", "schema"]
        },
        {
            "question": "Explain closures in JavaScript.",
            "difficulty": "Medium",
            "category": "JavaScript",
            "expected_keywords": ["scope", "function", "lexical", "encapsulation", "private"]
        },
        {
            "question": "What are React hooks and why are they useful?",
            "difficulty": "Easy",
            "category": "React",
            "expected_keywords": ["useState", "useEffect", "functional components", "lifecycle", "state management"]
        },
        {
            "question": "How do you optimize database queries?",
            "difficulty": "Hard",
            "category": "Database",
            "expected_keywords": ["indexing", "query planning", "normalization", "caching", "joins"]
        },
        {
            "question": "Explain the concept of middleware in Express.js.",
            "difficulty": "Easy",
            "category": "Node.js",
            "expected_keywords": ["request", "response", "next", "pipeline", "processing"]
        }
    ],
    "AI Engineer": [
        {
            "question": "What is backpropagation in neural networks?",
            "difficulty": "Medium",
            "category": "Deep Learning",
            "expected_keywords": ["gradient", "chain rule", "weights", "optimization", "error propagation"]
        },
        {
            "question": "Explain the transformer architecture.",
            "difficulty": "Hard",
            "category": "NLP",
            "expected_keywords": ["attention", "self-attention", "encoder", "decoder", "positional encoding"]
        },
        {
            "question": "What is transfer learning and when would you use it?",
            "difficulty": "Medium",
            "category": "Deep Learning",
            "expected_keywords": ["pre-trained", "fine-tuning", "feature extraction", "limited data", "domain adaptation"]
        },
        {
            "question": "How do you prevent overfitting in deep learning models?",
            "difficulty": "Easy",
            "category": "Model Optimization",
            "expected_keywords": ["dropout", "regularization", "early stopping", "data augmentation", "batch normalization"]
        },
        {
            "question": "Explain the difference between CNN and RNN.",
            "difficulty": "Medium",
            "category": "Neural Networks",
            "expected_keywords": ["convolutional", "recurrent", "spatial", "sequential", "temporal"]
        }
    ]
}

def extract_text_from_pdf(file_bytes):
    """Extract text from PDF"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

def extract_skills(text):
    """Extract skills from resume text"""
    common_skills = [
        "Python", "JavaScript", "Java", "C++", "React", "Node.js", "SQL", "MongoDB",
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Docker", 
        "Kubernetes", "AWS", "Azure", "Git", "TensorFlow", "PyTorch", "Pandas", "NumPy",
        "TypeScript", "HTML/CSS", "PostgreSQL", "Redis", "GraphQL", "CI/CD", "DevOps",
        "Microservices", "REST API", "Agile", "Scrum", "Data Visualization", "Statistics",
        "Big Data", "Spark", "Hadoop", "ETL", "Data Analysis", "Excel", "Tableau", "Power BI"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills

def recommend_projects(missing_skills):
    """Recommend projects"""
    recommendations = []
    for skill in missing_skills[:3]:
        if skill in PROJECTS_DATABASE:
            recommendations.extend(PROJECTS_DATABASE[skill][:2])
    return recommendations

@app.get("/")
def home():
    return {"message": "SkillOrbit Backend is Running!"}

@app.get("/api/test")
def test():
    return {
        "status": "success",
        "future_proofing_score": 72,
        "top_skills": ["Python", "Machine Learning", "Docker"]
    }

@app.post("/api/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form(...),
    target_year: int = Form(2028)
):
    # 1. Read PDF
    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)
    
    if not resume_text:
        return {"error": "Could not extract text from PDF"}
    
    # 2. Extract skills
    extracted_skills = extract_skills(resume_text)
    
    # 3. Get required skills for role
    required_skills = ROLE_SKILLS.get(target_role, ROLE_SKILLS["Data Scientist"])
    all_required = required_skills["core"] + required_skills["advanced"] + required_skills["emerging"]
    
    # 4. Find skill gaps
    missing_skills = [skill for skill in all_required if skill not in extracted_skills]
    
    # 5. Calculate future-proofing score - FIXED
    total_required = len(all_required)
    matched_count = len([skill for skill in all_required if skill in extracted_skills])
    score = min(int((matched_count / total_required) * 100), 100) if total_required > 0 else 0
    
    # 6. Create skill gaps list
    skill_gaps = []
    for skill in all_required:
        status = "matched" if skill in extracted_skills else "missing"
        skill_gaps.append({
            "skill": skill,
            "status": status,
            "importance": "high" if skill in required_skills["core"] else "medium",
            "current": 100 if skill in extracted_skills else 0,
            "required_level": 4
        })
    
    # 7. Radar chart data
    core_matched = len([s for s in extracted_skills if s in required_skills["core"]])
    core_total = len(required_skills["core"])
    advanced_matched = len([s for s in extracted_skills if s in required_skills["advanced"]])
    advanced_total = len(required_skills["advanced"])
    emerging_matched = len([s for s in extracted_skills if s in required_skills["emerging"]])
    emerging_total = len(required_skills["emerging"])
    
    radar_data = {
        "labels": ["Core Skills", "Advanced Skills", "Emerging Tech", "Projects", "Communication"],
        "scores": [
            int((core_matched / core_total) * 100) if core_total > 0 else 0,
            int((advanced_matched / advanced_total) * 100) if advanced_total > 0 else 0,
            int((emerging_matched / emerging_total) * 100) if emerging_total > 0 else 0,
            random.randint(60, 90),
            random.randint(70, 95)
        ]
    }
    
    # 8. Generate insights
    insights = [
        f"You have {matched_count} out of {total_required} required skills for {target_role}",
        f"Focus on learning: {', '.join(missing_skills[:3])}" if missing_skills else "Great! You have all core skills",
        f"Your future-proofing score is {score}/100"
    ]
    
    # 9. Recommend courses - Multiple platforms (2 per skill = 6 total)
    recommended_courses = []
    platforms = [
        {"name": "Coursera", "duration": "4-6 weeks", "rating": "4.7", "url": "coursera.org"},
        {"name": "Udemy", "duration": "8-12 hours", "rating": "4.6", "url": "udemy.com"},
    ]
    
    for skill in missing_skills[:3]:  # Top 3 missing skills
        for platform in platforms:  # 2 courses per skill
            recommended_courses.append({
                "title": f"{'Complete' if platform['name'] == 'Udemy' else 'Master'} {skill}",
                "provider": platform["name"],
                "duration": platform["duration"],
                "rating": platform["rating"],
                "matching_skills": [skill],
                "url": f"https://www.{platform['url']}/search?query={skill.replace(' ', '%20')}"
            })
    
    # 10. Recommend projects - FIXED STRUCTURE
    recommended_projects = [{
        "title": f"Build a {skill} Project",
        "difficulty": "Intermediate",
        "duration": "2-3 weeks",
        "description": f"A hands-on project to master {skill} through practical implementation",
        "skills_learned": [skill],
        "target_skill": skill,
        "github_example": f"https://github.com/topics/{skill.lower().replace(' ', '-')}"
    } for skill in missing_skills[:6]]
    
    return {
        "extracted_skills": extracted_skills,
        "future_proofing_score": score,
        "skill_gaps": skill_gaps,
        "radar_data": radar_data,
        "insights": insights,
        "target_role": target_role,
        "target_year": target_year,
        "recommended_courses": recommended_courses,
        "recommended_projects": recommended_projects
    }


# INTERVIEW ENDPOINTS
class InterviewStartRequest(BaseModel):
    target_role: str
    difficulty: str = "Mixed"

class AnswerEvaluationRequest(BaseModel):
    question: str
    answer: str
    expected_keywords: list
    target_role: str

@app.post("/api/interview/start")
async def start_interview(request: InterviewStartRequest):
    role = request.target_role
    difficulty = request.difficulty
    
    questions = INTERVIEW_QUESTIONS.get(role, INTERVIEW_QUESTIONS["Data Scientist"])
    
    if difficulty != "Mixed":
        questions = [q for q in questions if q["difficulty"] == difficulty]
    
    selected_questions = random.sample(questions, min(5, len(questions)))
    interview_id = f"INT_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    return {
        "interview_id": interview_id,
        "target_role": role,
        "questions": selected_questions,
        "total_questions": len(selected_questions),
        "estimated_duration": f"{len(selected_questions) * 3}-{len(selected_questions) * 5} minutes"
    }

@app.post("/api/interview/evaluate")
async def evaluate_answer(request: AnswerEvaluationRequest):
    answer = request.answer.lower()
    expected_keywords = [kw.lower() for kw in request.expected_keywords]
    
    # Keyword matching
    keywords_found = [kw for kw in expected_keywords if kw in answer]
    keyword_score = (len(keywords_found) / len(expected_keywords)) * 40 if expected_keywords else 0
    
    # Answer length
    word_count = len(answer.split())
    length_score = min((word_count / 50) * 25, 25)
    
    # Sentiment analysis
    blob = TextBlob(answer)
    confidence_score = min(abs(blob.sentiment.polarity) * 20, 20)
    
    # Clarity (subjectivity)
    clarity_score = (1 - blob.sentiment.subjectivity) * 15
    
    total_score = round(keyword_score + length_score + confidence_score + clarity_score, 1)
    
    if total_score >= 80:
        performance, emoji, feedback = "Excellent", "🌟", "Outstanding answer!"
    elif total_score >= 60:
        performance, emoji, feedback = "Good", "👍", "Good job!"
    elif total_score >= 40:
        performance, emoji, feedback = "Fair", "😐", "Needs improvement"
    else:
        performance, emoji, feedback = "Poor", "❌", "Keep practicing"
    
    return {
        "total_score": total_score,
        "breakdown": {
            "keyword_coverage": round(keyword_score, 1),
            "answer_length": round(length_score, 1),
            "confidence": round(confidence_score, 1),
            "clarity": round(clarity_score, 1)
        },
        "keywords_found": keywords_found,
        "word_count": word_count,
        "performance": performance,
        "emoji": emoji,
        "feedback": feedback
    }

class InterviewCompleteRequest(BaseModel):
    interview_id: str
    answers: list

@app.post("/api/interview/complete")
async def complete_interview(request: InterviewCompleteRequest):
    answers = request.answers
    
    if not answers:
        return {"error": "No answers provided"}
    
    total_score = sum(a["score"] for a in answers)
    average_score = total_score / len(answers)
    
    strong_areas = []
    weak_areas = []
    
    for answer in answers:
        if answer["score"] >= 70:
            strong_areas.append(answer.get("category", "General"))
        elif answer["score"] < 50:
            weak_areas.append(answer.get("category", "General"))
    
    if average_score >= 80:
        grade, message = "A", "Outstanding performance! You're interview-ready!"
    elif average_score >= 70:
        grade, message = "B", "Good job! A bit more practice and you'll ace it!"
    elif average_score >= 60:
        grade, message = "C", "Decent effort. Focus on key concepts and practice more."
    else:
        grade, message = "D", "Keep practicing! Review fundamentals and try again."
    
    return {
        "interview_id": request.interview_id,
        "total_questions": len(answers),
        "average_score": round(average_score, 1),
        "grade": grade,
        "message": message,
        "strong_areas": list(set(strong_areas)),
        "weak_areas": list(set(weak_areas)),
        "detailed_scores": answers
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
