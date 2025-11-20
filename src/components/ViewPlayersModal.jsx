import { useState } from 'react';
import './ViewPlayersModal.css';
import AddPlayerModal from './AddPlayerModal';

function ViewPlayersModal({ players, onClose, onEditPlayer, onDeletePlayer }) {
  const [editingPlayer, setEditingPlayer] = useState(null);

  const handlePlayerClick = (player) => {
    setEditingPlayer(player);
  };

  const handleSaveEdit = (updatedPlayer) => {
    onEditPlayer(updatedPlayer);
    setEditingPlayer(null);
  };

  const handleDelete = (playerId, playerName, e) => {
    e.stopPropagation(); // Prevent triggering edit
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את ${playerName}?`)) {
      onDeletePlayer(playerId);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content view-players-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">השחקנים שלי</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        
        <div className="players-content">
          {players.length === 0 ? (
            <div className="empty-state">
              <p>עדיין לא נוספו שחקנים.</p>
              <p className="empty-subtitle">לחץ על "הוסף שחקן" כדי להתחיל!</p>
            </div>
          ) : (
            <div className="players-list">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className="player-card"
                  onClick={() => handlePlayerClick(player)}
                >
                  <button 
                    className="delete-player-btn"
                    onClick={(e) => handleDelete(player.id, player.playerName, e)}
                    title="מחק שחקן"
                  >
                    ×
                  </button>
                  <h3 className="player-name">{player.playerName}</h3>
                  <div className="player-stats">
                    <div className="stat">
                      <span className="player-info">הגנה</span>
                      <span className="player-info">{player.defenseScore}</span>
                    </div>
                    <div className="stat">
                      <span className="player-info">התקפה</span>
                      <span className="player-info">{player.offenseScore}</span>
                    </div>
                  </div>
                  <div className="player-total">
                    <span className="total-label">סה״כ ציון</span>
                    <span className="total-value">
                      {Number(player.defenseScore) + Number(player.offenseScore)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {editingPlayer && (
        <AddPlayerModal
          editPlayer={editingPlayer}
          onSave={handleSaveEdit}
          onClose={() => setEditingPlayer(null)}
        />
      )}
    </>
  );
}

export default ViewPlayersModal;
