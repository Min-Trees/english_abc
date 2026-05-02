import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, ThumbsUp, Eye, CheckCircle, Search, Plus, ChevronRight } from 'lucide-react';

const CATEGORIES = ['GRAMMAR', 'VOCABULARY', 'SPEAKING', 'LISTENING', 'READING', 'WRITING', 'IELTS', 'TOEIC', 'GENERAL'];
const LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];

const CAT_COLORS = {
  GRAMMAR: '#8B5CF6', VOCABULARY: '#22C55E', SPEAKING: '#3B82F6',
  LISTENING: '#F59E0B', READING: '#EC4899', WRITING: '#14B8A6',
  IELTS: '#EF4444', TOEIC: '#6366F1', GENERAL: '#6B7280'
};

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchPosts(); }, [page, filterCat, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 15 });
      if (filterCat) params.append('category', filterCat);
      if (search) params.append('q', search);
      const res = await fetch(`/api/forum/posts?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch {}
    setLoading(false);
  };

  const likePost = async (id) => {
    try {
      await fetch(`/api/forum/posts/${id}/like`, {
        method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPosts();
    } catch {}
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '2rem', color: '#1a202c', marginBottom: 4 }}>
            💬 Diễn đàn
          </h1>
          <p style={{ color: '#718096', fontWeight: 600 }}>Hỏi đáp & trao đổi với cộng đồng</p>
        </div>
        <button className="clay-btn clay-btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Đăng bài mới
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
          <input className="clay-input" placeholder="Tìm kiếm bài viết..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            onKeyDown={e => e.key === 'Enter' && setPage(0)}
            style={{ paddingLeft: 44, width: '100%' }} />
        </div>
        <select className="clay-input" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(0); }}
          style={{ cursor: 'pointer', minWidth: 140 }}>
          <option value="">Tất cả</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Posts */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className="clay-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
          <p style={{ color: '#718096', fontWeight: 600 }}>Chưa có bài viết nào</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={likePost} user={user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className="clay-btn"
              style={{
                background: page === i ? 'linear-gradient(135deg, #22C55E, #16a34a)' : 'white',
                color: page === i ? 'white' : '#4a5568',
                minWidth: 40,
              }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={fetchPosts} user={user} />}
    </div>
  );
}

function PostCard({ post, onLike, user }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const catColor = CAT_COLORS[post.category] || '#6B7280';

  const loadComments = async () => {
    if (!showComments) {
      try {
        const res = await fetch(`/api/forum/posts/${post.id}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setComments(await res.json());
      } catch {}
    }
    setShowComments(!showComments);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`/api/forum/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ content: newComment })
      });
      setNewComment('');
      loadComments();
    } catch {}
  };

  return (
    <div className="clay-card" style={{ padding: 24 }}>
      {/* Category badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: catColor + '22', color: catColor, fontWeight: 800, fontSize: '0.75rem', padding: '2px 10px', borderRadius: 8 }}>
            {post.category}
          </span>
          {post.level && post.level !== 'ALL' && (
            <span style={{ background: 'rgba(0,0,0,0.06)', color: '#718096', fontWeight: 700, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6 }}>
              {post.level}
            </span>
          )}
          {post.isSolved && <span style={{ background: '#22C55E22', color: '#22C55E', fontWeight: 800, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6 }}>✓ Đã giải</span>}
          {post.isPinned && <span style={{ background: '#F59E0B22', color: '#F59E0B', fontWeight: 800, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6 }}>📌</span>}
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: '#a0aec0', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={14} /> {post.viewCount}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ThumbsUp size={14} /> {post.likeCount}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14} /> {post.commentCount}</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a202c', marginBottom: 8, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}>
        {post.title}
      </h3>

      {/* Content preview */}
      <p style={{ color: '#4a5568', lineHeight: 1.7, marginBottom: 12,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2, WebkitBoxOrient: 'vertical' }}>
        {post.content}
      </p>

      {/* Author */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #FDBCB4, #ADD8E6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', color: '#7c2d12' }}>
            {(post.author?.fullName || post.author?.username || 'U')[0].toUpperCase()}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>
            {post.author?.fullName || post.author?.username}
          </span>
          {post.mentor && <span style={{ fontSize: '0.75rem', background: '#3B82F622', color: '#3B82F6', fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>Mentor</span>}
        </div>
        <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, borderTop: '2px solid rgba(0,0,0,0.04)', paddingTop: 12 }}>
        <button onClick={() => onLike(post.id)} className="clay-btn" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
          👍 Thích
        </button>
        <button onClick={loadComments} className="clay-btn" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
          <MessageCircle size={14} /> Bình luận
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px solid rgba(0,0,0,0.06)' }}>
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: 12, paddingLeft: c.isMentorReply ? 24 : 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: c.isMentorReply ? '#3B82F6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.7rem', color: c.isMentorReply ? 'white' : '#718096', flexShrink: 0 }}>
                  {(c.author?.username || 'U')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a202c' }}>{c.author?.username}</span>
                    {c.isMentorReply && <span style={{ fontSize: '0.7rem', background: '#3B82F622', color: '#3B82F6', fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>MENTOR</span>}
                    {c.isAcceptedAnswer && <CheckCircle size={14} color="#22C55E" />}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.6 }}>{c.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input className="clay-input" placeholder="Viết bình luận..." value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitComment()}
              style={{ flex: 1, fontSize: '0.9rem' }} />
            <button className="clay-btn clay-btn-primary" onClick={submitComment} style={{ padding: '8px 16px' }}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CreatePostModal({ onClose, onCreated, user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [level, setLevel] = useState('ALL');
  const [tags, setTags] = useState('');

  const submit = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ title, content, category, level, tags })
      });
      onCreated();
      onClose();
    } catch {}
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="clay-card" style={{ width: '100%', maxWidth: 600, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontWeight: 900, marginBottom: 24, color: '#1a202c' }}>📝 Đăng bài mới</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#2d3748' }}>Tiêu đề</label>
            <input className="clay-input" placeholder="Nhập tiêu đề..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#2d3748', fontSize: '0.85rem' }}>Chủ đề</label>
              <select className="clay-input" value={category} onChange={e => setCategory(e.target.value)} style={{ cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#2d3748', fontSize: '0.85rem' }}>Cấp độ</label>
              <select className="clay-input" value={level} onChange={e => setLevel(e.target.value)} style={{ cursor: 'pointer' }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#2d3748' }}>Nội dung</label>
            <textarea className="clay-textarea" placeholder="Viết nội dung câu hỏi..." value={content} onChange={e => setContent(e.target.value)} style={{ minHeight: 160 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#2d3748', fontSize: '0.85rem' }}>Tags (tùy chọn)</label>
            <input className="clay-input" placeholder=" Ví dụ: present-simple, grammar" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="clay-btn" onClick={onClose}>Hủy</button>
          <button className="clay-btn clay-btn-primary" onClick={submit}>Đăng bài</button>
        </div>
      </div>
    </div>
  );
}
