import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Select,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

function CommissionDetail({ commissionId }) {
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [progress, setProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchCommissionDetail = async () => {
      try {
        const docRef = doc(db, 'commissions', commissionId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCommission({ id: docSnap.id, ...docSnap.data() });
          setNewStatus(docSnap.data().status);
          setProgress(docSnap.data().progress || 0);
        }
      } catch (error) {
        console.error('Error fetching commission:', error);
        toast({
          title: 'Error fetching commission details',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionDetail();
  }, [commissionId]);

  const handleStatusUpdate = async () => {
    try {
      const docRef = doc(db, 'commissions', commissionId);
      const timestamp = new Date().toISOString();

      // Update commission document
      await updateDoc(docRef, {
        status: newStatus,
        progress: Number(progress),
        lastUpdated: timestamp
      });

      // Add update to history
      const updateRef = collection(db, `commissions/${commissionId}/updates`);
      await addDoc(updateRef, {
        status: newStatus,
        progress: Number(progress),
        note: updateNote,
        timestamp: timestamp
      });

      setCommission(prev => ({
        ...prev,
        status: newStatus,
        progress: Number(progress),
        lastUpdated: timestamp
      }));

      toast({
        title: 'Commission updated',
        status: 'success',
        duration: 3000,
      });

      onClose();
      setUpdateNote('');
    } catch (error) {
      toast({
        title: 'Error updating commission',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'completed': return 'blue';
      case 'revision': return 'purple';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!commission) {
    return <Box>Commission not found</Box>;
  }

  return (
    <Box p={4}>
      <Card>
        <CardHeader>
          <Heading size="md">{commission.title}</Heading>
          <Badge colorScheme={getBadgeColor(commission.status)} mt={2}>
            {commission.status}
          </Badge>
        </CardHeader>

        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold">Description</Text>
              <Text>{commission.description}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Progress</Text>
              <Progress value={commission.progress || 0} colorScheme="blue" />
              <Text textAlign="right" fontSize="sm">
                {commission.progress || 0}%
              </Text>
            </Box>

            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">Price</Text>
                <Text>${commission.price}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Deadline</Text>
                <Text>
                  {new Date(commission.deadline).toLocaleDateString()}
                </Text>
              </Box>
            </HStack>

            <Divider />

            <Box>
              <Text fontWeight="bold">Client</Text>
              <Text>{commission.clientEmail}</Text>
            </Box>
          </VStack>
        </CardBody>

        <CardFooter>
          <Button colorScheme="blue" onClick={onOpen}>
            Update Status
          </Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Commission Status</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="revision">Revision Needed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>

              <Box w="full">
                <Text mb={2}>Progress (%)</Text>
                <Select
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                >
                  {[0, 25, 50, 75, 100].map(value => (
                    <option key={value} value={value}>{value}%</option>
                  ))}
                </Select>
              </Box>

              <Textarea
                placeholder="Add a note about this update..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleStatusUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommissionDetail;