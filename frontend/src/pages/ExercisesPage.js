import React, { useEffect, useState } from 'react';
import { exerciseAPI, agentAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Filter, BookOpen, PenLine, Mic, Eye, Volume2, Brain } from 'lucide-react';

const SKILL_ICONS = {
  GRAMMAR: <Brain size={16} />,
  VOCABULARY: <BookOpen size={16} />,
  WRITING: <PenLine size={16} />,
  SPEAKING: <Mic size={16} />,
  READING: <Eye size={16} />,
  LISTENING: <Volume2 size={16} />,
};

const SKILL_COLORS = {
  GRAMMAR: '#22C55E', VOCABULARY: '#3b82f6',
  WRITING: '#FDBCB4', SPEAKING: '#f59e0b',
  READING: '#8b5cf6', LISTENING: '#06b6d4',
};

const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1'];
const SKILLS = ['', 'GRAMMAR', 'VOCABULARY', 'WRITING', 'SPEAKING', 'READING', 'LISTENING'];

export default function ExercisesPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState('');
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    loadExercises();
  }, [filterLevel, filterSkill]);

  const loadExercises = () => {
    setLoading(true);
    exerciseAPI.getAll(filterLevel || null, filterSkill || null)
      .then(r => setExercises(r.data))
      .catch(() => toast.error('Không thể tải bài tập'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.warning('Hãy nhập câu trả lời của bạn'); return; }
    if (!user) { toast.warning('Vui lòng đăng nhập để nộp bài'); return; }
    setScoring(true);
    try {
      const skillType = selected.skill || 'WRITING';
      const res = await agentAPI.score({
        skillType,
        userText: answer,
        question: selected.title,
        correctAnswer: selected.answerKey || '',
        exerciseId: selected.id,
      });
      setScoreResult(res.data);
    } catch {
      toast.error('Lỗi chấm điểm. Vui lòng thử lại.');
    } finally {
      setScoring(false);
    }
  };

  const resetExercise = () => {
    setSelected(null);
    setAnswer('');
    setScoreResult(null);
  };

  if (selected) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={resetExercise} className="clay-btn" style={{ marginBottom: 20, fontSize: '0.9rem' }}>
          ← Quay lại
        </button>

        <div className="clay-card" style={{ padding: 32, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 8,
              background: SKILL_COLORS[selected.skill] + '22',
              color: SKILL_COLORS[selected.skill],
              fontWeight: 800, fontSize: '0.8rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {SKILL_ICONS[selected.skill]} {selected.skill}
            </span>
            <span style={{
              padding: '4px 10px', borderRadius: 8,
              background: 'rgba(0,0,0,0.05)',
              fontWeight: 700, fontSize: '0.8rem', color: '#718096',
            }}>{selected.level}</span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1a202c', marginBottom: 12 }}>{selected.title}</h2>
          <p style={{ color: '#4a5568', fontWeight: 600, lineHeight: 1.7, marginBottom: 16 }}>{selected.description}</p>
          {selected.content && (
            <div style={{
              padding: '16px 20px', borderRadius: 14,
              background: 'rgba(173,216,230,0.1)', border: '2px solid rgba(173,216,230,0.3)',
              marginBottom: 16,
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#718096', marginBottom: 8 }}>📋 Nội dung bài</div>
              <p style={{ color: '#2d3748', lineHeight: 1.7, margin: 0, fontWeight: 600 }}>{selected.content}</p>
            </div>
          )}
        </div>

        {!scoreResult ? (
          <div className="clay-card" style={{ padding: 28 }}>
            <label style={{ display: 'block', fontWeight: 800, color: '#1a202c', marginBottom: 12 }}>
              ✍️ Câu trả lời của bạn:
            </label>
            <textarea
              className="clay-input"
              rows={6}
              placeholder="Nhập câu trả lời của bạn ở đây..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              style={{ width: '100%', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <button
              className="clay-btn clay-btn-primary"
              style={{ width: '100%', marginTop: 16, fontSize: '1rem', opacity: scoring ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={scoring}
            >
              {scoring ? '🤖 AI đang chấm...' : '📊 Nộp bài & Chấm điểm'}
            </button>
          </div>
        ) : (
          <div className="clay-card" style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1a202c', marginBottom: 20 }}>🎯 Kết quả chấm điểm</h3>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                fontSize: '4rem', fontWeight: 900,
                color: scoreResult.content?.score >= 8 ? '#22C55E' : scoreResult.content?.score >= 5 ? '#f59e0b' : '#ef4444',
              }}>
                {scoreResult.content?.score}/10
              </div>
            </div>
            {scoreResult.content?.criteria && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 800, color: '#1a202c', marginBottom: 10 }}>Tiêu chí đánh giá:</div>
                {Object.entries(scoreResult.content.criteria).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#4a5568' }}>{k}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                        <div style={{ height: '100%', borderRadius: 3, background: '#22C55E', width: `${(v / 3) * 100}%` }} />
                      </div>
                      <span style={{ fontWeight: 800, color: '#22C55E', minWidth: 30, textAlign: 'right' }}>{v}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.06)', border: '2px solid rgba(34,197,94,0.15)', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#16a34a', marginBottom: 8 }}>💬 Nhận xét:</div>
              <p style={{ color: '#4a5568', fontWeight: 600, margin: 0, lineHeight: 1.7 }}>{scoreResult.content?.feedback}</p>
            </div>
            {scoreResult.content?.improvement?.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, color: '#1a202c', marginBottom: 10 }}>📈 Gợi ý cải thiện:</div>
                {scoreResult.content.improvement.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(253,188,180,0.1)' }}>
                    <span style={{ color: '#FDBCB4', fontWeight: 900 }}>→</span>
                    <span style={{ color: '#4a5568', fontWeight: 600, fontSize: '0.9rem' }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}
            {selected.explanation && (
              <div style={{ marginTop: 16, padding: '14px 18px', borderRadius: 12, background: 'rgba(173,216,230,0.1)', border: '2px solid rgba(173,216,230,0.3)' }}>
                <div style={{ fontWeight: 800, color: '#0369a1', marginBottom: 6 }}>📚 Giải thích:</div>
                <p style={{ color: '#4a5568', fontWeight: 600, margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.explanation}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="clay-btn" style={{ flex: 1 }} onClick={resetExercise}>← Danh sách bài tập</button>
              <button className="clay-btn clay-btn-primary" style={{ flex: 1 }} onClick={() => { setScoreResult(null); setAnswer(''); }}>🔄 Làm lại</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#1a202c', marginBottom: 8 }}>💪 Bài Tập</h1>
        <p style={{ color: '#718096', fontWeight: 600 }}>Luyện tập các kỹ năng tiếng Anh với bài tập phù hợp trình độ của bạn</p>
      </div>

      {/* Filters */}
      <div className="clay-card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={18} color="#718096" />
        <select
          className="clay-input"
          style={{ flex: 1, minWidth: 120, maxWidth: 160, paddingLeft: 12 }}
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value)}
        >
          <option value="">Tất cả Level</option>
          {LEVELS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          className="clay-input"
          style={{ flex: 1, minWidth: 140, maxWidth: 180, paddingLeft: 12 }}
          value={filterSkill}
          onChange={e => setFilterSkill(e.target.value)}
        >
          <option value="">Tất cả Kỹ năng</option>
          {SKILLS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {user?.level && !filterLevel && (
          <button
            className="clay-btn clay-btn-blue"
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            onClick={() => setFilterLevel(user.level)}
          >
            Theo level của tôi ({user.level})
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096', fontWeight: 700 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>Đang tải bài tập...
        </div>
      ) : exercises.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }} className="clay-card">
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📝</div>
          <div style={{ fontWeight: 800, color: '#1a202c', marginBottom: 8 }}>Không tìm thấy bài tập</div>
          <p style={{ color: '#718096', fontWeight: 600 }}>Thử thay đổi bộ lọc hoặc sử dụng AI để tạo bài tập mới</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {exercises.map(ex => (
            <div key={ex.id} className="clay-card" style={{ padding: 24, cursor: 'pointer' }} onClick={() => { setSelected(ex); setScoreResult(null); setAnswer(''); }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 8,
                  background: (SKILL_COLORS[ex.skill] || '#22C55E') + '22',
                  color: SKILL_COLORS[ex.skill] || '#22C55E',
                  fontWeight: 800, fontSize: '0.75rem',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {SKILL_ICONS[ex.skill]} {ex.skill}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.05)', fontWeight: 700, fontSize: '0.75rem', color: '#718096' }}>
                  {ex.level}
                </span>
                {ex.topic && (
                  <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(173,216,230,0.2)', fontWeight: 700, fontSize: '0.75rem', color: '#0369a1' }}>
                    {ex.topic}
                  </span>
                )}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#1a202c', marginBottom: 8 }}>{ex.title}</h3>
              <p style={{ color: '#718096', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{ex.description}</p>
              <div style={{ marginTop: 16 }}>
                <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '0.85rem' }}>Bắt đầu →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
