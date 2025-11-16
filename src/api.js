import axios from 'axios';

// For Netlify deployment, we need to use the correct API URL
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'https://backendtodo-nk7m.onrender.com/api' 
});

export default API;