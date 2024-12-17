import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Text, useDisclosure } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import CommissionList from '../components/CommissionList';
import CreateCommissionModal from '../components/CreateCommissionModal';
import { useState } from 'react';

function Commissions() {
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getStatusFromTabIndex = (index) => {
    switch (index) {
      case 0: return 'active';
      case 1: return 'pending';
      case 2: return 'completed';
      default: return 'all';
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxW="1200px" py={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Text fontSize="2xl">Commissions</Text>
          <Button colorScheme="blue" onClick={onOpen}>Create Commission</Button>
        </Box>

        <Tabs onChange={(index) => setActiveTab(index)} defaultIndex={1}>
          <TabList>
            <Tab>Active</Tab>
            <Tab>Pending</Tab>
            <Tab>Completed</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <CommissionList status="active" />
            </TabPanel>
            <TabPanel>
              <CommissionList status="pending" />
            </TabPanel>
            <TabPanel>
              <CommissionList status="completed" />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <CreateCommissionModal isOpen={isOpen} onClose={onClose} />
      </Container>
    </Box>
  );
}

export default Commissions;