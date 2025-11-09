import { useState } from 'react';
import './AddPlayerModal.css';

function AddPlayerModal({ onSave, onClose }) {
  const [playerName, setPlayerName] = useState('');
  const [defenseScore, setDefenseScore] = useState('');
  const [offenseScore, setOffenseScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!playerName.trim()) {
      alert('Please enter a player name');
      return;
    }
    
    if (!defenseScore || !offenseScore) {
      alert('Please enter both defense and offense scores');
      return;
    }

    const player = {
      playerName: playerName.trim(),
      defenseScore: Number(defenseScore),
      offenseScore: Number(offenseScore),
      id: Date.now() // Simple unique ID
    };

    onSave(player);
    
    // Reset form
    setPlayerName('');
    setDefenseScore('');
    setOffenseScore('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Player</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="player-form">
          <div className="form-group">
            <label htmlFor="playerName">Player Name</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="defenseScore">Defense Score</label>
            <input
              type="number"
              id="defenseScore"
              value={defenseScore}
              onChange={(e) => setDefenseScore(e.target.value)}
              placeholder="Enter defense score"
              className="form-input"
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="offenseScore">Offense Score</label>
            <input
              type="number"
              id="offenseScore"
              value={offenseScore}
              onChange={(e) => setOffenseScore(e.target.value)}
              placeholder="Enter offense score"
              className="form-input"
              min="0"
              step="1"
            />
          </div>

          <button type="submit" className="btn btn-save">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPlayerModal;
