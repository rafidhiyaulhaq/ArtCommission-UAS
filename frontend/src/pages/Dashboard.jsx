import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Flex,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    earnings: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const userId = auth.currentUser.uid;
        const commissionsRef = collection(db, 'commissions');
        
        // Get all user's commissions (both as client and artist)
        const clientQuery = query(commissionsRef, where('clientId', '==', userId));
        const artistQuery = query(commissionsRef, where('artistId', '==', userId));
        
        const [clientSnapshots, artistSnapshots] = await Promise.all([
          getDocs(clientQuery),
          getDocs(artistQuery)
        ]);

        // Combine and process all commissions
        const allCommissions = [
          ...clientSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          ...artistSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        ];

        // Calculate statistics
        const statistics = allCommissions.reduce((acc, commission) => {
          // Count by status
          acc[commission.status] = (acc[commission.status] || 0) + 1;
          
          // Calculate earnings (only for completed commissions as artist)
          if (commission.status === 'completed' && commission.artistId === userId) {
            acc.earnings += commission.price;
          }
          
          return acc;
        }, { active: 0, pending: 0, completed: 0, earnings: 0 });

        setStats(statistics);
      } catch (error) {
        toast({
          title: 'Error fetching dashboard data',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Box>
        <Navbar />
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Container maxW="1200px" py={8}>
        <Text fontSize="2xl" mb={6}>Welcome to ArtCommission Dashboard</Text>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Active Commissions</StatLabel>
            <StatNumber>{stats.active}</StatNumber>
            <StatHelpText>In Progress</StatHelpText>
          </Stat>
          
          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Pending Commissions</StatLabel>
            <StatNumber>{stats.pending}</StatNumber>
            <StatHelpText>Awaiting Action</StatHelpText>
          </Stat>

          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Completed Projects</StatLabel>
            <StatNumber>{stats.completed}</StatNumber>
            <StatHelpText>Successfully Delivered</StatHelpText>
          </Stat>

          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Total Earnings</StatLabel>
            <StatNumber>${stats.earnings.toLocaleString()}</StatNumber>
            <StatHelpText>From Completed Work</StatHelpText>
          </Stat>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Dashboard;