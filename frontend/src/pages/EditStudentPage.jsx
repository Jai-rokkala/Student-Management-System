import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import StudentForm from '../components/StudentForm';
import { getStudentById, updateStudent } from '../api/studentApi';

export default function EditStudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStudentById(id)
      .then(r => setStudent(r.data))
      .catch(() => toast.error('Student not found'));
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await updateStudent(id, formData);
      toast.success('✅ Student updated!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const card = {
    background: '#fff', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  };

  if (!student) return <p style={{ padding: '40px', textAlign: 'center' }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ margin: '24px 0 20px', fontSize: '22px', fontWeight: '700' }}>
        ✏️ Edit Student
      </h2>
      <div style={card}>
        <StudentForm onSubmit={handleSubmit} initial={student} loading={loading} />
      </div>
    </div>
  );
}