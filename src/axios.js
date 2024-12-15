import axios from 'axios';


// Конект до сервера, используем токен авторизации
const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;