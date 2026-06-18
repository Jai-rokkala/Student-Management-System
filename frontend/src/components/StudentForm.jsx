import React, { useState } from 'react';

const COURSES = ['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Tech'];

const Field = ({ name, label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{label}</label>
    {children}
    {error && <span style={{ color: '#ef4444', fontSize: '12px' }}>⚠ {error}</span>}
  </div>
);

const inputStyle = (err) => ({
  padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
  border: `1.5px solid ${err ? '#ef4444' : '#d1d5db'}`,
  outline: 'none', width: '100%', boxSizing: 'border-box'
});

export default function StudentForm({ onSubmit, initial = {}, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    course: initial.course || '',
    year: initial.year || '',
    date_of_birth: initial.date_of_birth ? initial.date_of_birth.split('T')[0] : '',
    email: initial.email || '',
    mobile_number: initial.mobile_number || '',
    gender: initial.gender || '',
    address: initial.address || '',
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(initial.photo_url || null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.course) e.course = 'Course is required';
    if (!form.year || form.year < 1 || form.year > 6) e.year = 'Year must be 1–6';
    if (!form.date_of_birth) e.date_of_birth = 'DOB is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^\d{10}$/.test(form.mobile_number)) e.mobile_number = '10-digit mobile required';
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append('photo', photo);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {/* Photo Upload */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {preview && (
            <img src={preview} alt="preview" style={{
              width: '80px', height: '80px', borderRadius: '50%',
              objectFit: 'cover', border: '3px solid #4f46e5'
            }} />
          )}
          <Field name="photo" label="Student Photo" error={errors.photo}>
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </Field>
        </div>

        {/* Text Fields */}
        <Field name="name" label="Full Name" error={errors.name}>
          <input name="name" type="text" value={form.name}
            onChange={handleChange} style={inputStyle(errors.name)} />
        </Field>

        <Field name="email" label="Email" error={errors.email}>
          <input name="email" type="email" value={form.email}
            onChange={handleChange} style={inputStyle(errors.email)} />
        </Field>

        <Field name="mobile_number" label="Mobile Number" error={errors.mobile_number}>
          <input name="mobile_number" type="text" value={form.mobile_number}
            onChange={handleChange} style={inputStyle(errors.mobile_number)} />
        </Field>

        <Field name="date_of_birth" label="Date of Birth" error={errors.date_of_birth}>
          <input name="date_of_birth" type="date" value={form.date_of_birth}
            onChange={handleChange} style={inputStyle(errors.date_of_birth)} />
        </Field>

        <Field name="course" label="Course" error={errors.course}>
          <select name="course" value={form.course}
            onChange={handleChange} style={inputStyle(errors.course)}>
            <option value="">Select Course</option>
            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field name="year" label="Year (1–6)" error={errors.year}>
          <input name="year" type="number" min="1" max="6" value={form.year}
            onChange={handleChange} style={inputStyle(errors.year)} />
        </Field>

        <Field name="gender" label="Gender" error={errors.gender}>
          <select name="gender" value={form.gender}
            onChange={handleChange} style={inputStyle(errors.gender)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field name="address" label="Address" error={errors.address}>
          <textarea name="address" value={form.address} rows={3}
            onChange={handleChange}
            style={{ ...inputStyle(errors.address), resize: 'vertical' }} />
        </Field>

      </div>

      <button type="submit" disabled={loading} style={{
        marginTop: '24px', padding: '12px 32px',
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
        opacity: loading ? 0.7 : 1
      }}>
        {loading ? '⏳ Saving...' : '💾 Save Student'}
      </button>
    </form>
  );
}