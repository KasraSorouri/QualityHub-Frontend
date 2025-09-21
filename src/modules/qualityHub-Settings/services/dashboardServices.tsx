import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { DashboardNokAnalysedData, DashboardTopNokData, DetectedNokData } from '../components/dashboard/DashBoardDataType';
import { Product, WorkShift } from '../../../types/QualityHubTypes';

// Get NOK Deteced Dashboard Data
const getNokDashboardData = async () : Promise<DetectedNokData[]> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const rawFilterData = window.sessionStorage.getItem('NokDetectFilter');
  const filterData = rawFilterData ? JSON.parse(rawFilterData) : null;

  const products = filterData && filterData.products ? JSON.parse(filterData.products) : [];
  const shifts = filterData && filterData.shifts ? JSON.parse(filterData.shifts) : [];

  const parsmsData = {
    'startDate' : filterData ? filterData.time_from : null,
    'endDate' : filterData ? filterData.time_until : null,
    'productId' : products.map((item : Product) => item.id),
    'shiftId' : shifts.map((item: WorkShift) => item.id)
  };

  try {
    const res = await axios.post(`${api_url}/quality/dashboard/detected-nok`,parsmsData, config);
    console.log(' *** Service  *** NOK Dashboard Data:', res.data);
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
};


const getNokAnanysedData = async () : Promise<DashboardNokAnalysedData> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const rawFilterData = window.sessionStorage.getItem('NokAnalysedFilter');
  const filterData = rawFilterData ? JSON.parse(rawFilterData) : null;

  const products = filterData && filterData.products ? JSON.parse(filterData.products) : [];
  const shifts = filterData && filterData.shifts ? JSON.parse(filterData.shifts) : [];

  const parsmsData = {
    'startDate' : filterData ? filterData.time_from : null,
    'endDate' : filterData ? filterData.time_until : null,
    'productId' : products.map((item : Product) => item.id),
    'shiftId' : shifts.map((item: WorkShift) => item.id)
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
};

const getTop_N_NokData = async () : Promise<DashboardTopNokData> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const rawFilterData = window.sessionStorage.getItem('TopNokFilter');
  const filterData = rawFilterData ? JSON.parse(rawFilterData) : null;

  const products = filterData && filterData.products ? JSON.parse(filterData.products) : [];
  const shifts = filterData && filterData.shifts ? JSON.parse(filterData.shifts) : [];

  const parsmsData = {
    'topN': filterData? filterData.topN : 10,
    'startDate' : filterData ? filterData.time_from : null,
    'endDate' : filterData ? filterData.time_until : null,
    'productId' : products.map((item : Product) => item.id),
    'shiftId' : shifts.map((item: WorkShift) => item.id)
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
};

export default {
  getNokDashboardData,
  getNokAnanysedData,
  getTop_N_NokData
};