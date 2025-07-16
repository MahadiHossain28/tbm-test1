import axios from 'axios';

let csrfLoaded = false;

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Laravel backend
    withCredentials: true,           // Required for cookies
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

const loadCsrfToken = async () => {
    if (!csrfLoaded) {
        await axiosInstance.get('/sanctum/csrf-cookie');
        csrfLoaded = true;
    }
};

axiosInstance.interceptors.request.use(
    async (config) => {
        // @ts-ignore
        const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(config.method);
        if (needsCsrf) {
            await loadCsrfToken();
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;