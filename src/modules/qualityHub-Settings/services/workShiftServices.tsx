import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { WorkShift, WorkShiftData } from '../../../types/QualityHubTypes';

// Get all Shift
const getShift = async() : Promise<WorkShift[]> => {
  const res = await axios.get(`${api_url}/quality/shifts`);
  return res.data;
};

// Create shift
const createShift = async(shiftData: WorkShiftData) : Promise<WorkShift | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/shifts`, shiftData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create shift fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Shift
const editShift = async(shiftData : WorkShiftData) : Promise<WorkShift | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...shiftEditedData } = shiftData;
  try{
    const res = await axios.put(`${api_url}/quality/shifts/${id}`, shiftEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create shift fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getShift,
  createShift,
  editShift,
};