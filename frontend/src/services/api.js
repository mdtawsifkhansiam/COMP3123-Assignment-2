import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
};

export const employeeAPI = {
    getAll: () => api.get('/employees'),
    getById: (id) => api.get(`/employees/${id}`),
    create: (employeeData) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });
        return api.post('/employees', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: (id, employeeData) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });
        return api.put(`/employees/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    delete: (id) => api.delete(`/employees/${id}`),
    search: (query) => api.get(`/employees/search/${query}`),
};

export default api;