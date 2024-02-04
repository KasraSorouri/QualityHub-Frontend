import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NewProductGrp, ProductGroup } from '../../../types/QualityHubTypes';

// Get all ProductGrp
const getProductGrp = async() : Promise<ProductGroup[]> => {
  const res = await axios.get(`${api_url}/quality/product_grps`);
  return res.data;
};

// Craete productGrp
const createProductGrp = async(productGrpData: NewProductGrp) : Promise<ProductGroup | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/productGrps`, productGrpData, config);
    return res.data;
  } catch (err : unknown) {
    if(axios.isAxiosError(err)) {
      console.log('create productGrp fail =>', err.response?.data.error);
      throw new Error(`${err.response?.data.error}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an ProductGrp
const editProductGrp = async(productGrpData : NewProductGrp) : Promise<ProductGroup | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...productGrpEditedData } = productGrpData;
  try{
    const res = await axios.put(`${api_url}/quality/productGrps/${id}`, productGrpEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(axios.isAxiosError(err)) {
      console.log('create productGrp fail =>', err.response?.data.error);
      throw new Error(`${err.response?.data.error}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getProductGrp,
  createProductGrp,
  editProductGrp,
};