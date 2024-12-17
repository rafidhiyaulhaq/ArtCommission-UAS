import { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Tambahkan import ini

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate(); // Tambahkan ini

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log('Token:', token);
      toast({
        title: 'Login Success',
        status: 'success',
        duration: 3000,
      });
      navigate('/dashboard'); // Pindahkan ke sini
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account created',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch" maxW="400px" mx="auto">
        <Text fontSize="2xl" textAlign="center">ArtCommission Login</Text>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="outline" onClick={handleSignUp}>
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
}

export default Login;