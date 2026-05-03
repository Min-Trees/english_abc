import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { agentAPI, resultAPI, adminAPI } from '../api/api';
import { Bot, BookOpen, BarChart2, Trophy, Zap, Target, ChevronRight, Shield, Settings } from 'lucide-react';

function AdminSummary() {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminAPI.getStats().then(r => setStats(r.data)).catch(() => {}); }, []);
  return (
    <div>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Tổng users', value: stats.totalUsers, icon: '👥', color: '#3b82f6' },
            { label: 'Khóa học', value: stats.totalCourses, icon: '📚', color: '#22C55E' },
            { label: 'Bài tập', value: stats.totalExercises, icon: '📝', color: '#f59e0b' },
            { label: 'Kết quả', value: stats.totalResults, icon: '✅', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} className="clay-card" style={{ padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Link to="/admin" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer', border: '2px solid rgba(239,68,68,0.2)' }}>
            <Shield size={32} color="#ef4444" style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 800, color: '#1a202c' }}>Admin Panel</div>
            <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>Quản lý users & hệ thống</div>
          </div>
        </Link>
        <Link to="/exercises" style={{ textDecoration: 'none' }}>
          <div className="clay-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>📚</span>
            <div style={{ fontWeight: 800, color: '#1a202c' }}>Bài tập</div>
            <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>Xem và quản lý bài tập</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function TeacherSummary() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Link to="/teacher" style={{ textDecoration: 'none' }}>
        <div className="clay-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer', border: '2px solid rgba(59,130,246,0.2)' }}>
          <Settings size={32} color="#3b82f6" style={{ marginBottom: 8 }} />
          <div style={{ fontWeight: 800, color: '#1a202c' }}>Teacher Panel</div>
          <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>Tạo và quản lý bài tập</div>
        </div>
      </Link>
      <Link to="/exercises" style={{ textDecoration: 'none' }}>
        <div className="clay-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>📋</span>
          <div style={{ fontWeight: 800, color: '#1a202c' }}>Xem bài tập</div>
          <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>Duyệt và chỉnh sửa</div>
        </div>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [guidance, setGuidance] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      agentAPI.getGuidance(user.userId).then(r => setGuidance(r.data)).catch(() => {});
    }
    resultAPI.getMyResults().then(r => setResults(r.data)).catch(() => {});
  }, [user]);

  const avgScore = results.length > 0
    ? (results.reduce((s, r) => s + (r.score || 0), 0) / results.length).toFixed(1)
    : '—';

  const quickActions = [
    { to: '/agent', icon: '🤖', label: 'AI Tutor', desc: 'Chat với AI', color: '#FDBCB4' },
    { to: '/agent?tab=score', icon: '📊', label: 'Chấm điểm', desc: 'Nộp bài', color: '#ADD8E6' },
    { to: '/exercises', icon: '📝', label: 'Bài tập', desc: 'Luyện tập', color: '#22C55E' },
    { to: '/analytics', icon: '📈', label: 'Phân tích', desc: 'Xem thống kê', color: '#c084fc' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Welcome */}
      <div className="clay-card" style={{
        padding: 36, marginBottom: 32,
        background: 'linear-gradient(135deg, rgba(253,188,180,0.2), rgba(173,216,230,0.2))',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 28,
          background: 'linear-gradient(135deg, #FDBCB4, #22C55E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', flexShrink: 0,
          boxShadow: '0 8px 24px rgba(253,188,180,0.5)',
        }}>
          👋
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#1a202c', marginBottom: 6 }}>
            Chào mừng trở lại, {user?.fullName || user?.username}!
          </h1>
          <p style={{ color: '#718096', fontWeight: 600 }}>Tiếp tục hành trình học tiếng Anh của bạn hôm nay 🚀</p>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Level', value: user?.level, color: '#22C55E' },
            { label: 'Điểm', value: user?.totalPoints || 0, color: '#FDBCB4' },
            { label: 'TB Score', value: avgScore, color: '#ADD8E6' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontWeight: 900, fontSize: '1.5rem', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a202c', marginBottom: 20 }}>⚡ Hành động nhanh</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        {quickActions.map((action, i) => (
          <Link key={i} to={action.to} style={{ textDecoration: 'none' }}>
            <div className="clay-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: `linear-gradient(135deg, ${action.color}44, ${action.color}22)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', margin: '0 auto 12px',
              }}>
                {action.icon}
              </div>
              <div style={{ fontWeight: 800, color: '#1a202c', marginBottom: 4 }}>{action.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Role-based section */}
        {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
          <div className="clay-card" style={{ padding: 28, gridColumn: '1 / -1' }}>
            <h3 style={{ fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#1a202c' }}>
              {user.role === 'ADMIN' ? <><Shield size={20} color="#ef4444" /> Quản lý hệ thống</> : <><Settings size={20} color="#3b82f6" /> Công cụ giảng dạy</>}
            </h3>
            {user.role === 'ADMIN' ? <AdminSummary /> : <TeacherSummary />}
          </div>
        )}

        {/* AI Guidance */}
        <div className="clay-card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#1a202c' }}>
            <Target size={20} color="#22C55E" /> Gợi ý từ AI
          </h3>
          {guidance ? (
            <div>
              <p style={{ color: '#4a5568', fontWeight: 600, marginBottom: 16, lineHeight: 1.7 }}>
                {guidance.content?.summary}
              </p>
              {guidance.content?.recommendations?.slice(0, 3).map((rec, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(34,197,94,0.06)', marginBottom: 8,
                  border: '2px solid rgba(34,197,94,0.12)',
                }}>
                  <span style={{ color: '#22C55E', fontWeight: 900, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 600 }}>{rec}</span>
                </div>
              ))}
              {guidance.content?.nextLesson && (
                <div style={{
                  marginTop: 16, padding: '12px 16px', borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(253,188,180,0.2), rgba(173,216,230,0.2))',
                  border: '2px solid rgba(253,188,180,0.3)',
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700 }}>Bài học tiếp theo</div>
                  <div style={{ fontWeight: 800, color: '#1a202c', marginTop: 4 }}>{guidance.content.nextLesson}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#718096', fontWeight: 600, textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎯</div>
              Hoàn thành một bài để nhận gợi ý từ AI!
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="clay-card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#1a202c' }}>
            <Trophy size={20} color="#FDBCB4" /> Kết quả gần đây
          </h3>
          {results.length > 0 ? (
            results.slice(0, 5).map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(0,0,0,0.02)', marginBottom: 8,
                border: '2px solid rgba(0,0,0,0.04)',
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1a202c' }}>
                    {r.skillType} {r.exercise ? `- ${r.exercise.title}` : ''}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                    {new Date(r.completedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div style={{
                  fontWeight: 900, fontSize: '1.2rem',
                  color: r.score >= 8 ? '#22C55E' : r.score >= 5 ? '#f59e0b' : '#ef4444',
                }}>
                  {r.score}/10
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#718096', fontWeight: 600, textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
              Chưa có kết quả nào. Hãy bắt đầu làm bài!
            </div>
          )}
          <Link to="/progress" style={{ textDecoration: 'none' }}>
            <button className="clay-btn clay-btn-blue" style={{ width: '100%', marginTop: 12, fontSize: '0.9rem' }}>
              Xem tất cả <ChevronRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
