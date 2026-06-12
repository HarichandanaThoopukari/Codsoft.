import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('quizmaker_user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {}
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Quizzes
export const getQuizzes = (params) => API.get('/quizzes', { params });
export const getQuizById = (id) => API.get(`/quizzes/${id}`);
export const createQuiz = (data) => API.post('/quizzes', data);
export const updateQuiz = (id, data) => API.put(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

// Results
export const submitResult = (data) => API.post('/results', data);
export const getResultsByUser = (userId) => API.get(`/results/user/${userId}`);
export const getResultById = (id) => API.get(`/results/${id}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminQuizzes = () => API.get('/admin/quizzes');
export const deleteUserAdmin = (id) => API.delete(`/admin/users/${id}`);
export const deleteQuizAdmin = (id) => API.delete(`/admin/quizzes/${id}`);

export default API;
