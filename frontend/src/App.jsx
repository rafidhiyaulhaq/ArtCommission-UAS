import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Login';

function App() {
  return (
    <ChakraProvider>
      <Login />
    </ChakraProvider>
  );
}

export default App;