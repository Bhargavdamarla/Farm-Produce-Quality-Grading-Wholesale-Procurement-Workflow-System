import API from '../api/api';

// Create procurement order
export const createOrder = async (data) => {
  try {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const response = await API.post('/procurement', {
      produceId: data.produceId,
      officerId: authData.id,
      priceAgreed: data.priceAgreed,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get graded produces available for procurement
export const getGradedProduces = async () => {
  try {
    const response = await API.get('/produce');
    return (response.data || []).filter((produce) => produce.status === 'ACCEPTED');
  } catch (error) {
    throw error;
  }
};

// Get all procurement orders
export const getAllOrders = async () => {
  try {
    const response = await API.get('/procurement');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get procurement orders by status
export const getOrdersByStatus = async (status) => {
  try {
    const response = await API.get(`/procurement/status/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get procurement order details
export const getOrderDetails = async (orderId) => {
  try {
    const response = await API.get(`/procurement/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get procurement history
export const getProcurementHistory = async (officerId) => {
  try {
    const response = await API.get(`/procurement/history/${officerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
