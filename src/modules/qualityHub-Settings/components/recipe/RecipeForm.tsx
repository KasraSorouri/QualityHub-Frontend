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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import stationServices from '../../services/stationServices';

import RecipeBOM from './RecipeBOM';

import { ConsumingMaterial, ConsumingMaterialData, Recipe, RecipeData, RecipeType, Reusable, Station } from '../../../../types/QualityHubTypes';


interface FormData {
  id: number | string;
  recipeCode: string;
  description: string;
  station: Station | null;
  order: number;
  timeDuration?: number;
  manpower?: number;
  recipeType: RecipeType;
  active: boolean;
  materials?: ConsumingMaterial[];
}

type RecipeFormProps = {
  recipeData: Recipe | null;
  productId: number;
  formType: 'ADD' | 'EDIT';
  submitHandler: (recipe: RecipeData) => void;
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
    manpower: recipeData ? recipeData.manpower : 0,
    recipeType: recipeData ? recipeData.recipeType : RecipeType.PRODUCTION,
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
      recipeType: recipeData?.recipeType ? recipeData.recipeType : RecipeType.PRODUCTION,
      manpower: recipeData ? recipeData.manpower : 0,
      active: recipeData ? recipeData.active : false,
      materials: recipeData ? recipeData.recipeMaterials : [],
    };
    setFormValues(formData);
  },[formType, recipeData]);

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

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      ['station']: newValue,
    }));
  };

  const handleMaterialChange = (newValue: ConsumingMaterial[]) => {
    const newMaterials = newValue.map(item => { return({
      id: item.id,
      material: item.material,
      qty: item.qty,
      reusable: item.reusable
    }); });

    const newFormValue : FormData = {
      ...formValues,
      ['materials']: newMaterials,
    };
    setFormValues(newFormValue);
  };

  const handleRecipeType = (newValue: RecipeType) => {
    console.log('** new walue -> ', newValue);

    if (newValue !== null) {
      setFormValues((prevValues: FormData) => ({
        ...prevValues,
        ['recipeType']: newValue === RecipeType.REWORK ? RecipeType.REWORK : RecipeType.PRODUCTION,
      }));
    }
    console.log('** recipeType -> ', formValues.recipeType);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const materialsData = formValues.materials?.map(item => {
      if (!item.material) {
        return undefined;
      } else {
        const materialData : ConsumingMaterialData = {
          id: item.id,
          materialId: item.material.id,
          qty: item.qty,
          reusable: item.reusable ? item.reusable : Reusable.NO,
        };
        return materialData;
      }
    }).filter(item => item !== undefined) as  ConsumingMaterialData [];

    if (formValues.station && typeof formValues.station === 'object') {
      const newRecipe: RecipeData  = {
        id: (typeof formValues.id === 'number') ? formValues.id : 0,
        recipeCode: formValues.recipeCode,
        description: formValues.description,
        productId: productId,
        stationId: formValues.station.id,
        order: formValues.order,
        timeDuration: Number(formValues.timeDuration),
        manpower: (typeof formValues.manpower === 'number') ? Number(formValues.manpower) : 0,
        recipeType: formValues.recipeType !== RecipeType.REWORK ? RecipeType.PRODUCTION : RecipeType.REWORK,
        active: formValues.active,
        materialsData: materialsData
      };

      // Remove Materials from form
      const newFormValue : FormData = {
        ...formValues,
        ['materials']: [],
      };
      setFormValues(newFormValue);

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
          <Grid container flexDirection={'column'} >
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
                sx={{ marginLeft: 1 ,minWidth: '85%' }}
                value={formValues.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid container flexDirection={'row'}>
              <Autocomplete
                id='station'
                sx={{ marginLeft: 2, marginTop: 1, width: '22%' }}
                size='small'
                aria-required
                options={stationList}
                isOptionEqualToValue={
                  (option: Station, value: Station) => option.stationName === value.stationName
                }
                value={formValues.station ? formValues.station : null}
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
              />
              <TextField
                label='Manpower'
                name='manpower'
                sx={{ marginLeft: 1, width: '10%' }}
                value={formValues.manpower}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
              />
              <Typography variant='body2' sx={{ marginTop: 2, marginLeft: 2 }}>
                Type:
              </Typography>
              <ToggleButtonGroup
                value={formValues.recipeType}
                exclusive
                onChange={(_event, target) => handleRecipeType(target)}
                aria-label='Platform'
                size='small'
                sx={{ marginLeft: 1, marginTop: 1, height: '40px' }}
              >
                <ToggleButton value='PRODUCTION' sx={{ '&.Mui-selected': { backgroundColor:  '#96FFD9' }, }}>Production</ToggleButton>
                <ToggleButton value='REWORK' sx={{ '&.Mui-selected': { backgroundColor:  '#56F0FA' }, }}>Rework</ToggleButton>
              </ToggleButtonGroup>
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
            <Grid margin={2}>
              { showMaterials && <RecipeBOM bom={formValues.materials ? formValues.materials : []} updateBOM={handleMaterialChange} readonly={false} /> }
            </Grid>
          </Grid >
          <Grid item xs={2} margin={1}>
            <Button type='submit' variant='contained' color='primary' sx={{ minWidth: '200px' , width: 'auto' }}>
              {submitTitle}
            </Button>
            <Button variant='contained' color='primary' sx={{ marginTop: 2, minWidth:'200px', maxHeight:40,  width: 'auto' }}
              onClick={() => setShowMaterials(!showMaterials)}>
              {showMaterials ? 'Hide Materials' : 'Show Materials'}
            </Button>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default RecipeForm;