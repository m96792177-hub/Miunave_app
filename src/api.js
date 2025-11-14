const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const API_URL = (
  import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim()
) || (isLocalhost ? 'http://localhost:4000' : 'https://miunave-backend.onrender.com');

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  return resp;
}
