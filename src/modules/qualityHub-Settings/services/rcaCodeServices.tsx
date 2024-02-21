import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { RcaCode, RcaCodeData } from '../../../types/QualityHubTypes';

// Get all RcaCode
const getRcaCode = async() : Promise<RcaCode[]> => {
  const res = await axios.get(`${api_url}/quality/rca_codes`);
  return res.data;
};

// Create rcaCode
const createRcaCode = async(rcaCodeData: RcaCodeData) : Promise<RcaCode | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/rca_codes`, rcaCodeData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create rcaCode fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an RcaCode
const editRcaCode = async(rcaCodeData : RcaCodeData) : Promise<RcaCode | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...rcaCodeEditedData } = rcaCodeData;
  try{
    const res = await axios.put(`${api_url}/quality/rca_codes/${id}`, rcaCodeEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create rcaCode fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getRcaCode,
  createRcaCode,
  editRcaCode,
};