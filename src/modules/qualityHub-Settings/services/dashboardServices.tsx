import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { DashboardNokAnalysedData, DashboardTopNokData, DetectedNokData } from '../components/dashboard/DashBoardDataType';

// Get NOK Deteced Dashboard Data
const getNokDashboardData = async () : Promise<DetectedNokData[]> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const rawFilterData = window.sessionStorage.getItem('NokDetectFilter');
  const filterData = rawFilterData ? JSON.parse(rawFilterData) : null;

  const products = filterData ? JSON.parse(filterData.products) : [];
  const shifts = filterData ? JSON.parse(filterData.shifts) : [];

  console.log('*Nok Service * Filter data ->', filterData);
  console.log('*Nok Service * Products ->', products);
  console.log('*Nok Service * Shifts ->', shifts);
  

  const parsmsData = {
    'startDate' : filterData ? filterData.time_from : null,
    'endDate' : filterData ? filterData.time_until : null,
    'productId' : products.map((item: any) => item.id),
    'shifts' : shifts.map((item: any) => item.id)
  }

  console.log('*+* NOK Dashboard Data Params =>', parsmsData);
  
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


const getNokAnanysedData = async () : Promise<DashboardNokAnalysedData> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const parsmsData = {
    'startDate' : '2025.07.01',
    'endDate' : '2025.08.28',
    'productId' : []
  };
  
  try {
    const res = await axios.post(`${api_url}/quality/dashboard/analysed-nok`,parsmsData, config);
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

const getTop_N_NokData = async (topN: number) : Promise<DashboardTopNokData> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const parsmsData = {
    'startDate' : '2025.07.01',
    'endDate' : '2025.08.28',
    'productId' : [],
    'topN': topN
  };
  
  try {
    const res = await axios.post(`${api_url}/quality/dashboard/top-nok`,parsmsData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('get Top N NOK Dashboard Data fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
}

export default {
  getNokDashboardData,
  getNokAnanysedData,
  getTop_N_NokData
}