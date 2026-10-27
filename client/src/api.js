import axios from 'axios';

export const BASE_URL = `http://${window.location.hostname}:5005`;
export const API_URL = `${BASE_URL}/api`;

export const getStorageUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }
    if (pathOrUrl.startsWith('/api/storage/')) {
        return `${BASE_URL}${pathOrUrl}`;
    }
    if (pathOrUrl.startsWith('Thumbnails/') || pathOrUrl.startsWith('projects/')) {
        return `${BASE_URL}/api/storage/${pathOrUrl}`;
    }
    return `${BASE_URL}/uploads/${encodeURIComponent(pathOrUrl)}`;
};

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
