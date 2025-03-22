import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NokRework, NewNokReworkData, DismanteledMaterialData, NewNokCostData } from '../../../types/QualityHubTypes';


// Get Nok Costs
const getNokCosts = async(): Promise<NokRework[]> => {
  const res = await axios.get(`${api_url}/quality/nok_costs`);
  return res.data;
};

// Get NokCost by ID
const getNokCostById = async( nokReworkId : number) : Promise<NokRework> => {

  const res = await axios.get(`${api_url}/quality/nok_costs/${nokReworkId}`);
  return res.data;
};

// Get Dismantled Material by NokId
const getDismantledMaterialByNokId = async( nokId : number) : Promise<DismanteledMaterialData[]> => {

  const res = await axios.get(`${api_url}/quality/nok_costs/nok_material/nok/${nokId}`);
  return res.data;
};

// Craete nokCost
const createNokCost = async(nokCostData: NewNokCostData) : Promise<NokRework | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  console.log('#Nok Cost Service * nok cost data-> ',nokCostData);
  

  try {
    const res = await axios.post(`${api_url}/quality/nok_costs`, nokCostData, config);
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

// Update a NokCost
const editNokCost = async(nokReworkData: NewNokReworkData) : Promise<NokRework | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...nokReworkEditedData } = nokReworkData;
  try{
    const res = await axios.put(`${api_url}/quality/nok_costs/${id}`, nokReworkEditedData, config);
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
  getNokCosts,
  getNokCostById,
  getDismantledMaterialByNokId,
  createNokCost,
  editNokCost
};