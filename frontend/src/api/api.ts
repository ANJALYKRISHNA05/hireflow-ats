import axios from 'axios';
import { store } from '../store';
import { logout, loginSuccess } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';

   
    if (
      status === 401 &&
      !url.includes('/auth/') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().auth.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;
        const currentUser = store.getState().auth.user;

        if (currentUser) {
          store.dispatch(
            loginSuccess({
              accessToken,
              refreshToken: newRefreshToken,
              user: currentUser,
            })
          );
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;