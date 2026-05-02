import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, BookOpen, Video, Headphones, FileText, ChevronDown, ChevronRight, Clock } from 'lucide-react';

const TYPE_ICONS = { VIDEO: Video, AUDIO: Headphones, READING: BookOpen, EXERCISE: CheckCircle, QUIZ: FileText };
const TYPE_COLORS = { VIDEO: '#EF4444', AUDIO: '#3B82F6', READING: '#8B5CF6', EXERCISE: '#22C55E', QUIZ: '#F59E0B' };

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourse(); }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [courseRes, chaptersRes, progressRes, enrollRes] = await Promise.all([
        fetch(`/api/courses/${id}`, { headers }),
        fetch(`/api/lessons/courses/${id}/chapters`, { headers }),
        fetch(`/api/lessons/courses/${id}/progress`, { headers }),
        fetch(`/api/lessons/enrollments`, { headers })
      ]);

      if (courseRes.ok) setCourse(await courseRes.json());
      if (chaptersRes.ok) setChapters(await chaptersRes.json());
      if (progressRes.ok) setProgress(await progressRes.json());
      if (enrollRes.ok) {
        const enrolls = await enrollRes.json();
        setEnrolled(enrolls.some(e => e.course?.id === parseInt(id)));
      }
    } catch {}
    setLoading(false);
  };

  const enroll = async () => {
    try {
      await fetch(`/api/lessons/courses/${id}/enroll`, {
        method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnrolled(true);
    } catch {}
  };

  const completeLesson = async (lessonId) => {
    try {
      await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCourse();
    } catch {}
  };

  if (loading || !course) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#718096', fontWeight: 600 }}>Đang tải...</div>;
  }

  const completedCount = progress.filter(p => p.completed).length;
  const progressPercent = progress.length > 0 ? Math.round(completedCount / progress.length * 100) : 0;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      {/* Back link */}
      <Link to="/courses" style={{ textDecoration: 'none', color: '#718096', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
        ← Quay lại khóa học
      </Link>

      {/* Course Header */}
      <div className="clay-card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 120, height: 80, borderRadius: 16, background: 'linear-gradient(135deg, #FDBCB4, #22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <BookOpen size={36} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#1a202c', marginBottom: 8 }}>{course.title}</h1>
            <p style={{ color: '#718096', fontWeight: 600, marginBottom: 12 }}>{course.description}</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.85rem', color: '#718096' }}>
              <span>📖 {course.totalLessons} bài học</span>
              <span>👥 {course.enrolledCount} học viên</span>
              <span>⭐ {course.rating?.toFixed(1) || 'N/A'}</span>
              <span>📊 {course.level}</span>
              <span>👨‍🏫 {course.instructor || 'ABC English'}</span>
            </div>
          </div>
          {!enrolled ? (
            <button className="clay-btn clay-btn-primary" onClick={enroll}
              style={{ padding: '14px 32px', fontSize: '1rem', flexShrink: 0 }}>
              Đăng ký ngay
            </button>
          ) : (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#22C55E' }}>{progressPercent}%</div>
              <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>Hoàn thành</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {enrolled && (
          <div style={{ marginTop: 20 }}>
            <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 12, height: 10, overflow: 'hidden' }}>
              <div style={{
                width: `${progressPercent}%`, height: '100%',
                background: 'linear-gradient(90deg, #22C55E, #16a34a)',
                borderRadius: 12, transition: 'width 0.5s',
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: 6, fontWeight: 600 }}>
              {completedCount}/{progress.length} bài đã hoàn thành
            </div>
          </div>
        )}
      </div>

      {/* Chapters & Lessons */}
      <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a202c', marginBottom: 20 }}>📚 Nội dung khóa học</h2>

      {chapters.length === 0 ? (
        <div className="clay-card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#718096', fontWeight: 600 }}>Khóa học đang được cập nhật...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chapters.map((chapter, ci) => {
            const isExpanded = expandedChapter === ci;
            const Icon = isExpanded ? ChevronDown : ChevronRight;
            const lessonProgress = progress.filter(p => p.lesson?.chapter?.id === chapter.id && p.completed).length;
            const totalLessons = chapter.lessons?.length || 0;

            return (
              <div key={ci} className="clay-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Chapter header */}
                <div onClick={() => setExpandedChapter(isExpanded ? null : ci)}
                  style={{
                    padding: '18px 24px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: isExpanded ? 'rgba(0,0,0,0.02)' : 'transparent',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} color="#4a5568" />
                    <div>
                      <div style={{ fontWeight: 800, color: '#1a202c' }}>Chương {ci + 1}: {chapter.title}</div>
                      {chapter.description && (
                        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 500 }}>{chapter.description}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>
                      {lessonProgress}/{totalLessons}
                    </span>
                    {enrolled && lessonProgress === totalLessons && totalLessons > 0 && (
                      <CheckCircle size={20} color="#22C55E" />
                    )}
                  </div>
                </div>

                {/* Lessons */}
                {isExpanded && chapter.lessons?.map((lesson, li) => {
                  const isCompleted = progress.some(p => p.lesson?.id === lesson.id && p.completed);
                  const TypeIcon = TYPE_ICONS[lesson.type] || BookOpen;
                  const typeColor = TYPE_COLORS[lesson.type] || '#6B7280';

                  return (
                    <div key={li} style={{
                      padding: '14px 24px 14px 54px',
                      borderTop: '1px solid rgba(0,0,0,0.04)',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <TypeIcon size={18} color={typeColor} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '0.95rem' }}>{lesson.title}</div>
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: '#a0aec0', marginTop: 2 }}>
                          {lesson.durationMinutes > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={12} /> {lesson.durationMinutes} phút
                            </span>
                          )}
                          <span>+{lesson.xpReward} XP</span>
                        </div>
                      </div>
                      {enrolled && (
                        isCompleted ? (
                          <CheckCircle size={22} color="#22C55E" />
                        ) : lesson.type === 'VIDEO' || lesson.type === 'AUDIO' ? (
                          <Link to={`/lessons/${lesson.id}`} className="clay-btn" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                            <Play size={14} /> Học
                          </Link>
                        ) : (
                          <button className="clay-btn clay-btn-primary" style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                            onClick={() => completeLesson(lesson.id)}>
                            Hoàn thành
                          </button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
