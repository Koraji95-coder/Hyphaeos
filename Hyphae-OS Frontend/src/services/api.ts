import axios, { AxiosError } from "axios";
import { ERROR_MESSAGES } from '@/config/constants';

const BASE = "/api/auth";

// Include credentials like cookies
const config = {
  withCredentials: true,
};

// ========== AUTH API ==========

export async function autoLogin() {
  const res = await axios.get(`${BASE}/auto_login`, config);
  return res.data;
}

export async function getProfile(token: string) {
  const res = await axios.get(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    ...config,
  });
  return res.data;
}

export async function refreshToken() {
  const res = await axios.post(`${BASE}/refresh`, {}, config);
  return res.data.access_token;
}

// ========== SYSTEM PANEL API ==========

export async function getMycoCoreSnapshot() {
  const res = await axios.get("/api/system/mycocore", config);
  return res.data;
}

export async function fetchNeuroweaveData() {
  const res = await axios.get("/api/neuroweave", config);
  return res.data;
}

export async function fetchRootBloomData(type: string, token: string) {
  const res = await axios.get(`/api/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
    ...config,
  });
  return res.data;
}

// ========== ERROR HANDLING ==========

export function handleApiError(error: unknown) {
  const axiosError = error as AxiosError<{ error: string }>;
  return axiosError.response?.data?.error || axiosError.message || ERROR_MESSAGES.NETWORK_ERROR;
}