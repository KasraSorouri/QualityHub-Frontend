import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { IImageData } from '../../../types/QualityHubTypes';



// Upload NOK Images
const uploadImage  = async(formData: FormData): Promise< IImageData[]> => {
  const token = setToken();
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const res = await axios.post(`${api_url}/quality/fileUpload/nok_images`, formData, config);
    return res.data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create nokImage fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
};

export default {
  uploadImage,
};