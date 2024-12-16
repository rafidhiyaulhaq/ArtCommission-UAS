import { ChakraProvider } from '@chakra-ui/react'
import { Box, Text } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Box p={5} bg="gray.100" minH="100vh">
        <Text fontSize="2xl" color="blue.500">
          Test Render
        </Text>
      </Box>
    </ChakraProvider>
  )
}

export default App