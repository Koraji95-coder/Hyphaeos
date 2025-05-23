import axios from "axios";

export async function login(email: string, password: string, pin?: string) {
  const res = await axios.post("/api/auth/login", { email, password, code: pin }, { withCredentials: true });
  return res.data;
}

export async function refreshToken() {
  const res = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
  return res.data.access_token;
}

export async function getProfile(token: string) {
  const res = await axios.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function logout() {
  await axios.post("/api/auth/logout", {}, { withCredentials: true });
}
