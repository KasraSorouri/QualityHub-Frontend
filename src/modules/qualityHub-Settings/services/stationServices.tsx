import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Station, NewStation, } from '../../../types/QualityHubTypes';

// Get all Station
const getStation = async() : Promise<Station[]> => {
  const res = await axios.get(`${api_url}/quality/stations`);
  return res.data;
};

// Craete station
const createStation = async(stationData: NewStation) : Promise<Station | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/stations`, stationData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create station fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Station
const editStation = async(stationData : NewStation) : Promise<Station | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...stationEditedData } = stationData;
  try{
    const res = await axios.put(`${api_url}/quality/stations/${id}`, stationEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create station fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getStation,
  createStation,
  editStation,
};