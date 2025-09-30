import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { ClassCode, ClassCodeData } from '../../../types/QualityHubTypes';

// Get all ClassCode
const getClassCode = async (): Promise<ClassCode[]> => {
  const res = await axios.get(`${api_url}/quality/class_codes`);
  return res.data;
};

// Create classCode
const createClassCode = async (classCodeData: ClassCodeData): Promise<ClassCode | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/class_codes`, classCodeData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create classCode fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an ClassCode
const editClassCode = async (classCodeData: ClassCodeData): Promise<ClassCode | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...classCodeEditedData } = classCodeData;
  try {
    const res = await axios.put(`${api_url}/quality/class_codes/${id}`, classCodeEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create classCode fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getClassCode,
  createClassCode,
  editClassCode,
};
