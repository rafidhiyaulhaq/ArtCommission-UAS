import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <ChakraProvider>
      <BrowserRouter basename="/ArtCommission-UAS">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/commissions" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/" />} 
          />
          <Route 
            path="/portfolio" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/" />} 
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;