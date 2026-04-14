import API from '../api/api';

// Create new produce submission
export const createProduce = async (data) => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const response = await API.post('/produce', {
      farmerId: authData.id || 1, 
      categoryId: data.categoryId, 
      quantity: data.quantity
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all produce submitted by farmer
export const getFarmerProduce = async (farmerId) => {
  try {
    const response = await API.get(`/produce/farmer/${farmerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all produce
export const getAllProduce = async () => {
  try {
    const response = await API.get('/produce');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get produce by status
export const getProduceByStatus = async (status) => {
  try {
    const response = await API.get(`/produce/status/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get produce submission history
export const getProduceHistory = async (farmerId) => {
  try {
    const response = await API.get(`/produce/history/${farmerId}`);
    return response.data;
  } catch (error) {
  }
};

export const getPendingProduce = async () => {
  try {
    const response = await API.get('/produce/pending');
    return response.data;
  } catch (error) {
    throw error;
  }
};