import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Autocomplete,
  FilledTextFieldProps,
  Grid,
  LinearProgress,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography,
} from '@mui/material';

import recipeServices from '../services/recipeServices';
import RecipeList from './RecipeList';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import { Product, Recipe, RecipeData } from '../../../types/QualityHubTypes';
import RecipeForm from './RecipeForm';
import productServices from '../services/productServices';

const Recipes = () => {

  const [ showRecipeForm, setShowRecipeForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedRecipe, setSelectedRecipe ] = useState<Recipe | null>(null);
  const [ selectedProduct, setSelectedProduct ] = useState<Product | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

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

  // Get Product List
  const productResults = useQuery('products', productServices.getProduct, { refetchOnWindowFocus: false });
  const products: Product[] = productResults.data || [];

  // Get Recipe List
  const recipeResults = useQuery('recipes',recipeServices.getRecipe, { refetchOnWindowFocus: false });
  const recipes: Recipe[] = recipeResults.data || [];

  console.log('recipes ->', recipes);


  const handleRecipeFormSubmit = (newRecipeData:  RecipeData) => {
    console.log(' ******* recipe data **** -> ', newRecipeData);

    if (showRecipeForm.formType === 'ADD') {
      newRecipeMutation.mutate(newRecipeData);
    }

    if (showRecipeForm.formType === 'EDIT') {
      editRecipeMutation.mutate(newRecipeData);
    }
  };

  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        <Autocomplete
          id='product'
          sx={{ margin: 1, width: '150px' }}
          size='small'
          aria-required
          options={products}
          isOptionEqualToValue={
            (option: Product, value: Product) => option.productName === value.productName
          }
          value={selectedProduct}
          onChange={(_event, newValue) => newValue && setSelectedProduct(newValue)}
          getOptionLabel={(option: { productName: string; }) => option.productName}
          renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
            <TextField
              {...params}
              label=' Product'
              placeholder='Product'
              size='small'
              sx={{ width: '180px', margin: '2' }}
              required
            />
          )}
        />
      </Grid>
      { selectedProduct ?
        <Grid container direction={'column'} spacing={2} marginLeft={2}>
          <Grid item>
            { recipeResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
            { showRecipeForm.show && <RecipeForm recipeData={selectedRecipe} productId={selectedProduct?.id} formType={showRecipeForm.formType} submitHandler={handleRecipeFormSubmit} displayRecipeForm={setShowRecipeForm} />}
          </Grid>
          <Grid item>
            { recipeResults.data && <RecipeList recipes={recipes} selectRecipe={setSelectedRecipe} displayRecipeForm={setShowRecipeForm}/>}
          </Grid>
        </Grid>
        :
        <Grid>
          <Typography variant='h6' marginLeft={2}>
        Please select a product to view recipes.
            <br/>
        If you do not see any products, please add a new product.
            <br/>
            <br/>
          </Typography>
        </Grid>
      }
    </Grid>
  );
};

export default Recipes;