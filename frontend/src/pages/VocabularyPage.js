import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BookOpen, Trophy, Clock, ChevronRight, Check } from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const CATEGORIES = ['Travel', 'Business', 'Daily', 'Academic', 'Food', 'Technology', 'Health', 'Sports'];

const LEVEL_COLORS = { A1: '#22C55E', A2: '#3B82F6', B1: '#8B5CF6', B2: '#F59E0B', C1: '#EF4444' };

export default function VocabularyPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('learn');
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filterLevel, setFilterLevel] = useState(user?.level || 'A1');
  const [filterCategory, setFilterCategory] = useState('');
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetchCards();
    fetchStats();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocabulary/review?level=${filterLevel}&count=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
      }
    } catch {}
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/vocabulary/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const handleReview = async (quality) => {
    if (!cards[currentCard]) return;
    try {
      await fetch('/api/vocabulary/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ wordId: cards[currentCard].id, quality })
      });
    } catch {}

    setFlipped(false);
    if (currentCard < cards.length - 1) {
      setCurrentCard(c => c + 1);
    } else {
      fetchStats();
      setCards([]);
      setCurrentCard(0);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '2rem', color: '#1a202c', marginBottom: 4 }}>
            📚 Từ vựng
          </h1>
          <p style={{ color: '#718096', fontWeight: 600 }}>Học từ vựng với Flashcard & Spaced Repetition</p>
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Từ đã học', value: stats.totalWordsLearned, icon: '📖' },
              { label: 'Cần ôn hôm nay', value: stats.wordsDueToday, icon: '⏰' },
              { label: 'Đã thuộc', value: stats.masteredWords, icon: '✅' },
            ].map((s, i) => (
              <div key={i} className="clay-card" style={{ padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: LEVEL_COLORS[filterLevel] }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { id: 'learn', label: '🃏 Flashcard', icon: <BookOpen size={16} /> },
          { id: 'browse', label: '📖 Danh sách từ', icon: <Sparkles size={16} /> },
          { id: 'quiz', label: '🎯 Quiz', icon: <Trophy size={16} /> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="clay-btn"
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, #22C55E, #16a34a)' : 'white',
              color: activeTab === tab.id ? 'white' : '#4a5568',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem',
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select className="clay-input" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          style={{ cursor: 'pointer', minWidth: 120 }}>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="clay-input" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{ cursor: 'pointer', minWidth: 140 }}>
          <option value="">Tất cả chủ đề</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="clay-btn clay-btn-primary" onClick={fetchCards}>
          <Sparkles size={16} /> Lấy từ mới
        </button>
      </div>

      {/* Flashcard Tab */}
      {activeTab === 'learn' && (
        <div>
          {cards.length > 0 && currentCard < cards.length ? (
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 12, color: '#718096', fontWeight: 700 }}>
                Thẻ {currentCard + 1} / {cards.length}
              </div>

              {/* Card */}
              <div
                onClick={() => setFlipped(!flipped)}
                style={{
                  minHeight: 280, borderRadius: 24, cursor: 'pointer',
                  background: flipped
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(173,216,230,0.1))'
                    : 'white',
                  border: flipped ? '3px solid rgba(34,197,94,0.3)' : '3px solid rgba(0,0,0,0.08)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                }}>
                {!flipped ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1a202c', marginBottom: 8 }}>
                      {cards[currentCard].word}
                    </div>
                    <div style={{ fontSize: '1rem', color: '#718096', fontStyle: 'italic', marginBottom: 16 }}>
                      {cards[currentCard].pronunciation}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>Nhấn để xem nghĩa</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: LEVEL_COLORS[cards[currentCard].level], marginBottom: 8 }}>
                      {cards[currentCard].translation}
                    </div>
                    {cards[currentCard].example && (
                      <div style={{ marginTop: 16, padding: '16px', borderRadius: 12, background: 'rgba(0,0,0,0.03)', fontStyle: 'italic', color: '#4a5568' }}>
                        "{cards[currentCard].example}"
                        {cards[currentCard].exampleTranslation && (
                          <div style={{ marginTop: 6, fontSize: '0.85rem', color: '#718096', fontStyle: 'normal' }}>
                            → {cards[currentCard].exampleTranslation}
                          </div>
                        )}
                      </div>
                    )}
                    {cards[currentCard].partOfSpeech && (
                      <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#a0aec0' }}>
                        [{cards[currentCard].partOfSpeech}]
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Rating buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                {[
                  { quality: 1, label: '😓 Không nhớ', color: '#EF4444' },
                  { quality: 2, label: '🤔 Khó', color: '#F59E0B' },
                  { quality: 3, label: '🙂 Bình thường', color: '#3B82F6' },
                  { quality: 4, label: '😊 Khá dễ', color: '#22C55E' },
                  { quality: 5, label: '🤩 Rất dễ', color: '#8B5CF6' },
                ].map(btn => (
                  <button key={btn.quality} onClick={() => handleReview(btn.quality)}
                    className="clay-btn"
                    style={{
                      background: btn.color + '22',
                      border: `2px solid ${btn.color}44`,
                      color: btn.color,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      padding: '8px 16px',
                    }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="clay-card" style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontWeight: 800, color: '#1a202c', marginBottom: 8 }}>Không có từ cần ôn!</h3>
              <p style={{ color: '#718096', fontWeight: 600, marginBottom: 24 }}>
                Bạn đã hoàn thành tất cả các từ cần ôn hôm nay.
              </p>
              <button className="clay-btn clay-btn-primary" onClick={fetchCards}>
                <Sparkles size={16} /> Học thêm từ mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* Browse Tab */}
      {activeTab === 'browse' && <BrowseTab filterLevel={filterLevel} filterCategory={filterCategory} />}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && <QuizTab filterLevel={filterLevel} onComplete={fetchStats} />}
    </div>
  );
}

function BrowseTab({ filterLevel, filterCategory }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadWords();
  }, [filterLevel, filterCategory]);

  const loadWords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocabulary/words?level=${filterLevel}${filterCategory ? `&category=${filterCategory}` : ''}&page=0&size=50`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setWords(await res.json());
    } catch {}
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) { loadWords(); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/vocabulary/search?q=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setWords(await res.json());
    } catch {}
    setLoading(false);
  };

  const addToLearning = async (wordId) => {
    try {
      await fetch(`/api/vocabulary/words/${wordId}/learn`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input className="clay-input" placeholder="Tìm từ..." value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }} />
        <button className="clay-btn clay-btn-primary" onClick={handleSearch}>Tìm</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>Đang tải...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {words.map((word, i) => (
            <div key={i} className="clay-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1a202c' }}>{word.word}</div>
                  <div style={{ fontSize: '0.85rem', color: '#718096', fontStyle: 'italic' }}>{word.pronunciation}</div>
                </div>
                <span style={{
                  background: LEVEL_COLORS[word.level] + '22',
                  color: LEVEL_COLORS[word.level],
                  fontWeight: 800, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 8,
                }}>
                  {word.level}
                </span>
              </div>
              <div style={{ marginTop: 8, fontWeight: 700, color: LEVEL_COLORS[filterLevel] }}>{word.translation}</div>
              {word.example && (
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#4a5568', fontStyle: 'italic' }}>
                  "{word.example}"
                </div>
              )}
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                  Mastery: {word.masteryLevel}/5
                </span>
                {word.masteryLevel === 0 && (
                  <button className="clay-btn" style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                    onClick={() => addToLearning(word.id)}>
                    + Học từ này
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuizTab({ filterLevel, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setAnswers({});
    setShowResult(false);
    try {
      const res = await fetch(`/api/vocabulary/quiz?level=${filterLevel}&count=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch {}
    setLoading(false);
  };

  const submitQuiz = async () => {
    setShowResult(true);
    const results = [];
    for (const q of questions) {
      const correct = answers[q.wordId] === q.correctAnswer;
      if (correct) results.push({ wordId: q.wordId, correct: true, answer: answers[q.wordId] });
      else results.push({ wordId: q.wordId, correct: false, answer: answers[q.wordId] });

      // Submit to backend
      try {
        await fetch('/api/vocabulary/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify([{ wordId: q.wordId, answer: correct ? 'correct' : 'wrong' }])
        });
      } catch {}
    }
    onComplete();
  };

  const score = questions.filter(q => answers[q.wordId] === q.correctAnswer).length;
  const pct = questions.length > 0 ? Math.round(score / questions.length * 100) : 0;

  return (
    <div>
      {questions.length === 0 ? (
        <div className="clay-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎯</div>
          <h3 style={{ fontWeight: 800, color: '#1a202c', marginBottom: 8 }}>Quiz từ vựng</h3>
          <p style={{ color: '#718096', fontWeight: 600, marginBottom: 24 }}>
            Kiểm tra kiến thức từ vựng của bạn!
          </p>
          <button className="clay-btn clay-btn-primary" onClick={startQuiz} disabled={loading}>
            {loading ? '⏳ Đang tải...' : '🎮 Bắt đầu Quiz'}
          </button>
        </div>
      ) : (
        <div>
          {showResult && (
            <div className="clay-card" style={{ padding: 32, textAlign: 'center', marginBottom: 24,
              background: pct >= 80 ? 'rgba(34,197,94,0.1)' : pct >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
              border: `3px solid ${pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444'}44`,
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>
                {pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}
              </div>
              <div style={{ fontWeight: 900, fontSize: '2rem', color: pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444' }}>
                {score}/{questions.length} đúng
              </div>
              <div style={{ fontWeight: 700, color: '#718096', marginTop: 4 }}>{pct}% accuracy</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {questions.map((q, qi) => (
              <div key={qi} className="clay-card" style={{ padding: 24 }}>
                <div style={{ fontWeight: 800, color: '#1a202c', marginBottom: 16 }}>
                  <span style={{ color: '#22C55E' }}>Câu {qi + 1}:</span> {q.question}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {q.options?.map((opt, oi) => (
                    <button key={oi} onClick={() => !showResult && setAnswers({ ...answers, [q.wordId]: opt })}
                      style={{
                        padding: '10px 16px', borderRadius: 12, cursor: showResult ? 'default' : 'pointer',
                        fontWeight: 600, fontSize: '0.9rem',
                        background: showResult
                          ? (opt === q.correctAnswer ? 'rgba(34,197,94,0.15)' : answers[q.wordId] === opt ? 'rgba(239,68,68,0.15)' : 'white')
                          : (answers[q.wordId] === opt ? 'rgba(173,216,230,0.3)' : 'white'),
                        border: `2px solid ${showResult
                          ? (opt === q.correctAnswer ? '#22C55E' : answers[q.wordId] === opt ? '#EF4444' : 'rgba(0,0,0,0.06)')
                          : (answers[q.wordId] === opt ? '#ADD8E6' : 'rgba(0,0,0,0.06)')}`,
                        color: '#2d3748',
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            {!showResult ? (
              <button className="clay-btn clay-btn-primary" onClick={submitQuiz}
                disabled={Object.keys(answers).length < questions.length}>
                Kiểm tra kết quả
              </button>
            ) : (
              <button className="clay-btn clay-btn-primary" onClick={startQuiz}>
                Chơi lại
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
