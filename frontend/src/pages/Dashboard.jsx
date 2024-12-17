import { Box, Container, SimpleGrid, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import Navbar from '../components/Navbar';

function Dashboard() {
  return (
    <Box>
      <Navbar />
      <Container maxW="1200px" py={8}>
        <Text fontSize="2xl" mb={6}>Welcome to ArtCommission Dashboard</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Active Commissions</StatLabel>
            <StatNumber>0</StatNumber>
          </Stat>
          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Portfolio Items</StatLabel>
            <StatNumber>0</StatNumber>
          </Stat>
          <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Total Earnings</StatLabel>
            <StatNumber>$0</StatNumber>
          </Stat>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Dashboard;