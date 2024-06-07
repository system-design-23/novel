import axios from 'axios';

const SERVER_URL = 'http://localhost:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  function (config) {
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
