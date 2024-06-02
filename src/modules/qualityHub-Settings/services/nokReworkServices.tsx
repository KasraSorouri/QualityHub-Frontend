import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NokData, NokReworkData } from '../../../types/QualityHubTypes';


// Get NokRework by ID
const getNokReworkById = async( nokReworkId : number) : Promise<NokData> => {

  const res = await axios.get(`${api_url}/quality/nok_rework'/${nokReworkId}`);
  return res.data;
};

// Get NokRework by NokId
const getNokReworkByNokId = async( nokId : number) : Promise<NokData[]> => {

  const res = await axios.get(`${api_url}/quality/nok_rework'/nok/${nokId}`);
  return res.data;
};

// Craete nokDetect
const createNokRework = async(nokReworkData: NokReworkData) : Promise<NokData | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/nok_rework`, nokReworkData, config);
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

// Update a NokRework
const editNokRework = async(nokReworkData: NokReworkData) : Promise<NokData | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...nokReworkEditedData } = nokReworkData;
  try{
    const res = await axios.put(`${api_url}/quality/nok_rework/${id}`, nokReworkEditedData, config);
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
  getNokReworkById,
  getNokReworkByNokId,
  createNokRework,
  editNokRework,
};