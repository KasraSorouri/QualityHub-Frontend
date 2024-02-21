import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import recipeServices from '../services/recipeServices';
import RecipeList from './RecipeList';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import { Product, Recipe, RecipeData } from '../../../types/QualityHubTypes';
import RecipeForm from './RecipeForm';

type RecipeProps = {
  product: Product;
}

const Recipes = ( { product } :RecipeProps) => {

  const [ showRecipeForm, setShowRecipeForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedRecipe, setSelectedRecipe ] = useState<Recipe | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateRecipeQuery = async() => {
      await queryClient.invalidateQueries('recipes');
    };
    updateRecipeQuery();
  },[product, queryClient]);


  // Add New recipe
  const newRecipeMutation = useMutation(recipeServices.createRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
      setNotification({ message: 'Recipe added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit Recipe
  const editRecipeMutation = useMutation(recipeServices.editRecipe,{
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
      setNotification({ message: 'Recipe updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Get Recipes based on Selected product
  const recipeResults = useQuery(['recipes',product.id], async() => {
    const response = recipeServices.getRecipeByProduct(product.id);
    if (!response) {
      throw new Error('Failed to fetch recipes');
    }
    return response;
  },{ refetchOnWindowFocus: false, enabled: true });

  const recipes: Recipe[] = recipeResults.data || [];

  // Handle Submit Forms
  const handleRecipeFormSubmit = (newRecipeData:  RecipeData) => {
    if (showRecipeForm.formType === 'ADD') {
      newRecipeMutation.mutate(newRecipeData);
    }
    if (showRecipeForm.formType === 'EDIT') {
      editRecipeMutation.mutate(newRecipeData);
    }
  };

  return(
    <Grid container direction={'column'} spacing={2} marginLeft={2}>
      <Grid item>
        { recipeResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showRecipeForm.show && <RecipeForm recipeData={selectedRecipe} productId={product.id} formType={showRecipeForm.formType} submitHandler={handleRecipeFormSubmit} displayRecipeForm={setShowRecipeForm} />}
      </Grid>
      <Grid item>
        { recipeResults.data && <RecipeList recipes={recipes} selectRecipe={setSelectedRecipe} displayRecipeForm={setShowRecipeForm}/>}
      </Grid>
    </Grid>
  );
};

export default Recipes;