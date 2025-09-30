import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Rework, NewRework } from '../../../types/QualityHubTypes';

type FilterParameter = {
  productId: number;
  filterParameter?: {
    nokCode?: number;
    station?: number;
  };
};

// Get all Rework
const getRework = async (): Promise<Rework[]> => {
  const res = await axios.get(`${api_url}/quality/reworks`);
  return res.data;
};

// Get Reworks by Product
const getReworkByProduct = async (productId: number): Promise<Rework[]> => {
  const res = await axios.get(`${api_url}/quality/reworks/product/${productId}`);
  return res.data;
};

// Get Reworks * Filtered
const getFilteredRework = async (filterParameter: FilterParameter): Promise<Rework[]> => {
  console.log('fileter parameter ->', filterParameter);
  const res = await axios.get(`${api_url}/quality/reworks/product/${filterParameter.productId}`);
  return res.data;
};

// Craete rework
const createRework = async (reworkData: NewRework): Promise<Rework | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/reworks`, reworkData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create rework fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Rework
const editRework = async (reworkData: NewRework): Promise<Rework | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...reworkEditedData } = reworkData;
  try {
    const res = await axios.put(`${api_url}/quality/reworks/${id}`, reworkEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create rework fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getRework,
  getReworkByProduct,
  getFilteredRework,
  createRework,
  editRework,
};
