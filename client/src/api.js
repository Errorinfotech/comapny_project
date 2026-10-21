import axios from 'axios';

export const BASE_URL = `http://${window.location.hostname}:5005`;
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    timeout: 600000, // 10 minutes timeout for large uploads
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
