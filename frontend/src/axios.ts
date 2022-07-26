import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4444',
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const headers = config.headers;
    if (headers && token) {
        headers.Authorization = token;
    }
    return config;
});

export default instance;