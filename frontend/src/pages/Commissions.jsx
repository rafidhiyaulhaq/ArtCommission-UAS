import { 
  Box, 
  Container, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Button, 
  Text, 
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  useToast
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommissionList from '../components/CommissionList';
import CommissionDetail from '../components/CommissionDetail';
import CreateCommissionModal from '../components/CreateCommissionModal';
import { useState } from 'react';

function Commissions() {
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { commissionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const getStatusFromTabIndex = (index) => {
    switch (index) {
      case 0: return 'active';
      case 1: return 'pending';
      case 2: return 'completed';
      default: return 'all';
    }
  };

  const handleCommissionClick = (id) => {
    navigate(`/commissions/${id}`);
  };

  const handleBackToList = () => {
    navigate('/commissions');
  };

  return (
    <Box>
      <Navbar />
      <Container maxW="1200px" py={8}>
        {commissionId ? (
          <>
            <Box mb={6}>
              <Button onClick={handleBackToList} colorScheme="gray" size="sm">
                Back to List
              </Button>
            </Box>
            <CommissionDetail commissionId={commissionId} />
          </>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
              <Text fontSize="2xl">Commissions</Text>
              <Button colorScheme="blue" onClick={onOpen}>
                Create Commission
              </Button>
            </Box>

            <Tabs onChange={(index) => setActiveTab(index)} defaultIndex={1}>
              <TabList>
                <Tab>Active</Tab>
                <Tab>Pending</Tab>
                <Tab>Completed</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <CommissionList 
                    status="active" 
                    onCommissionClick={handleCommissionClick}
                  />
                </TabPanel>
                <TabPanel>
                  <CommissionList 
                    status="pending" 
                    onCommissionClick={handleCommissionClick}
                  />
                </TabPanel>
                <TabPanel>
                  <CommissionList 
                    status="completed" 
                    onCommissionClick={handleCommissionClick}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>

            <CreateCommissionModal isOpen={isOpen} onClose={onClose} />
          </>
        )}
      </Container>
    </Box>
  );
}

export default Commissions;