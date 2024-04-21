import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NokData, NewNokData } from '../../../types/QualityHubTypes';

// Get all NokDetect
const getNokDetect = async() : Promise<NokData[]> => {
  const res = await axios.get(`${api_url}/quality/nok_detect`);
  return res.data;
};

// Get NokDetect by ID
const getNokDetectById = async( nokId : number) : Promise<NokData> => {

  const res = await axios.get(`${api_url}/quality/nok_detect/${nokId}`);
  return res.data;
};

// Get NokDetect by Product
const getNokDetectByProduct = async( productId : number) : Promise<NokData[]> => {

  const res = await axios.get(`${api_url}/quality/nok_detect/product/${productId}`);
  return res.data;
};

// Craete nokDetect
const createNokDetect = async(nokDetectData: NewNokData) : Promise<NokData | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/nok_detect`, nokDetectData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create nokDetect fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an NokDetect
const editNokDetect = async(nokDetectData : NewNokData) : Promise<NokData | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...nokDetectEditedData } = nokDetectData;
  try{
    const res = await axios.put(`${api_url}/quality/nok_detect/${id}`, nokDetectEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create nokDetect fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getNokDetect,
  getNokDetectById,
  getNokDetectByProduct,
  createNokDetect,
  editNokDetect,
};