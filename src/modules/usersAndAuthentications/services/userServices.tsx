import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from './authentication';
import { NewUser, UserBase, UserUpdate } from '../../../types/UserAuthTypes';

// Get all Users
const getUsers = async() : Promise<UserBase[]> => {
  const res = await axios.get(`${api_url}/auth/users`);
  return res.data;
};

// Craete user
const createUser = async(userData: NewUser) : Promise<UserBase | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/auth/users`, userData, config);
    return res.data;
  } catch (err : unknown) {
    if(axios.isAxiosError(err)) {
      console.log('create user fail =>', err.response?.data.error);
      throw new Error(`${err.response?.data.error}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an User
const editUser = async(userData : UserUpdate) : Promise<UserBase | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...userEditedData } = userData;
  try{
    const res = await axios.put(`${api_url}/auth/users/${id}`, userEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(axios.isAxiosError(err)) {
      console.log('create user fail =>', err.response?.data.error);
      throw new Error(`${err.response?.data.error}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getUsers,
  createUser,
  editUser,
};