import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { JSX } from 'react/jsx-runtime';
import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Grid,
  Autocomplete,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
  Stack,
} from '@mui/material';

import stationServices from '../services/stationServices';

import RecipeBOM from './RecipeBOM';

import { ConsumingMaterial, ConsumingMaterialData, Recipe, RecipeData, Reusable, Station } from '../../../types/QualityHubTypes';


interface FormData {
  id: number | string;
  recipeCode: string;
  description: string;
  station: Station | null;
  order: number;
  timeDuration?: number;
  active: boolean;
  materials?: ConsumingMaterial[];
}

type RecipeFormProps = {
  recipeData: Recipe | null;
  productId: number;
  formType: 'ADD' | 'EDIT';
  submitHandler: (recipe: Recipe | RecipeData) => void;
  displayRecipeForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const RecipeForm = ({ recipeData, productId, formType, submitHandler, displayRecipeForm } : RecipeFormProps) => {

  const [ showMaterials, setShowMaterials ] = useState<boolean>(false);

  const formTitle = formType === 'ADD' ? 'Add New Recipe' : 'Edit Recipe';
  const submitTitle = formType === 'ADD' ? 'Add Recipe' : 'Update Recipe';

  const initialFormData : FormData = {
    id: recipeData ? recipeData.id : '',
    recipeCode: recipeData ? recipeData.recipeCode : '',
    description: recipeData ? recipeData.description : '',
    station: recipeData ? recipeData.station : null,
    order: recipeData ? recipeData.order : 1,
    timeDuration: recipeData ? recipeData.timeDuration : 0,
    active: recipeData ? recipeData.active : false,
    materials: recipeData ? recipeData.recipeMaterials : [],
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: recipeData ? recipeData.id : '',
      recipeCode: recipeData ? recipeData.recipeCode : '',
      description: recipeData ? recipeData.description : '',
      station: recipeData ? recipeData.station : null,
      order: recipeData ? recipeData.order : 1,
      timeDuration: recipeData ? recipeData.timeDuration : 0,
      active: recipeData ? recipeData.active : false,
      materials: recipeData ? recipeData.recipeMaterials : [],
    };
    setFormValues(formData);
  },[formType, recipeData]);

  console.log('** recipe form * Recipe Data ->', recipeData);
  console.log('** recipe form * form values ->', formValues);


  // get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleStationChange = (newValue: Station) => {

    console.log(' ***  handle station * station->', newValue);

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      ['station']: newValue,
    }));
  };

  const handleMaterialChange = (newValue: ConsumingMaterial[]) => {
    console.log(' ***  handle material cahnge * in recipe form * materials ->', newValue);
    const newMaterials = newValue.map(item => { return({
      material: item.material,
      qty: item.qty,
      reusable: item.reusable
    }); });

    const newFormValue : FormData = {
      ...formValues,
      ['materials']: newMaterials,
    };
    setFormValues(newFormValue);
    console.log('****** fotm values ***** -> ', formValues);

  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log('****** form values ***** -> ', formValues);

    const materialsData = formValues.materials?.map(item => {
      if (!item.material) {
        return undefined;
      } else {
        const materialData : ConsumingMaterialData = {
          materialId: item.material.id,
          qty: item.qty,
          reusable: item.reusable ? item.reusable : Reusable.No,
        };
        return materialData;
      }
    }).filter(item => item !== undefined) as  ConsumingMaterialData [];

    if (formValues.station) {
      const newRecipe: RecipeData  = {
        id: (typeof formValues.id === 'number') ? formValues.id : 0,
        recipeCode: formValues.recipeCode,
        description: formValues.description,
        productId: productId,
        stationId: formValues.station.id,
        order: formValues.order,
        timeDuration: Number(formValues.timeDuration),
        active: formValues.active,
        materialsData: materialsData
      };
      console.log('****** new Recipe  ***** ->', newRecipe);

      submitHandler(newRecipe);
    }
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayRecipeForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Stack direction={'row'} >
            <Grid container flexDirection={'column'} >
              <Stack direction={'row'}>
                <Grid container flexDirection={'row'}>
                  <TextField
                    label='recipe Code'
                    name='recipeCode'
                    sx={{ marginLeft: 2, width: '10%' }}
                    value={formValues.recipeCode}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    margin='dense'
                    variant='outlined'
                    size='small'
                    required
                  />
                  <TextField
                    label='Description'
                    name='description'
                    sx={{ marginLeft: 1 ,minWidth: '30%' }}
                    value={formValues.description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    margin='dense'
                    variant='outlined'
                    size='small'
                    required
                  />
                  <Autocomplete
                    id='station'
                    sx={{ marginLeft: 1, marginTop: 1, width: '20%' }}
                    size='small'
                    aria-required
                    options={stationList}
                    isOptionEqualToValue={
                      (option: Station, value: Station) => option.stationName === value.stationName
                    }
                    value={formValues.station}
                    onChange={(_event, newValue) => newValue && handleStationChange(newValue)}
                    getOptionLabel={(option: { stationName: string; }) => option.stationName}
                    renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                      <TextField
                        {...params}
                        label='Station'
                        placeholder='Add Station'
                        size='small'
                        required
                      />
                    )}
                  />
                  <TextField
                    label='order'
                    name='order'
                    sx={{ marginLeft: 1, width: '10%' }}
                    value={formValues.order}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    margin='dense'
                    variant='outlined'
                    size='small'
                    required
                  />
                  <TextField
                    label='Duration'
                    name='timeDuration'
                    sx={{ marginLeft: 1, width: '10%' }}
                    value={formValues.timeDuration}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    margin='dense'
                    variant='outlined'
                    size='small'
                    required
                  />
                  <FormControlLabel
                    sx={{ marginLeft: 1 }}
                    control={
                      <Checkbox
                        checked={formValues.active}
                        onChange={handleChange}
                        name='active'
                        color='primary'
                      />
                    }
                    label='Active'
                  />
                </Grid>
                <Button variant='contained' color='primary' sx={{ margin: 1, minWidth:'200px' }}
                  onClick={() => setShowMaterials(!showMaterials)}>
                  {showMaterials ? 'Hide Materials' : 'Show Materials'}
                </Button>
              </Stack>
              <Grid margin={2}>
                { showMaterials && <RecipeBOM bom={formValues.materials ? formValues.materials : []} updateBOM={handleMaterialChange} /> }
              </Grid>
            </Grid >
            <Grid item xs={2} >
              <Button type='submit' variant='contained' color='primary' sx={{ margin: 1, minWidth: '200px' , width: 'auto' }}>
                {submitTitle}
              </Button>
            </Grid>
          </Stack>
        </Box>
      </form>
    </Paper>
  );
};

export default RecipeForm;