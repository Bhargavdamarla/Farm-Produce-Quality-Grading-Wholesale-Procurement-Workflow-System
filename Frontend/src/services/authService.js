import API from '../api/api';

export const register = async (name, email, password, role, phoneNumber) => {
  const response = await API.post('/auth/register', { name, email, password, role, phoneNumber });
  return response.data;
};

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};
