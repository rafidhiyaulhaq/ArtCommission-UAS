// frontend/src/services/commission.js

const API_URL = 'https://artcommission-uas-production.up.railway.app'; // Sesuaikan dengan URL Railway Anda

export const createCommission = async (commissionData) => {
  try {
    const response = await fetch(`${API_URL}/api/commissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commissionData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating commission:', error);
    throw error;
  }
};

export const updateCommissionStatus = async (commissionId, statusData) => {
  try {
    const response = await fetch(`${API_URL}/api/commissions/${commissionId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  } catch (error) {
    console.error('Error updating commission status:', error);
    throw error;
  }
};

export const getCommissionDetails = async (commissionId) => {
  try {
    const response = await fetch(`${API_URL}/api/commissions/${commissionId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching commission details:', error);
    throw error;
  }
};

export const getUserCommissions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/api/commissions/user/all?${queryParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user commissions:', error);
    throw error;
  }
};