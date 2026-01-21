import React, { useState } from 'react';
import { Mic, StopCircle, Send, Brain, Trophy } from 'lucide-react';

const InterviewSimulator = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [interviewId, setInterviewId] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);

  const roles = ['Data Scientist', 'AI Engineer', 'Full Stack Developer', 'Cloud Architect', 'Product Manager'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];

  // Start Interview
  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: targetRole, difficulty })
      });
      
      const data = await response.json();
      setQuestions(data.questions);
      setInterviewId(data.interview_id);
      setInterviewStarted(true);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Is backend running?');
    }
    setLoading(false);
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter an answer!');
      return;
    }
    
    setLoading(true);
    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      const response = await fetch('http://localhost:8000/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: userAnswer,
          expected_keywords: currentQuestion.expected_keywords,
          target_role: targetRole
        })
      });
      
      const result = await response.json();
      setEvaluationResult(result);
      
      // Store answer
      const answerRecord = {
        question: currentQuestion.question,
        answer: userAnswer,
        score: result.total_score,
        category: currentQuestion.category,
        feedback: result.feedback
      };
      
      setAnswers([...answers, answerRecord]);
      
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Check backend!');
    }
    setLoading(false);
  };

  // Next Question
  const handleNextQuestion = () => {
    setUserAnswer('');
    setEvaluationResult(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeInterview();
    }
  };

  // Complete Interview
  const completeInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_id: interviewId,
          answers: answers
        })
      });
      
      const results = await response.json();
      setFinalResults(results);
      setInterviewComplete(true);
    } catch (error) {
      console.error('Error completing interview:', error);
    }
    setLoading(false);
  };

  // Mock voice recording toggle
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    alert('Voice recording not implemented yet. Please type your answer.');
  };

  // Reset interview
  const resetInterview = () => {
    setInterviewStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setAnswers([]);
    setEvaluationResult(null);
    setInterviewComplete(false);
    setFinalResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎤 AI Mock Interview
          </h1>
          <p className="text-gray-600 text-lg">Practice technical interviews with real-time feedback</p>
        </div>

        {/* Setup Screen */}
        {!interviewStarted && !interviewComplete && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Configure Your Interview</h2>
            
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition bg-white text-gray-800"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">Selected: <strong>{targetRole}</strong></p>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-3">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      difficulty === diff
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Selected: <strong>{difficulty}</strong></p>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Preparing Interview...' : '🚀 Start Interview'}
            </button>
          </div>
        )}

        {/* Interview Screen */}
        {interviewStarted && !interviewComplete && questions.length > 0 && (
          <div className="space-y-6">
            
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm text-purple-600 font-semibold">
                  {questions[currentQuestionIndex].difficulty}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Brain className="text-purple-600 mt-1" size={24} />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-purple-600 uppercase">
                    {questions[currentQuestionIndex].category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">
                    {questions[currentQuestionIndex].question}
                  </h3>
                </div>
              </div>

              {/* Answer Input */}
              {!evaluationResult && (
                <>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here... (or use voice recording)"
                    className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none mb-4 bg-white text-gray-900"
                    style={{ color: '#111827' }}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={toggleRecording}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                        isRecording
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                      {isRecording ? 'Stop' : 'Record'}
                    </button>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={loading || !userAnswer.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
                    >
                      <Send size={20} />
                      {loading ? 'Evaluating...' : 'Submit Answer'}
                    </button>
                  </div>
                </>
              )}

              {/* Evaluation Result */}
              {evaluationResult && (
                <div className="space-y-4">
                  {/* Score Display */}
                  <div className="text-center py-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                    <div className="text-6xl mb-2">{evaluationResult.emoji}</div>
                    <div className="text-4xl font-bold text-purple-600 mb-1">
                      {evaluationResult.total_score}/100
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {evaluationResult.performance}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Keyword Coverage</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {evaluationResult.breakdown.keyword_coverage}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Answer Length</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {evaluationResult.breakdown.answer_length}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Confidence</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {evaluationResult.breakdown.confidence}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Clarity</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {evaluationResult.breakdown.clarity}%
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">📋 Feedback</h4>
                    <ul className="space-y-1">
                      {evaluationResult.feedback.map((fb: string, idx: number) => (
                        <li key={idx} className="text-gray-700">{fb}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Interview 🏁'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Results Screen */}
        {interviewComplete && finalResults && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Interview Complete!</h2>
              <p className="text-gray-600">{finalResults.message}</p>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <div className="text-4xl font-bold text-purple-600">
                    {finalResults.average_score}/100
                  </div>
                </div>
                <div className="text-6xl font-bold text-purple-600">
                  {finalResults.grade}
                </div>
              </div>
            </div>

            {/* Performance Areas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">💪 Strong Areas</h4>
                <ul className="space-y-1">
                  {finalResults.strong_areas.length > 0 ? (
                    finalResults.strong_areas.map((area: string, idx: number) => (
                      <li key={idx} className="text-green-700 text-sm">{area}</li>
                    ))
                  ) : (
                    <li className="text-green-700 text-sm">Keep practicing!</li>
                  )}
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">📚 Improve On</h4>
                <ul className="space-y-1">
                  {finalResults.weak_areas.length > 0 ? (
                    finalResults.weak_areas.map((area: string, idx: number) => (
                      <li key={idx} className="text-orange-700 text-sm">{area}</li>
                    ))
                  ) : (
                    <li className="text-orange-700 text-sm">Great job overall!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Try Again Button */}
            <button
              onClick={resetInterview}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition"
            >
              🔄 Try Another Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;
