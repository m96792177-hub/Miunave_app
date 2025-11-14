import { useState } from 'react';
import { apiFetch } from '../api';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isLogin ? '¡Inicio de sesión exitoso!' : '¡Registro exitoso!');
        setTimeout(() => {
          onLogin(data.user);
        }, 800);
      } else {
        setError(data.message || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setFormData({ email: '', password: '', nombre: '' });
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="input-busqueda"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-busqueda"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="input-busqueda"
          required
        />
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <button type="submit" className="btn-buscar" disabled={loading}>
          {loading ? (isLogin ? 'Ingresando...' : 'Registrando...') : (isLogin ? 'Ingresar' : 'Registrarse')}
        </button>
      </form>
      <button 
        onClick={toggleMode}
        className="extra-btn"
        disabled={loading}
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}