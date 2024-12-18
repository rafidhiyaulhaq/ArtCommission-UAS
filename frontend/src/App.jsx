import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Commissions from './pages/Commissions';
import Portfolio from './pages/Portfolio';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <ChakraProvider>
      <Router basename="/ArtCommission-UAS">
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
          <Route 
            path="*" 
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;