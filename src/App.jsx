import { useState } from 'react';
import './App.css';
import AddPlayerModal from './components/AddPlayerModal';
import illustrationVideo from './assets/illustration.mp4';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);

  const handleAddPlayer = () => {
    setIsModalOpen(true);
  };

  const handleCreateTeams = () => {
    // Placeholder for create teams functionality
    console.log('Create Teams clicked');
  };

  const handleViewPlayers = () => {
    // Placeholder for view players functionality
    console.log('View Players clicked', players);
  };

  const handleSavePlayer = (player) => {
    setPlayers([...players, player]);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <video 
        className="background-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={illustrationVideo} type="video/mp4" />
      </video>
      
      <header className="app-header">
        <h1 className="app-title">Team Builder</h1>
      </header>
      
      <main className="app-main">
        <div className="button-container">
          <button 
            className="btn btn-primary" 
            onClick={handleAddPlayer}
          >
            Add Player
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleCreateTeams}
          >
            Create Teams
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleViewPlayers}
          >
            View Players
          </button>
        </div>
      </main>

      {isModalOpen && (
        <AddPlayerModal 
          onSave={handleSavePlayer}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
