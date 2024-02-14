import axios from 'axios';

import { api_url } from '../../../configs/config';
import setToken from '../../usersAndAuthentications/services/authentication';
import { Recipe, RecipeData } from '../../../types/QualityHubTypes';

// Get all Recipe
const getRecipe = async() : Promise<Recipe[]> => {
  const res = await axios.get(`${api_url}/quality/recipes`);
  return res.data;
};

// Craete recipe
const createRecipe = async(recipeData: RecipeData) : Promise<Recipe | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  try {
    const res = await axios.post(`${api_url}/quality/recipes`, recipeData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create recipe fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

// Update an Recipe
const editRecipe = async(recipeData : RecipeData) : Promise<Recipe | unknown> => {
  const token = setToken();
  const config = {
    headers: { Authorization: token },
  };

  const { id, ...recipeEditedData } = recipeData;
  try{
    const res = await axios.put(`${api_url}/quality/recipes/${id}`, recipeEditedData, config);
    return res.data;
  } catch (err : unknown) {
    if(err instanceof Error) {
      console.log('create recipe fail =>', err.message);
      throw new Error(`${err.message}`);
    } else {
      console.log('An unexpected error occurred:', err);
    }
  }
};

export default {
  getRecipe,
  createRecipe,
  editRecipe,
};