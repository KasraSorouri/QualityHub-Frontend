import { useEffect, useState } from 'react';

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

import { Material, NewMaterial, Unit } from '../../../types/QualityHubTypes';

interface FormData {
  id: string | number;
  itemShortName: string;
  itemLongName: string;
  itemCode: string;
  price?: number | null;
  unit?: string;
  active: boolean;
  newUnit: Unit | string | undefined;
}

type MaterialFormProps = {
  materialData: Material | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (material: NewMaterial ) => void;
  displayMaterialForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const MaterialForm = ({ materialData, formType, submitHandler, displayMaterialForm } : MaterialFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Material' : 'Edit Material';
  const submitTitle = formType === 'ADD' ? 'Add Material' : 'Update Material';

  const initialFormData : FormData = {
    id: materialData ? materialData.id : '',
    itemShortName: materialData ? materialData.itemShortName : '',
    itemLongName: materialData ? materialData.itemLongName : '',
    itemCode: materialData ? materialData.itemCode : '',
    price: materialData ? materialData.price : 0,
    unit: materialData ? materialData.unit : 'No',
    active: materialData ? materialData.active : false,
    newUnit: materialData ? materialData.unit : undefined,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: materialData ? materialData.id : '',
      itemShortName: materialData ? materialData.itemShortName : '',
      itemLongName: materialData ? materialData.itemLongName : '',
      itemCode: materialData ? materialData.itemCode : '',
      price: materialData ? materialData.price : 0,
      unit: materialData ? materialData.unit : 'No',
      active: materialData ? materialData.active : false,
      newUnit: materialData ? materialData.unit : undefined,
    };
    setFormValues(formData);
  },[formType, materialData]);

  const units : Unit[] = [
    { id: 1, unitName:'No' },
    { id: 2, unitName:'Set' },
    { id: 3, unitName:'Kg' },
    { id: 4, unitName:'gr' },
    { id: 5, unitName:'m' },
    { id: 6, unitName:'Litr' },
    { id: 7, unitName:'cc' },
  ];

  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleUnitChange = (newValue: string) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      ['unit']: newValue,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newMaterial: NewMaterial = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      itemShortName: formValues.itemShortName,
      itemLongName: formValues.itemLongName,
      itemCode: formValues.itemCode,
      price: formValues.price ? formValues.price : 0,
      unit: formValues.unit ? formValues.unit : 'No',
      active: formValues.active,
    };
    submitHandler(newMaterial);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayMaterialForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'column'} >
            <Grid container flexDirection={'row'} >
              <TextField
                label='Short Name'
                name='itemShortName'
                sx={{ marginLeft: 2 }}
                value={formValues.itemShortName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Long Name'
                name='itemLongName'
                sx={{ marginLeft: 2 }}
                value={formValues.itemLongName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Item Code'
                name='itemCode'
                sx={{ marginLeft: 2 }}
                value={formValues.itemCode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Stack direction={'row'}>
              <TextField
                label='Price'
                name='price'
                sx={{ marginLeft: 2 }}
                value={formValues.price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
              />
              <Autocomplete
                id='unit'
                sx={{ marginTop: 1, marginLeft: 2, width: '150px' }}
                size='small'
                aria-required
                options={units.map(u => (u.unitName))}
                defaultValue={ 'No' }
                //isOptionEqualToValue={
                //  (option: string, value: string) => option. === value.unitName
                //}
                value={formValues.unit}
                onChange={(_event, newValue) => newValue && handleUnitChange(newValue)}
                //getOptionLabel={(option: { unitName: string; }) => option}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='Unit'
                    placeholder='Add unit'
                    size='small'
                    sx={{ width: '180px', margin: '2' }}
                    required
                  />
                )}
              />
              <FormControlLabel
                sx={{ marginLeft: 5 }}
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
            </Stack>
          </Grid>
          <Grid>
            <Button type='submit' variant='contained' color='primary' sx={{ margin: 1, minWidth: '200px' , width: 'auto' }}>
              {submitTitle}
            </Button>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default MaterialForm;