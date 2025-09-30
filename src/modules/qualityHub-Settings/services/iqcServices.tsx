import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { IQCListData, IQCData } from '../../../types/QualityHubTypes';

// Get all Iqcs
const getAllIqcs = async (): Promise<IQCListData[]> => {
  const res = await axios.get(`${api_url}/quality/iqcs`);
  return res.data;
};

// Get All Pending Iqcs
const getPendingIqcs = async (): Promise<IQCListData[]> => {
  const res = await axios.get(`${api_url}/quality/iqcs/pending`);
  return res.data;
};

// Update an Iqc Status
const editIqcStatus = async (id: number, iqcData: IQCData): Promise<IQCListData | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  console.log(' calim service * iqc data ->', iqcData);

  try {
    const res = await axios.put(`${api_url}/quality/iqcs/${id}`, iqcData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('update Iqc Status fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getAllIqcs,
  getPendingIqcs,
  editIqcStatus,
};
