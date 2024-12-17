import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Text } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import CommissionList from '../components/CommissionList';
import { useState } from 'react';

function Commissions() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Navbar />
      <Container maxW="1200px" py={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Text fontSize="2xl">Commissions</Text>
          <Button colorScheme="blue">Create Commission</Button>
        </Box>

        <Tabs onChange={(index) => setActiveTab(index)}>
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
      </Container>
    </Box>
  );
}

export default Commissions;