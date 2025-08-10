import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';

// Get NOK Deteced Dashboard Data
const getNokDashboardData = async () => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const parsmsData = {
    'startDate' : '2025.07.01',
    'endDate' : '2025.08.28',
    'productId' : [3,7,1]
  };

  try {
    const res = await axios.post(`${api_url}/quality/dashboard/detected-nok`,parsmsData, config);
    console.log('NOK Dashboard Data:', res.data);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('get NOK Dashboard Data fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
}

export default {
  getNokDashboardData,
}