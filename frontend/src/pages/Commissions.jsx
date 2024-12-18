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
  useDisclosure
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommissionList from '../components/CommissionList';
import CreateCommissionModal from '../components/CreateCommissionModal';
import CommissionDetail from '../components/CommissionDetail';

function Commissions() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { commissionId } = useParams();
  const navigate = useNavigate();

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

            <Tabs defaultIndex={1}>
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
          </>
        )}
      </Container>
    </Box>
  );
}

export default Commissions;