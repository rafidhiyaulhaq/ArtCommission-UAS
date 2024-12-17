// frontend/src/components/CommissionList.jsx
import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function CommissionList({ status }) {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const commissionsRef = collection(db, 'commissions');
        let q;
        
        if (status === 'all') {
          q = query(commissionsRef);
        } else {
          q = query(commissionsRef, where('status', '==', status));
        }

        const querySnapshot = await getDocs(q);
        const commissionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCommissions(commissionsData);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [status]);

  const getBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Client</Th>
            <Th>Price</Th>
            <Th>Deadline</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {commissions.map((commission) => (
            <Tr key={commission.id}>
              <Td>{commission.title}</Td>
              <Td>{commission.clientEmail}</Td>
              <Td>${commission.price}</Td>
              <Td>{new Date(commission.deadline).toLocaleDateString()}</Td>
              <Td>
                <Badge colorScheme={getBadgeColor(commission.status)}>
                  {commission.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      {commissions.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          No commissions found.
        </Box>
      )}
    </Box>
  );
}

export default CommissionList;