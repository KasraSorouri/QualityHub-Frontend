import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NewRca, RCA } from '../../../types/QualityHubTypes';


// Get All Rcas
const getAllRcas = async(): Promise<RCA[]> => {
  const res = await axios.get(`${api_url}/quality/nok_costs`);
  return res.data;
};

// Get NokRca by ID
const getNokRcaById = async( nokReworkId : number) : Promise<RCA> => {

  const res = await axios.get(`${api_url}/quality/nok_rcas/${nokReworkId}`);
  return res.data;
};

// Get RCAs by NokId
const getNokRcaByNokId = async( nokId : number) : Promise<RCA[]> => {

  const res = await axios.get(`${api_url}/quality/nok_rcas/nok/${nokId}`);
  return res.data;
};

// Craete Nok RCA
const createNokRca = async(nokRcaData: NewRca) : Promise<RCA> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/nok_rcas`, nokRcaData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create nokDetect fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
};

// remove a RCA
const removeNokRca = async(nokRcaId: number) : Promise<boolean> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.delete(`${api_url}/quality/nok_rcas/${nokRcaId}`, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('remove nokRca fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
};

export default {
  getAllRcas,
  getNokRcaById,
  getNokRcaByNokId,
  createNokRca,
  removeNokRca
};