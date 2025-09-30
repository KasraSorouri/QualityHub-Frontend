import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Machine, MachineData } from '../../../types/QualityHubTypes';

// Get all Machine
const getMachine = async (): Promise<Machine[]> => {
  const res = await axios.get(`${api_url}/quality/machines`);
  return res.data;
};

// Craete machine
const createMachine = async (machineData: MachineData): Promise<Machine | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/machines`, machineData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create machine fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Machine
const editMachine = async (machineData: MachineData): Promise<Machine | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...machineEditedData } = machineData;
  try {
    const res = await axios.put(`${api_url}/quality/machines/${id}`, machineEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create machine fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getMachine,
  createMachine,
  editMachine,
};
