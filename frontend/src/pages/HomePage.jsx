import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStudents, deleteStudent } from '../api/studentApi';

export default function HomePage() {
  const [students, setStudents]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [course, setCourse]       = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();
  const LIMIT = 8;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getStudents({ search, course, page, limit: LIMIT });
      setStudents(data.students);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, course, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await deleteStudent(id);
      toast.success('🗑️ Student deleted');
      fetchStudents();
    } catch {
      toast.error('Delete failed');
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const s = {
    topBar: { display: 'flex', gap: '12px', margin: '24px 0', flexWrap: 'wrap', alignItems: 'center' },
    input: {
      padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #d1d5db',
      fontSize: '14px', outline: 'none', flex: 1, minWidth: '180px'
    },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff',
      borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
    th: { background: '#4f46e5', color: '#fff', padding: '14px 16px',
      textAlign: 'left', fontSize: '13px', fontWeight: '600' },
    td: { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' },
    avatarPlaceholder: {
      width: '38px', height: '38px', borderRadius: '50%',
      background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: '700', fontSize: '14px'
    },
    badge: (g) => ({
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      background: g === 'Male' ? '#dbeafe' : g === 'Female' ? '#fce7f3' : '#f3f4f6',
      color: g === 'Male' ? '#1d4ed8' : g === 'Female' ? '#be185d' : '#374151',
    }),
    editBtn: {
      padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
      background: '#dbeafe', color: '#1d4ed8', fontWeight: '600', fontSize: '12px', marginRight: '6px'
    },
    delBtn: {
      padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
      background: '#fee2e2', color: '#dc2626', fontWeight: '600', fontSize: '12px'
    },
    pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' },
    pageBtn: (active) => ({
      padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
      background: active ? '#4f46e5' : '#fff', color: active ? '#fff' : '#374151',
      fontWeight: '600', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }),
    statsBar: {
      display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap'
    },
    statCard: (color) => ({
      background: '#fff', borderRadius: '12px', padding: '16px 24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.07)', borderLeft: `4px solid ${color}`,
      flex: 1, minWidth: '140px'
    })
  };

  return (
    <div>
      {/* Stats */}
      <div style={s.statsBar}>
        <div style={s.statCard('#4f46e5')}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#4f46e5' }}>{total}</div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Students</div>
        </div>
        <div style={s.statCard('#10b981')}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{students.filter(s => s.gender === 'Male').length}</div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Male</div>
        </div>
        <div style={s.statCard('#ec4899')}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#ec4899' }}>{students.filter(s => s.gender === 'Female').length}</div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Female</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={s.topBar}>
        <input
          style={s.input} placeholder="🔍 Search by name, email, admission no..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select style={{ ...s.input, flex: 'none', width: '160px' }}
          value={course} onChange={e => { setCourse(e.target.value); setPage(1); }}>
          <option value="">All Courses</option>
          {['B.Tech','BCA','MCA','MBA','B.Sc','M.Sc','B.Com','M.Tech'].map(c =>
            <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</p>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>
          <div style={{ fontSize: '48px' }}>🎓</div>
          <p style={{ color: '#6b7280', marginTop: '12px' }}>No students found. Add one!</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              {['Photo','Adm. No','Name','Course','Year','Email','Mobile','Gender','Actions'].map(h =>
                <th key={h} style={s.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {students.map((st, i) => (
              <tr key={st.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={s.td}>
                  {st.photo_url
                    ? <img src={`http://localhost:5000${st.photo_url}`} alt="" style={s.avatar} />
                    : <div style={s.avatarPlaceholder}>{st.name[0]}</div>}
                </td>
                <td style={s.td}><code style={{ color: '#4f46e5', fontSize: '12px' }}>{st.admission_number}</code></td>
                <td style={{ ...s.td, fontWeight: '600' }}>{st.name}</td>
                <td style={s.td}>{st.course}</td>
                <td style={s.td}>Year {st.year}</td>
                <td style={s.td}>{st.email}</td>
                <td style={s.td}>{st.mobile_number}</td>
                <td style={s.td}><span style={s.badge(st.gender)}>{st.gender}</span></td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => navigate(`/edit/${st.id}`)}>✏️ Edit</button>
                  <button style={s.delBtn}  onClick={() => handleDelete(st.id, st.name)}>🗑️ Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn(false)} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i+1} style={s.pageBtn(page === i+1)} onClick={() => setPage(i+1)}>{i+1}</button>
          ))}
          <button style={s.pageBtn(false)} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}