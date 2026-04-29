import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("Missing VITE_API_URL environment variable.");
}

let clerkTokenGetter = null;

export const setClerkTokenGetter = (getter) => {
  clerkTokenGetter = getter;
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (!clerkTokenGetter) {
    return config;
  }

  const token = await clerkTokenGetter();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});
