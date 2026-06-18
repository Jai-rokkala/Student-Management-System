import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://student-management-system-production-5527.up.railway.app' 
});

export const getStudents = (params) => API.get('/students', { params });
export const getStudentById = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
