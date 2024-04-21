import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Rework, NewRework } from '../../../types/QualityHubTypes';

// Get all Rework
const getRework = async() : Promise<Rework[]> => {
  const res = await axios.get(`${api_url}/quality/reworks`);
  return res.data;
};

// Get Rework by Product
const getReworkByProduct = async( productId : number) : Promise<Rework[]> => {

  const res = await axios.get(`${api_url}/quality/reworks/product/${productId}`);
  return res.data;
};

// Craete rework
const createRework = async(reworkData: NewRework) : Promise<Rework | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/reworks`, reworkData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create rework fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Rework
const editRework = async(reworkData : NewRework) : Promise<Rework | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...reworkEditedData } = reworkData;
  try{
    const res = await axios.put(`${api_url}/quality/reworks/${id}`, reworkEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
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
  createRework,
  editRework,
};