import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NokCodeData, NokCode } from '../../../types/QualityHubTypes';

// Get all NokCode
const getNokCode = async (): Promise<NokCode[]> => {
  const res = await axios.get(`${api_url}/quality/nok_codes`);
  return res.data;
};

// Craete NokCode
const createNokCode = async (nokCodeData: NokCodeData): Promise<NokCode | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/nok_codes`, nokCodeData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create nok fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an NokCode
const editNokCode = async (nokCodeData: NokCodeData): Promise<NokCode | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...nokCodeEditedData } = nokCodeData;
  try {
    const res = await axios.put(`${api_url}/quality/nok_codes/${id}`, nokCodeEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create nok fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getNokCode,
  createNokCode,
  editNokCode,
};
