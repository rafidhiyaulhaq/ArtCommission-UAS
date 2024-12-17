import { Box, Flex, Button, Text, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

function Navbar() {
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
    <Box bg="blue.500" px={4} py={2}>
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Text color="white" fontSize="xl" fontWeight="bold">
          ArtCommission
        </Text>
        <Flex align="center" gap={4}>
          <Button variant="ghost" color="white" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button variant="ghost" color="white" onClick={() => navigate('/commissions')}>
            Commissions
          </Button>
          <Button variant="ghost" color="white" onClick={() => navigate('/portfolio')}>
            Portfolio
          </Button>
          <Menu>
            <MenuButton as={Button} variant="ghost" color="white">
              {user?.email}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;