import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './MainApp.css';
import AddPlayerModal from '../components/AddPlayerModal';
import illustrationVideo from '../assets/illustration.mp4';

function MainApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const { user, logout } = useAuth();

  const handleAddPlayer = () => {
    setIsModalOpen(true);
  };

  const handleCreateTeams = () => {
    // Placeholder for create teams functionality
    console.log('Create Teams clicked!');
  };

  const handleViewPlayers = () => {
    // Placeholder for view players functionality
    console.log('View Players clicked!', players);
  };

  const handleSavePlayer = async (player) => {
    try {
      // Save to Firestore
      const playerData = {
        ...player,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, 'players'), playerData);
      
      // Update local state
      setPlayers([...players, playerData]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Failed to save player. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
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
        <div className="user-info">
          <span className="user-name">{user?.displayName || user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
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

export default MainApp;
