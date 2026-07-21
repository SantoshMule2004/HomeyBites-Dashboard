import axios from "axios";
import { getAuthToken } from '../Auth/Index';
export const BASE_URL = 'http://localhost:8080';

export const PublicApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const PrivateApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

PublicApiClient.interceptors.request.use(async (config) => {
  console.log("Base URL - ", config.baseURL)
  console.log("URL - ", config.url)
  return config
}, (error) => {
  console.log("interceptors.request", error)
  return Promise.reject(error)
})


PrivateApiClient.interceptors.request.use(async (config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  console.log("interceptors.request", error)
  return Promise.reject(error)
})

PrivateApiClient.interceptors.response.use((response) => {
  console.log("interceptors.response", response.status)

  return response
}, (error) => {
  console.log("interceptors.response", error)

  if (error.response?.status === 401 && window.location.pathname !== "/login") {
    // localStorage.removeItem("authToken");

    localStorage.clear();

    // window.location.replace = "/login";
    window.location.replace("/auth/login");
  }

  return Promise.reject(error)
})

// const API_BASE_URL = "https://homeybites.onrender.com ";
// const API_BASE_URL_RAILWAY = "https://homeybites-production.up.railway.app ";
// Local URL = http://localhost:8080