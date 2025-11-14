// Helper para centralizar la URL del backend y fetch con credenciales
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const API_URL = (
  import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim()
) || (isLocalhost ? 'http://localhost:4000' : '');

export async function apiFetch(path, options = {}) {
  const base = API_URL || '';
  const url = base ? `${base}${path}` : path; // si no hay base (prod sin env), usa relativa
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  return resp;
}
