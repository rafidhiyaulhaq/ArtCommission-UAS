import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';

function CommissionList({ status }) {
  // Dummy data for now
  const commissions = [
    {
      id: 1,
      title: "Character Design",
      client: "test123@gmail.com",
      price: "$50",
      deadline: "2024-02-01",
      status: "active"
    },
    // More dummy data can be added here
  ];

  const getBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

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
              <Td>{commission.client}</Td>
              <Td>{commission.price}</Td>
              <Td>{commission.deadline}</Td>
              <Td>
                <Badge colorScheme={getBadgeColor(commission.status)}>
                  {commission.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      {commissions.length === 0 && (
        <Box textAlign="center" py={8}>
          No commissions found.
        </Box>
      )}
    </Box>
  );
}

export default CommissionList;