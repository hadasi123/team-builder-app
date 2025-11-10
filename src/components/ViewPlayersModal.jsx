import './ViewPlayersModal.css';

function ViewPlayersModal({ players, onClose }) {
  return (
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
                <div key={player.id} className="player-card">
                  <h3 className="player-name">{player.playerName}</h3>
                  <div className="player-stats">
                    <div className="stat">
                      <span className="stat-label">הגנה</span>
                      <span className="stat-value">{player.defenseScore}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">התקפה</span>
                      <span className="stat-value">{player.offenseScore}</span>
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
  );
}

export default ViewPlayersModal;
