import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NokGroup, NokGrpData } from '../../../types/QualityHubTypes';

// Get all NokGrp
const getNokGrp = async() : Promise<NokGroup[]> => {
  const res = await axios.get(`${api_url}/quality/nok_grps`);
  console.log(' * Nok group *servise * test ->', res.data);

  return res.data;
};

// Craete nokGrp
const createNokGrp = async(nokGrpData: NokGrpData) : Promise<NokGroup | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/nok_grps`, nokGrpData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create nok fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an NokGrp
const editNokGrp = async(nokGrpData : NokGrpData) : Promise<NokGroup | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...nokGrpEditedData } = nokGrpData;
  try{
    const res = await axios.put(`${api_url}/quality/nok_grps/${id}`, nokGrpEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create nok fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getNokGrp,
  createNokGrp,
  editNokGrp,
};