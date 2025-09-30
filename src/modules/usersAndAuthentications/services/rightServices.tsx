import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from './authentication';
import { NewRight, Right } from '../../../types/UserAuthTypes';

// Get all Rights
const getRights = async (): Promise<Right[]> => {
  const res = await axios.get(`${api_url}/auth/rights`);
  return res.data;
};

// Create Right
const createRight = async (rightData: NewRight): Promise<Right | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/auth/rights`, rightData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`${err.message}`);
    }
  }
};

// Update a Right
const editRight = async (rightData: Right): Promise<Right | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...rightEditedData } = rightData;
  try {
    const res = await axios.put(`${api_url}/auth/rights/${id}`, rightEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('update role fail =>', err.message);
      throw new Error(`${err.message}`);
    }
  }
};

export default {
  getRights,
  createRight,
  editRight,
};
