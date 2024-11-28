import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 URL 설정
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;