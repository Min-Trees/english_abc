import React, { useState } from 'react';
import { exerciseAPI } from '../api/api';
import { toast } from 'react-toastify';
import { Settings, PenLine, Plus, Send } from 'lucide-react';

const BLANK_EXERCISE = {
  title: '', description: '', type: 'MULTIPLE_CHOICE',
  skill: 'GRAMMAR', level: 'A1', topic: '',
  content: '', answerKey: '', explanation: '',
};

export default function TeacherDashboardPage() {
  const [form, setForm] = useState(BLANK_EXERCISE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.warning('Vui lòng điền tiêu đề và nội dung bài tập');
      return;
    }
    setSaving(true);
    try {
      await exerciseAPI.create(form);
      toast.success('Tạo bài tập thành công! 🎉');
      setSaved(true);
      setForm(BLANK_EXERCISE);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi tạo bài tập');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'title', label: 'Tiêu đề bài tập *', type: 'text', placeholder: 'Ví dụ: Present Perfect Practice' },
    { key: 'description', label: 'Mô tả', type: 'text', placeholder: 'Mô tả ngắn về bài tập' },
    { key: 'topic', label: 'Chủ đề', type: 'text', placeholder: 'Ví dụ: Travel, Business, Grammar' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Settings size={28} color="#3b82f6" />
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#1a202c', margin: 0 }}>Teacher Panel</h1>
          <p style={{ color: '#718096', fontWeight: 600, margin: 0 }}>Tạo và quản lý bài tập cho học viên</p>
        </div>
      </div>

      <div className="clay-card" style={{ padding: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a202c', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={20} color="#3b82f6" /> Tạo bài tập mới
        </h2>

        {saved && (
          <div style={{
            padding: '14px 20px', borderRadius: 14, marginBottom: 20,
            background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)',
            color: '#16a34a', fontWeight: 700,
          }}>
            ✅ Bài tập đã được tạo thành công và đang chờ duyệt!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#2d3748', fontSize: '0.9rem' }}>
                {f.label}
              </label>
              <input
                className="clay-input"
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
              />
            </div>
          ))}

          {/* Select fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
            {[
              { key: 'skill', label: 'Kỹ năng *', options: ['GRAMMAR', 'VOCABULARY', 'WRITING', 'SPEAKING', 'READING', 'LISTENING'] },
              { key: 'level', label: 'Trình độ *', options: ['A1', 'A2', 'B1', 'B2', 'C1'] },
              { key: 'type', label: 'Loại bài tập *', options: ['MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'WRITING', 'SPEAKING', 'READING', 'LISTENING'] },
            ].map(s => (
              <div key={s.key}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#2d3748', fontSize: '0.9rem' }}>
                  {s.label}
                </label>
                <select
                  className="clay-input"
                  style={{ paddingLeft: 14 }}
                  value={form[s.key]}
                  onChange={e => handleChange(s.key, e.target.value)}
                >
                  {s.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#2d3748', fontSize: '0.9rem' }}>
              Nội dung bài tập *
            </label>
            <textarea
              className="clay-input"
              rows={5}
              placeholder="Nhập nội dung, câu hỏi hoặc đoạn văn bản cho bài tập..."
              value={form.content}
              onChange={e => handleChange('content', e.target.value)}
              style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#2d3748', fontSize: '0.9rem' }}>
              Đáp án / Answer Key *
            </label>
            <textarea
              className="clay-input"
              rows={3}
              placeholder="Đáp án chính xác hoặc mẫu đáp án tốt..."
              value={form.answerKey}
              onChange={e => handleChange('answerKey', e.target.value)}
              style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#2d3748', fontSize: '0.9rem' }}>
              Giải thích (Vietnamese)
            </label>
            <textarea
              className="clay-input"
              rows={3}
              placeholder="Giải thích bằng tiếng Việt để học viên hiểu rõ hơn..."
              value={form.explanation}
              onChange={e => handleChange('explanation', e.target.value)}
              style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              className="clay-btn clay-btn-primary"
              style={{ flex: 1, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
              disabled={saving}
            >
              {saving ? '⏳ Đang lưu...' : <><Send size={16} /> Tạo bài tập</>}
            </button>
            <button
              type="button"
              className="clay-btn"
              onClick={() => { setForm(BLANK_EXERCISE); setSaved(false); }}
            >
              🔄 Làm mới
            </button>
          </div>
        </form>
      </div>

      <div className="clay-card" style={{ padding: 24, marginTop: 20, background: 'rgba(59,130,246,0.04)', border: '2px solid rgba(59,130,246,0.12)' }}>
        <h3 style={{ fontWeight: 800, color: '#1a202c', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenLine size={18} color="#3b82f6" /> Quy tắc tạo nội dung
        </h3>
        <ul style={{ color: '#4a5568', fontWeight: 600, paddingLeft: 20, lineHeight: 2 }}>
          <li>Nội dung phải rõ ràng, chính xác về mặt ngôn ngữ học</li>
          <li>Bài tập MULTIPLE_CHOICE cần có đúng 1 đáp án đúng</li>
          <li>Luôn cung cấp giải thích bằng tiếng Việt</li>
          <li>Đáp án phải đầy đủ và có thể kiểm chứng</li>
          <li>Nội dung sẽ được Admin duyệt trước khi xuất bản</li>
        </ul>
      </div>
    </div>
  );
}
