import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Material, NewMaterial } from '../../../types/QualityHubTypes';

// Get all Material
const getMaterial = async() : Promise<Material[]> => {
  const res = await axios.get(`${api_url}/quality/materials`);
  return res.data;
};

// Craete material
const createMaterial = async(materialData: NewMaterial) : Promise<Material | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/materials`, materialData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create material fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Material
const editMaterial = async(materialData : NewMaterial) : Promise<Material | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...materialEditedData } = materialData;
  try{
    const res = await axios.put(`${api_url}/quality/materials/${id}`, materialEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create material fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getMaterial,
  createMaterial,
  editMaterial,
};