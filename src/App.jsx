import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainApp from './pages/MainApp';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return user ? <MainApp /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
