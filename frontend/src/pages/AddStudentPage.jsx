import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import StudentForm from '../components/StudentForm';
import { createStudent } from '../api/studentApi';

export default function AddStudentPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createStudent(formData);
      toast.success('🎉 Student added successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const card = {
    background: '#fff', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  };

  return (
    <div>
      <h2 style={{ margin: '24px 0 20px', fontSize: '22px', fontWeight: '700' }}>
        ➕ Add New Student
      </h2>
      <div style={card}>
        <StudentForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}