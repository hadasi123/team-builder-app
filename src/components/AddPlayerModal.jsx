import { useState, useEffect } from 'react';
import './AddPlayerModal.css';

function AddPlayerModal({ onSave, onClose, editPlayer = null }) {
  const [playerName, setPlayerName] = useState('');
  const [defenseScore, setDefenseScore] = useState('');
  const [offenseScore, setOffenseScore] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (editPlayer) {
      setPlayerName(editPlayer.playerName);
      setDefenseScore(editPlayer.defenseScore.toString());
      setOffenseScore(editPlayer.offenseScore.toString());
    }
  }, [editPlayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!playerName.trim()) {
      alert('אנא הזן שם שחקן');
      return;
    }
    
    if (!defenseScore || !offenseScore) {
      alert('אנא הזן ציונים הן להגנה והן להתקפה');
      return;
    }

    const player = {
      playerName: playerName.trim(),
      defenseScore: Number(defenseScore),
      offenseScore: Number(offenseScore),
    };

    // If editing, include the player ID
    if (editPlayer) {
      player.id = editPlayer.id;
    }

    onSave(player);
    
    // Reset form only if not editing
    if (!editPlayer) {
      setPlayerName('');
      setDefenseScore('');
      setOffenseScore('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editPlayer ? 'ערוך שחקן' : 'הוסף שחקן'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="player-form">
          <div className="form-group">
            <label htmlFor="playerName">שם שחקן</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="הזן שם שחקן"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="defenseScore">ציון הגנה</label>
            <input
              type="number"
              id="defenseScore"
              value={defenseScore}
              onChange={(e) => setDefenseScore(e.target.value)}
              placeholder="הזן ציון הגנה"
              className="form-input"
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="offenseScore">ציון התקפה</label>
            <input
              type="number"
              id="offenseScore"
              value={offenseScore}
              onChange={(e) => setOffenseScore(e.target.value)}
              placeholder="הזן ציון התקפה"
              className="form-input"
              min="0"
              step="1"
            />
          </div>

          <button type="submit" className="btn btn-save">
            שמור
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPlayerModal;
