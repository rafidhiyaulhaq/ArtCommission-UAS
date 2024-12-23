const validateCommissionData = ({ title, description, price, deadline }) => {
    if (!title || title.trim().length < 3) {
      return 'Title must be at least 3 characters long';
    }
  
    if (!description || description.trim().length < 10) {
      return 'Description must be at least 10 characters long';
    }
  
    if (!price || price <= 0) {
      return 'Price must be greater than 0';
    }
  
    if (!deadline || new Date(deadline) <= new Date()) {
      return 'Deadline must be in the future';
    }
  
    return null;
  };
  
  const calculateFees = (price) => {
    const artistPercentage = 0.7; 
    const platformPercentage = 0.3; 
  
    return {
      artistFee: price * artistPercentage,
      platformFee: price * platformPercentage
    };
  };
  
  module.exports = {
    validateCommissionData,
    calculateFees
  };