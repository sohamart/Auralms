import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred while communicating with the server.',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      raw: error,
    };
    return Promise.reject(customError);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const coursesApi = {
  getPublic: (params) => api.get('/courses', { params }),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  getStudentDashboard: () => api.get('/courses/student/dashboard'),
  
  // Admin course actions
  adminGetAll: () => api.get('/courses/admin/all'),
  adminCreate: (data) => api.post('/courses', data),
  adminUpdate: (id, data) => api.put(`/courses/${id}`, data),
  adminTogglePublish: (id) => api.patch(`/courses/${id}/publish`),
  adminDelete: (id) => api.delete(`/courses/${id}`),
  adminGetCourseStudents: (courseId) => api.get(`/courses/admin/${courseId}/students`),

  // Topic actions
  getTopicsByCourse: (courseId) => api.get(`/courses/${courseId}/topics`),
  createTopic: (courseId, data) => api.post(`/courses/${courseId}/topics`, data),
  updateTopic: (id, data) => api.put(`/topics/${id}`, data),
  deleteTopic: (id) => api.delete(`/topics/${id}`),

  // Lesson actions
  createLesson: (courseId, topicId, data) => api.post(`/courses/${courseId}/topics/${topicId}/lessons`, data),
  updateLesson: (id, data) => api.put(`/lessons/${id}`, data),
  deleteLesson: (id) => api.delete(`/lessons/${id}`),

  // Student protected learning actions
  getCurriculumFull: (courseSlug) => api.get(`/courses/${courseSlug}/curriculum`),
  getStudentLesson: (courseSlug, lessonId) => api.get(`/courses/${courseSlug}/lessons/${lessonId}`),
  toggleProgress: (courseSlug, lessonId, completed) => api.post(`/courses/${courseSlug}/lessons/${lessonId}/progress`, { completed }),
  updatePlaybackPosition: (courseSlug, lessonId, seconds) => api.patch(`/courses/${courseSlug}/lessons/${lessonId}/position`, { seconds }),
  getCourseProgress: (courseSlug) => api.get(`/courses/${courseSlug}/progress`),
};

export const adminApi = {
  getStudents: (params) => api.get('/admin/students', { params }),
  getStudentDetail: (id) => api.get(`/admin/students/${id}`),
  grantAccess: (data) => api.post('/admin/access/grant', data),
  revokeAccess: (data) => api.post('/admin/access/revoke', data),
  validateVideo: (data) => api.post('/admin/validate-video', data),
};

export default api;
