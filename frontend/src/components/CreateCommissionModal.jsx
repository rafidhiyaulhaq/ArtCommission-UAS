import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    VStack,
    useToast
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { db, auth } from '../config/firebase';
  import { collection, addDoc } from 'firebase/firestore';
  
  function CreateCommissionModal({ isOpen, onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
        const commission = {
          title,
          description,
          price: Number(price),
          deadline,
          status: 'pending',
          clientId: auth.currentUser.uid,
          clientEmail: auth.currentUser.email,
          createdAt: new Date().toISOString()
        };
  
        await addDoc(collection(db, 'commissions'), commission);
  
        toast({
          title: 'Commission created',
          status: 'success',
          duration: 3000,
        });
        
        onClose();
        setTitle('');
        setDescription('');
        setPrice('');
        setDeadline('');
      } catch (error) {
        toast({
          title: 'Error creating commission',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Commission</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter commission title"
                  />
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter commission details"
                  />
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Price ($)</FormLabel>
                  <NumberInput min={1}>
                    <NumberInputField
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                    />
                  </NumberInput>
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Deadline</FormLabel>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
  
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  }
  
  export default CreateCommissionModal;