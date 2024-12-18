import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Commissions from './pages/Commissions';
import Portfolio from './pages/Portfolio';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChakraProvider>
      <Router>
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
            element={user ? <Commissions /> : <Navigate to="/" />} 
          />
          <Route 
            path="/commissions/:commissionId" 
            element={user ? <Commissions /> : <Navigate to="/" />} 
          />
          <Route 
            path="/portfolio" 
            element={user ? <Portfolio /> : <Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;