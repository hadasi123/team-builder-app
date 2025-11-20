import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './MainApp.css';
import AddPlayerModal from '../components/AddPlayerModal';
import ViewPlayersModal from '../components/ViewPlayersModal';
import GenerateTeamModal from '../components/GenerateTeamModal';
import illustrationVideo from '../assets/illustration.mp4';

function MainApp() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isGenerateTeamModalOpen, setIsGenerateTeamModalOpen] = useState(false);

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  // Fetch players from Firestore on mount and listen for changes
  useEffect(() => {
    if (!user) return;

    // Query only players created by the current user
    const q = query(
      collection(db, 'players'),
      where('userId', '==', user.uid)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const playersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // Sort by createdAt in JavaScript instead
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setPlayers(playersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  const handleAddPlayer = () => {
    setIsAddModalOpen(true);
  };

  const handleCreateTeams = () => {
    // Placeholder for create teams functionality
    console.log('Create Teams clicked!');
    setIsGenerateTeamModalOpen(true);
  };

  const handleViewPlayers = () => {
    setIsViewModalOpen(true);
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
      
      setIsAddModalOpen(false);
      // No need to update local state - real-time listener will handle it
    } catch (error) {
      console.error('Error saving player:', error);
      alert('שמירת השחקן נכשלה. אנא נסה שוב.');
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleEditPlayer = async (updatedPlayer) => {
    try {
      const playerId = String(updatedPlayer.id); // Ensure ID is a string
      if (!playerId || playerId === 'undefined' || playerId === 'null') {
        console.error('Invalid player ID:', updatedPlayer.id);
        alert('שגיאה: מזהה שחקן לא תקין');
        return;
      }
      
      const playerRef = doc(db, 'players', playerId);
      // eslint-disable-next-line no-unused-vars
      const { id, ...playerData } = updatedPlayer; // Remove id from update data
      await updateDoc(playerRef, playerData);
      // Real-time listener will handle the update
    } catch (error) {
      console.error('Error updating player:', error);
      alert('עדכון השחקן נכשל. אנא נסה שוב.');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      console.log('Delete player ID:', playerId, 'Type:', typeof playerId);
      
      if (!playerId) {
        console.error('Player ID is missing');
        alert('שגיאה: מזהה שחקן חסר');
        return;
      }
      
      const playerIdString = String(playerId);
      console.log('Converted ID:', playerIdString);
      
      await deleteDoc(doc(db, 'players', playerIdString));
      // Real-time listener will handle the removal
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('מחיקת השחקן נכשלה. אנא נסה שוב.');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
      await logout();
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <p>טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <video 
        className="background-video" 
        autoPlay={false}
        muted 
        playsInline
      >
        <source src={illustrationVideo} type="video/mp4" />
      </video>
      
      <header className="app-header">
        <div className="user-info" style={{flexDirection:"column"}}>
          <span className="user-name">{user?.displayName || user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            התנתק
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="button-container">
          <button 
            className="btn btn-primary" 
            onClick={handleAddPlayer}
          >
            הוסף שחקן
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleCreateTeams}
          >
            הרכב קבוצות
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleViewPlayers}
          >
            צפה בכל השחקנים ({players.length})
          </button>
        </div>
      </main>

      {isAddModalOpen && (
        <AddPlayerModal 
          onSave={handleSavePlayer}
          onClose={handleCloseAddModal}
        />
      )}

      {isViewModalOpen && (
        <ViewPlayersModal
          players={players}
          onClose={handleCloseViewModal}
          onEditPlayer={handleEditPlayer}
          onDeletePlayer={handleDeletePlayer}
        />
      )}
      {
        isGenerateTeamModalOpen && (
        <GenerateTeamModal
          onClose={() => setIsGenerateTeamModalOpen(false)}
          players={players}
        />
      )
      }
    </div>
  );
}

export default MainApp;
