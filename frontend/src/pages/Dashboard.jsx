import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch" maxW="800px" mx="auto">
        <Text fontSize="2xl">Welcome to ArtCommission Dashboard</Text>
        <Text>Logged in as: {user?.email}</Text>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
}

export default Dashboard;