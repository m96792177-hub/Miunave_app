import React, { useState } from 'react';
import { apiFetch } from '../api';

const PlaylistManager = ({ userPlaylists, onCreatePlaylist, onDeletePlaylist, onAddToPlaylist, currentSong }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      setMessage('error|El nombre de la playlist es requerido');
      return;
    }

    setIsCreating(true);
    const result = await onCreatePlaylist(newPlaylistName.trim());
    
    if (result) {
      setMessage('success|Playlist creada exitosamente');
      setNewPlaylistName('');
    } else {
      setMessage('error|Error al crear la playlist');
    }
    
    setIsCreating(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (playlistId, playlistName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la playlist "${playlistName}"?`)) {
      const result = await onDeletePlaylist(playlistId);
      if (result) {
        setMessage('success|Playlist eliminada exitosamente');
      } else {
        setMessage('error|Error al eliminar la playlist');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddCurrent = async (playlistId) => {
    if (!currentSong) {
      setMessage('error|No hay una canción seleccionada');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const result = await onAddToPlaylist(playlistId, currentSong);
    if (result) {
      setMessage('success|Canción agregada a la playlist');
    } else {
      setMessage('error|Error al agregar la canción');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const togglePlaylistDetails = async (playlistId) => {
    if (expandedPlaylist === playlistId) {
      setExpandedPlaylist(null);
    } else {
      setExpandedPlaylist(playlistId);
      
      // Cargar canciones si no están en caché
      if (!playlistSongs[playlistId]) {
        try {
          const response = await apiFetch(`/api/playlists/${playlistId}/songs`);
          if (response.ok) {
            const data = await response.json();
            console.log('📊 Datos de playlist en manager:', data);
            const songs = data.songs || data || [];
            setPlaylistSongs(prev => ({ ...prev, [playlistId]: songs }));
          }
        } catch (error) {
          console.error('Error cargando canciones:', error);
        }
      }
    }
  };

  const messageType = message.split('|')[0];
  const messageText = message.split('|')[1];

  return (
    <div className="playlist-manager">
      <h3>🎵 Gestión de Playlists</h3>
      
      {currentSong && (
        <div className="current-song-info">
          <h4>Canción Actual:</h4>
          <p>{currentSong}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="playlist-form">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Nombre de la nueva playlist..."
          maxLength={50}
        />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creando...' : '➕ Crear Playlist'}
        </button>
      </form>

      {message && (
        <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
          {messageText}
        </div>
      )}

      <div className="user-playlists">
        {userPlaylists.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.7 }}>No tienes playlists creadas.</p>
        ) : (
          userPlaylists.map(playlist => (
            <div key={playlist.id} className="playlist-card">
              <h4>{playlist.name}</h4>
              <p>{playlist.song_count || 0} canción{(playlist.song_count || 0) !== 1 ? 'es' : ''}</p>
              
              <div className="playlist-actions">
                {currentSong && (
                  <button onClick={() => handleAddCurrent(playlist.id)}>
                    ➕ Agregar Actual
                  </button>
                )}
                <button onClick={() => togglePlaylistDetails(playlist.id)}>
                  {expandedPlaylist === playlist.id ? 'Ocultar' : 'Ver Canciones'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(playlist.id, playlist.name)}
                >
                  🗑️ Eliminar
                </button>
              </div>

              {expandedPlaylist === playlist.id && (
                <div className="playlist-songs">
                  <h5>Canciones en esta playlist:</h5>
                  {playlistSongs[playlist.id] ? (
                    playlistSongs[playlist.id].length > 0 ? (
                      <ul>
                        {playlistSongs[playlist.id].map(song => (
                          <li key={song.id}>{song.song_path}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Esta playlist está vacía.</p>
                    )
                  ) : (
                    <p>Cargando canciones...</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;