import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';
import { toast } from 'react-toastify';
import { Users, BarChart2, BookOpen, Shield, Trash2, Edit3 } from 'lucide-react';

const ROLE_COLORS = { ADMIN: '#ef4444', TEACHER: '#3b82f6', STUDENT: '#22C55E' };
const LEVEL_COLORS = { A1: '#22C55E', A2: '#3b82f6', B1: '#f59e0b', B2: '#8b5cf6', C1: '#ef4444' };

export default function AdminDashboardPage({ tab: initialTab = 'stats' }) {
  const [tab, setTab] = useState(initialTab);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    if (tab === 'stats') loadStats();
    if (tab === 'users') loadUsers();
  }, [tab]);

  const loadStats = () => {
    setLoading(true);
    adminAPI.getStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Không thể tải thống kê'))
      .finally(() => setLoading(false));
  };

  const loadUsers = () => {
    setLoading(true);
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Không thể tải users'))
      .finally(() => setLoading(false));
  };

  const handleRoleUpdate = async (userId) => {
    if (!newRole) return;
    try {
      await adminAPI.updateRole(userId, newRole);
      toast.success('Đã cập nhật role!');
      setEditUser(null);
      loadUsers();
    } catch { toast.error('Lỗi cập nhật role'); }
  };

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Xóa user "${username}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('Đã xóa user');
      loadUsers();
    } catch { toast.error('Lỗi xóa user'); }
  };

  const tabs = [
    { id: 'stats', label: 'Thống kê', icon: <BarChart2 size={16} /> },
    { id: 'users', label: 'Quản lý Users', icon: <Users size={16} /> },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Shield size={28} color="#ef4444" />
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#1a202c', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: '#718096', fontWeight: 600, margin: 0 }}>Quản lý toàn bộ hệ thống ABC English</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="clay-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: tab === t.id ? 'linear-gradient(135deg, #ef4444, #dc2626)' : undefined,
              color: tab === t.id ? 'white' : undefined,
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {tab === 'stats' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096', fontWeight: 700 }}>⏳ Đang tải...</div>
          ) : stats ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '👥', label: 'Tổng Users', value: stats.totalUsers, color: '#3b82f6' },
                  { icon: '📚', label: 'Khóa học', value: stats.totalCourses, color: '#22C55E' },
                  { icon: '📝', label: 'Bài tập', value: stats.totalExercises, color: '#f59e0b' },
                  { icon: '✅', label: 'Kết quả', value: stats.totalResults, color: '#8b5cf6' },
                  { icon: '⭐', label: 'Điểm TB', value: `${stats.platformAverageScore}/10`, color: '#FDBCB4' },
                ].map((s, i) => (
                  <div key={i} className="clay-card" style={{ padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontWeight: 900, fontSize: '1.5rem', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 700 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="clay-card" style={{ padding: 24 }}>
                  <h3 style={{ fontWeight: 800, color: '#1a202c', marginBottom: 16 }}>👥 Users theo Role</h3>
                  {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
                    <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 8,
                          background: (ROLE_COLORS[role] || '#22C55E') + '22',
                          color: ROLE_COLORS[role] || '#22C55E',
                          fontWeight: 800, fontSize: '0.75rem',
                        }}>{role}</span>
                      </div>
                      <span style={{ fontWeight: 900, color: '#1a202c' }}>{count}</span>
                    </div>
                  ))}
                </div>
                <div className="clay-card" style={{ padding: 24 }}>
                  <h3 style={{ fontWeight: 800, color: '#1a202c', marginBottom: 16 }}>📊 Users theo Level</h3>
                  {Object.entries(stats.usersByLevel || {}).map(([level, count]) => (
                    <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 8,
                          background: (LEVEL_COLORS[level] || '#22C55E') + '22',
                          color: LEVEL_COLORS[level] || '#22C55E',
                          fontWeight: 800, fontSize: '0.75rem',
                        }}>{level}</span>
                      </div>
                      <div style={{ flex: 1, margin: '0 12px', height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          background: LEVEL_COLORS[level] || '#22C55E',
                          width: `${(count / stats.totalUsers) * 100}%`,
                        }} />
                      </div>
                      <span style={{ fontWeight: 900, color: '#1a202c', minWidth: 24, textAlign: 'right' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096', fontWeight: 700 }}>
              Không thể tải dữ liệu
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096', fontWeight: 700 }}>⏳ Đang tải...</div>
          ) : (
            <div className="clay-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)' }}>
                      {['ID', 'Username', 'Email', 'Level', 'Role', 'Points', 'Hành động'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 800, fontSize: '0.82rem', color: '#718096', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#718096', fontSize: '0.85rem' }}>{u.id}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#1a202c', fontSize: '0.9rem' }}>{u.username}</div>
                          {u.fullName && <div style={{ fontSize: '0.75rem', color: '#718096' }}>{u.fullName}</div>}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#4a5568', fontWeight: 600 }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 8,
                            background: (LEVEL_COLORS[u.level] || '#22C55E') + '22',
                            color: LEVEL_COLORS[u.level] || '#22C55E',
                            fontWeight: 800, fontSize: '0.75rem',
                          }}>{u.level}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {editUser === u.id ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <select
                                className="clay-input"
                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                value={newRole}
                                onChange={e => setNewRole(e.target.value)}
                              >
                                <option value="">Chọn role</option>
                                <option value="STUDENT">STUDENT</option>
                                <option value="TEACHER">TEACHER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              <button className="clay-btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#22C55E', color: 'white', border: 'none' }} onClick={() => handleRoleUpdate(u.id)}>✓</button>
                              <button className="clay-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setEditUser(null)}>✕</button>
                            </div>
                          ) : (
                            <span style={{
                              padding: '3px 10px', borderRadius: 8,
                              background: (ROLE_COLORS[u.role] || '#22C55E') + '22',
                              color: ROLE_COLORS[u.role] || '#22C55E',
                              fontWeight: 800, fontSize: '0.75rem',
                            }}>{u.role}</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#22C55E' }}>{u.totalPoints}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => { setEditUser(u.id); setNewRole(u.role); }}
                              style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#3b82f6' }}
                              title="Sửa role"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(u.id, u.username)}
                              style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#ef4444' }}
                              title="Xóa user"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#718096', fontWeight: 600 }}>Không có dữ liệu</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
