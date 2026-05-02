import { useState, useEffect } from 'react';
import { dailyAPI } from '../api/api';
import { Skeleton } from '../hooks/useReactQuery';

const DailyChallengePage = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    loadChallenge();
    loadWeeklyProgress();
  }, []);

  const loadChallenge = async () => {
    try {
      const res = await dailyAPI.getToday();
      setChallenge(res.data);
    } catch (err) {
      console.error('Error loading challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyProgress = async () => {
    try {
      const res = await dailyAPI.getWeek();
      setWeeklyProgress(res.data);
    } catch (err) {
      console.error('Error loading weekly progress:', err);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const res = await dailyAPI.complete({
        challengeId: challenge.challengeId,
        score: calculateScore(),
        timeSpentSeconds: 300,
      });
      setScore(res.data);
      loadChallenge();
      loadWeeklyProgress();
    } catch (err) {
      console.error('Error completing challenge:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScore = () => {
    if (!challenge?.content?.questions) return 10;
    const questions = challenge.content.questions;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx]?.toLowerCase() === q.translation?.toLowerCase()) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!challenge || challenge.error) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold mb-2">Không có thử thách hôm nay</h2>
        <p className="text-gray-600">Hãy quay lại vào ngày mai!</p>
      </div>
    );
  }

  const isCompleted = challenge.progress?.completed;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Thử thách hàng ngày</h1>
            <p className="text-gray-600 mt-1">{new Date().toLocaleDateString('vi-VN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</p>
          </div>
          <div className="text-4xl">
            {challenge.type === 'VOCAB_QUIZ' && '📚'}
            {challenge.type === 'LISTENING' && '🎧'}
            {challenge.type === 'GRAMMAR_SPRINT' && '⚡'}
            {challenge.type === 'SPEAKING_SHADOWING' && '🎤'}
            {challenge.type === 'READING_SPEED' && '📖'}
            {challenge.type === 'MIXED' && '🎯'}
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {challenge.type.replace('_', ' ')}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            +{challenge.xpReward} XP
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
        <p className="text-gray-600 mb-4">{challenge.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Tiến độ</span>
            <span>{challenge.progress?.current || 0}/{challenge.targetGoal}</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((challenge.progress?.current || 0) / challenge.targetGoal) * 100}%` }}
            />
          </div>
        </div>

        {/* Challenge Content */}
        {challenge.type === 'VOCAB_QUIZ' && challenge.content?.questions && (
          <div className="space-y-4">
            {challenge.content.questions.map((q, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium mb-2">
                  {idx + 1}. Từ "<span className="text-blue-600">{q.word}</span>" có nghĩa là gì?
                </p>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập nghĩa tiếng Việt..."
                  value={quizAnswers[idx] || ''}
                  onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                  disabled={isCompleted}
                />
              </div>
            ))}
          </div>
        )}

        {/* Complete Button */}
        {!isCompleted ? (
          <button
            onClick={handleComplete}
            disabled={submitting}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Đang xử lý...' : 'Hoàn thành thử thách'}
          </button>
        ) : (
          <div className="mt-6 p-4 bg-green-50 rounded-xl text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-700 font-medium">Bạn đã hoàn thành thử thách hôm nay!</p>
            <p className="text-green-600 text-sm">+{challenge.xpReward} XP đã được thêm vào tài khoản</p>
          </div>
        )}
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Tuần này</h3>
        <div className="grid grid-cols-7 gap-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
            const dayData = weeklyProgress[idx] || {};
            return (
              <div key={idx} className="text-center">
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1 ${
                    dayData.completed
                      ? 'bg-green-500 text-white'
                      : dayData.challengeType !== 'NONE'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {dayData.completed ? '✓' : idx + 1}
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyChallengePage;
