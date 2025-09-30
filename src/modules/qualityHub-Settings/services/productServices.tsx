import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Product, NewProduct, UpdateProductData } from '../../../types/QualityHubTypes';

// Get all Product
const getProduct = async (): Promise<Product[]> => {
  const res = await axios.get(`${api_url}/quality/products`);
  return res.data;
};

// Craete product
const createProduct = async (productData: NewProduct): Promise<Product | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/products`, productData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create product fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Product
const editProduct = async (productData: UpdateProductData): Promise<Product | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...productEditedData } = productData;
  try {
    const res = await axios.put(`${api_url}/quality/products/${id}`, productEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create product fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getProduct,
  createProduct,
  editProduct,
};
