import axios from "axios";

// ---------------------------------------------
// ✅ ALWAYS use CloudFront domain (HTTPS)
// ---------------------------------------------
// const API_BASE = "https://health.health.cloud-ip.cc";



const userBaseURL = 'http://localhost:3001/api/v1/users';
const appointmentBaseURL = 'http://localhost:3002/api/v1/appointments';

console.log("🔍 userBaseURL:", userBaseURL);
console.log("🔍 appointmentBaseURL:", appointmentBaseURL);

// Common headers
const defaultHeaders = { "Content-Type": "application/json" };

// -------------------- USER API --------------------
export const userApi = axios.create({
    baseURL: userBaseURL,
    headers: defaultHeaders,
});

// -------------------- APPOINTMENT API --------------------
export const appointmentApi = axios.create({
    baseURL: appointmentBaseURL,
    headers: defaultHeaders,
});

// -------------------- AUTH TOKEN ATTACH --------------------
const attachAuth = (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

userApi.interceptors.request.use(attachAuth);
appointmentApi.interceptors.request.use(attachAuth);

// -------------------- ERROR HANDLER --------------------
const handleError = (error: any) => {
    if (error.response?.status === 401) {
        console.warn("Unauthorized — token may be expired or invalid");
    }
    return Promise.reject(error);
};

userApi.interceptors.response.use((r) => r, handleError);
appointmentApi.interceptors.response.use((r) => r, handleError);

