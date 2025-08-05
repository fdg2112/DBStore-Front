// src/config/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://dbstore-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
