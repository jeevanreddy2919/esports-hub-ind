import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Community from './pages/Community';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader"/></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ParticleBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
        <ChatBot />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(8,8,28,0.95)',
              color: '#fff',
              border: '1px solid rgba(0,243,255,0.2)',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              backdropFilter: 'blur(20px)',
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
            error: { iconTheme: { primary: '#ff2d78', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
