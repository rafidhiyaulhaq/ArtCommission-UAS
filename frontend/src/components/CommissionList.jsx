import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Spinner,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Search, ChevronDown } from 'lucide-react';

function CommissionList({ status }) {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const commissionsRef = collection(db, 'commissions');
        let q = commissionsRef;

        // Base query with status filter
        if (status !== 'all') {
          q = query(q, where('status', '==', status));
        }

        // Add sorting
        q = query(q, orderBy(sortBy, sortOrder));

        const querySnapshot = await getDocs(q);
        let commissionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Client-side filtering
        if (searchTerm) {
          commissionsData = commissionsData.filter(commission =>
            commission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commission.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Price filtering
        if (priceFilter !== 'all') {
          commissionsData = commissionsData.filter(commission => {
            switch (priceFilter) {
              case 'under50':
                return commission.price < 50;
              case '50to100':
                return commission.price >= 50 && commission.price <= 100;
              case 'over100':
                return commission.price > 100;
              default:
                return true;
            }
          });
        }

        setCommissions(commissionsData);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [status, searchTerm, priceFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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
    <Box>
      <HStack spacing={4} mb={6}>
        <InputGroup maxW="300px">
          <InputLeftElement>
            <Search size={20} />
          </InputLeftElement>
          <Input
            placeholder="Search commissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          maxW="200px"
        >
          <option value="all">All Prices</option>
          <option value="under50">Under $50</option>
          <option value="50to100">$50 - $100</option>
          <option value="over100">Over $100</option>
        </Select>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDown />}>
            Sort By: {sortBy}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleSort('deadline')}>Deadline</MenuItem>
            <MenuItem onClick={() => handleSort('price')}>Price</MenuItem>
            <MenuItem onClick={() => handleSort('title')}>Title</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('title')}>
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Client</Th>
              <Th cursor="pointer" onClick={() => handleSort('price')}>
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('deadline')}>
                Deadline {sortBy === 'deadline' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Th>
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
            <Text>No commissions found.</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CommissionList;