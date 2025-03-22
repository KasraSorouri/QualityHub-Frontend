import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { NokAnalyseData, NewNokAnalyseData, NokStatus } from '../../../types/QualityHubTypes';

type AnalyzeStatus = {
  analyseStatus: NokStatus;
  removeFromReportStatus: boolean;
}

// Get All Analyses
const getAllAnalyses = async(): Promise<NokAnalyseData[]> => {
  const res = await axios.get(`${api_url}/quality/nok_analyses`);
  return res.data;
};

// Get NokAnalyse by ID
const getNokAnalyseById = async( nokReworkId : number) : Promise<NokAnalyseData> => {

  const res = await axios.get(`${api_url}/quality/nok_analyses/${nokReworkId}`);
  return res.data;
};

// Get Analyses by NokId
const getNokAnalyseByNokId = async( nokId : number) : Promise<NokAnalyseData> => {

  const res = await axios.get(`${api_url}/quality/nok_analyses/nok/${nokId}`);
  return res.data;
};

// Craete Nok Analyse
const createNokAnalyse = async(nokAnalyseData: NewNokAnalyseData) : Promise<NokAnalyseData> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/nok_analyses`, nokAnalyseData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create nokDetect fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
};

// remove a Analyse
const removeNokAnalyse = async(nokAnalyseId: number) : Promise<boolean> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.delete(`${api_url}/quality/nok_analyses/${nokAnalyseId}`, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('remove nokAnalyse fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
};

// Update Analyse Status
const updateStatus = async(nokAnalyseId: number, status: AnalyzeStatus) : Promise<boolean> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.put(`${api_url}/quality/nok_analyses/status/${nokAnalyseId}`, status, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('set Analyse is Done fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
      throw new Error('An unexpected error occurred');
    }
  }
};

export default {
  getAllAnalyses,
  getNokAnalyseById,
  getNokAnalyseByNokId,
  createNokAnalyse,
  removeNokAnalyse,
  updateStatus
};