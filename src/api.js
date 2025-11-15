const API_URL_FORCED = 'http://localhost:4000';
export const API_URL = API_URL_FORCED;

const TIMESTAMP = new Date().getTime();
console.log('Archivo api.js cargado - timestamp:', TIMESTAMP);
console.log('API_URL configurada:', API_URL_FORCED);
console.log('Usando backend local forzado');
console.log('Si ves este mensaje, el cache está limpio');

window.API_URL_DEBUG = API_URL_FORCED;

export async function apiFetch(path, options = {}) {
  const url = `${API_URL_FORCED}${path}`;
  console.log('Realizando fetch a:', url);
  console.log('Método de fetch:', options.method || 'GET');
  console.log('Timestamp fetch:', new Date().getTime());
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  return resp;
}
