import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from './authentication';
import { NewRole, Role, RoleUpdate } from '../../../types/UserAuthTypes';

// Get all Roles
const getRoles = async (): Promise<Role[]> => {
  const res = await axios.get(`${api_url}/auth/roles`);
  return res.data;
};

// Create Role
const createRole = async (roleData: NewRole): Promise<Role | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };
  try {
    const res = await axios.post(`${api_url}/auth/roles`, roleData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('create role fail =>', err.message);
      throw new Error(`${err.message}`);
    }
  }
};

// Update a Role
const editRole = async (roleData: RoleUpdate): Promise<Role | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...roleEditedData } = roleData;

  console.log('** role service * update role * role data ->', roleData);

  try {
    const res = await axios.put(`${api_url}/auth/roles/${id}`, roleEditedData, config);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('update role fail =>', err.message);
      throw new Error(`${err.message}`);
    }
  }
};

export default {
  getRoles,
  createRole,
  editRole,
};
