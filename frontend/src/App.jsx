import { ChakraProvider } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Box p={5}>
        <Text>Test Render</Text>
      </Box>
    </ChakraProvider>
  );
}

export default App;