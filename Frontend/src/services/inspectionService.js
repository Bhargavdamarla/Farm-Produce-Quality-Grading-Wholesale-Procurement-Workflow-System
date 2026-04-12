import API from '../api/api';

// Submit inspection result
export const submitInspection = async (data) => {
  try {
    const response = await API.post('/inspections', {
      produceId: data.produceId,
      qualityScore: data.qualityScore,
      remarks: data.remarks,
      assignedGrade: data.assignedGrade,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get pending inspections (assigned to current inspector)
export const getPendingInspections = async () => {
  try {
    const response = await API.get('/inspections/pending');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all inspections
export const getAllInspections = async () => {
  try {
    const response = await API.get('/inspections');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get inspection by status
export const getInspectionsByStatus = async (status) => {
  try {
    const response = await API.get(`/inspections/status/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get inspection details
export const getInspectionDetails = async (inspectionId) => {
  try {
    const response = await API.get(`/inspections/${inspectionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};