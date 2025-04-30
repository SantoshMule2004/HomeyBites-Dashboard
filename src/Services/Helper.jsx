import axios from "axios";
import { getAuthToken } from '../Auth/Index';
export const BASE_URL = 'https://homeybites.onrender.com'; 
 
export const myAxios = axios.create({
    baseURL: BASE_URL,
})

const excludedEndpoints = [
  "/api/v1/auth"
];

myAxios.interceptors.request.use((config)=>{
  const token = getAuthToken();

  const isExcluded = excludedEndpoints.some(endpoint => config.url.includes(endpoint));

  if(token && (!isExcluded || (config.method !== "get"))) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error)=>{
  return Promise.reject(error);
});

// const API_BASE_URL = "https://homeybites.onrender.com ";
// const API_BASE_URL_RAILWAY = "https://homeybites-production.up.railway.app ";
// Local URL = http://localhost:8080