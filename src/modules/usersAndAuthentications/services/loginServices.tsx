import axios from 'axios';

import { api_url } from '../../../configs/config';
import { Credentials } from '../../../types/UserAuthTypes';

const login = async(credentials : Credentials) => {

  const { username, password } = credentials;

  try {
    const result = await axios.post(`${api_url}/auth/login`,  { username, password });
    console.log('login service * result ->', result);

    return result.data;
  } catch (err : unknown) {
    if (err instanceof Error) {
      if (err.message.includes('401')) {
        throw new Error('The Username Or Password is incorrect!');
      }
      console.log('Error ->',err.message);
      throw new Error(`${err.message}`);
    }
  }
};

export default {
  login
};