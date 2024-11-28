import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // API의 기본 URL 설정
    headers: {
        'Content-Type': 'application/json', // 요청의 Content-Type 설정
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default api;