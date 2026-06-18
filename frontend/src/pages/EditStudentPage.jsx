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

  return (
    <div style={{ padding: '16px' }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Students', value: total, color: '#4f46e5' },
          { label: 'Male', value: students.filter(s => s.gender === 'Male').length, color: '#10b981' },
          { label: 'Female', value: students.filter(s => s.gender === 'Female').length, color: '#ec4899' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: '12px', padding: '14px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)', borderLeft: `4px solid ${stat.color}`,
            flex: '1', minWidth: '100px'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #d1d5db',
            fontSize: '14px', outline: 'none', flex: '1', minWidth: '200px'
          }}
          placeholder="🔍 Search by name, email, admission no..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #d1d5db',
            fontSize: '14px', outline: 'none', minWidth: '140px'
          }}
          value={course}
          onChange={e => { setCourse(e.target.value); setPage(1); }}
        >
          <option value="">All Courses</option>
          {['B.Tech','BCA','MCA','MBA','B.Sc','M.Sc','B.Com','M.Tech'].map(c =>
            <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</p>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>
          <div style={{ fontSize: '48px' }}>🎓</div>
          <p style={{ color: '#6b7280', marginTop: '12px' }}>No students found. Add one!</p>
        </div>
      ) : (
        <>
          {/* Cards for mobile, Table for desktop */}
          <div className="desktop-table">
            <table style={{
              width: '100%', borderCollapse: 'collapse', background: '#fff',
              borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)'
            }}>
              <thead>
                <tr>
                  {['Photo','Adm. No','Name','Course','Year','Email','Mobile','Gender','Actions'].map(h => (
                    <th key={h} style={{
                      background: '#4f46e5', color: '#fff', padding: '14px 16px',
                      textAlign: 'left', fontSize: '13px', fontWeight: '600'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((st, i) => (
                  <tr key={st.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px' }}>
                      {st.photo_url
                        ? <img src={`https://student-management-system-production-5527.up.railway.app${st.photo_url}`}
                            alt="" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                        : null}
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                        display: st.photo_url ? 'none' : 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '700', fontSize: '14px'
                      }}>{st.name[0]}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><code style={{ color: '#4f46e5', fontSize: '12px' }}>{st.admission_number}</code></td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{st.name}</td>
                    <td style={{ padding: '12px 16px' }}>{st.course}</td>
                    <td style={{ padding: '12px 16px' }}>Year {st.year}</td>
                    <td style={{ padding: '12px 16px' }}>{st.email}</td>
                    <td style={{ padding: '12px 16px' }}>{st.mobile_number}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        background: st.gender === 'Male' ? '#dbeafe' : st.gender === 'Female' ? '#fce7f3' : '#f3f4f6',
                        color: st.gender === 'Male' ? '#1d4ed8' : st.gender === 'Female' ? '#be185d' : '#374151',
                      }}>{st.gender}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => navigate(`/edit/${st.id}`)} style={{
                        padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        background: '#dbeafe', color: '#1d4ed8', fontWeight: '600', fontSize: '12px', marginRight: '6px'
                      }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(st.id, st.name)} style={{
                        padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        background: '#fee2e2', color: '#dc2626', fontWeight: '600', fontSize: '12px'
                      }}>🗑️ Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {students.map(st => (
              <div key={st.id} style={{
                background: '#fff', borderRadius: '12px', padding: '16px',
                marginBottom: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '18px', flexShrink: 0
                  }}>{st.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>{st.name}</div>
                    <code style={{ color: '#4f46e5', fontSize: '11px' }}>{st.admission_number}</code>
                  </div>
                  <span style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '600',
                    background: st.gender === 'Male' ? '#dbeafe' : st.gender === 'Female' ? '#fce7f3' : '#f3f4f6',
                    color: st.gender === 'Male' ? '#1d4ed8' : st.gender === 'Female' ? '#be185d' : '#374151',
                  }}>{st.gender}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { label: 'Course', value: st.course },
                    { label: 'Year', value: `Year ${st.year}` },
                    { label: 'Mobile', value: st.mobile_number },
                    { label: 'Email', value: st.email },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', color: '#1a202c', wordBreak: 'break-all' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => navigate(`/edit/${st.id}`)} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: '#dbeafe', color: '#1d4ed8', fontWeight: '600', fontSize: '13px'
                  }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(st.id, st.name)} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: '#fee2e2', color: '#dc2626', fontWeight: '600', fontSize: '13px'
                  }}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={{
            padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: '#fff', fontWeight: '600', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i+1} onClick={() => setPage(i+1)} style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: page === i+1 ? '#4f46e5' : '#fff',
              color: page === i+1 ? '#fff' : '#374151',
              fontWeight: '600', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}>{i+1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} style={{
            padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: '#fff', fontWeight: '600', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}>Next →</button>
        </div>
      )}
    </div>
  );
}