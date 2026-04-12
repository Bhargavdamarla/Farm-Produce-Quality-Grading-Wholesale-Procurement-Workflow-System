import API from '../api/api';

// Create new produce submission
export const createProduce = async (data) => {
  try {
    const response = await API.post('/produce', {
      categoryName: data.categoryName,
      quantity: data.quantity,
      unitType: data.unitType,
      harvestDate: data.harvestDate,
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
    throw error;
  }
};