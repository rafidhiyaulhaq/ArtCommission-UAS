import { Box, Container, Text } from '@chakra-ui/react';
import Navbar from '../components/Navbar';

function Portfolio() {
  return (
    <Box>
      <Navbar />
      <Container maxW="1200px" py={8}>
        <Text fontSize="2xl" mb={6}>Portfolio</Text>
        <Text>Portfolio page is under construction</Text>
      </Container>
    </Box>
  );
}

export default Portfolio;