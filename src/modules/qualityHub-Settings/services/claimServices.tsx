import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Claim, ClaimListData } from '../../../types/QualityHubTypes';

// Get all Claims
const getAllClaims = async() : Promise<ClaimListData[]> => {
  const res = await axios.get(`${api_url}/quality/claims`);
  return res.data;
};

// Get All Pending Claims
const getPendingClaims = async() : Promise<ClaimListData[]> => {
  const res = await axios.get(`${api_url}/quality/claims/pending`);
  return res.data;
};

// Update an Claim Status
const editClaimStatus = async(id: number, claimData: Claim) : Promise<ClaimListData | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  console.log(' calim service * claim data ->', claimData);

  try{
    const res = await axios.put(`${api_url}/quality/claims/${id}`, claimData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('update Claim Status fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getAllClaims,
  getPendingClaims,
  editClaimStatus,
};