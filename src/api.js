const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : '';
const envUrl = (import.meta?.env?.VITE_API_URL || '').trim();
const defaultUrl = hostname === 'localhost' || hostname === '127.0.0.1'
  ? 'http://localhost:4000'
  : 'https://miunave-backend.onrender.com';

export const API_URL = envUrl || defaultUrl;

if (isBrowser) {
  window.API_URL_DEBUG = API_URL;
  console.log('[api] URL activa:', API_URL);
}

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  return resp;
}
