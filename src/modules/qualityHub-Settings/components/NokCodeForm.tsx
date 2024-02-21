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
} from '@mui/material';

import { NokCode, NokCodeData, NokGroup } from '../../../types/QualityHubTypes';
import { useQuery } from 'react-query';
import nokGrpServices from '../services/nokGrpServices';

interface FormData {
  id: number | string;
  nokCode: string;
  nokDesc:  string;
  nokGrp: NokGroup | null;
  active: boolean;
}

type NokCodeFormProps = {
  nokCodeData: NokCode | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (nokCode: NokCodeData) => void;
  displayNokCodeForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const NokCodeForm = ({ nokCodeData, formType, submitHandler, displayNokCodeForm } : NokCodeFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New NOK Code' : 'Edit Nok Code';
  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initialFormData : FormData = {
    id: nokCodeData ? nokCodeData.id : '',
    nokCode: nokCodeData ? nokCodeData.nokCode : '',
    nokDesc:  nokCodeData ? nokCodeData.nokDesc : '',
    nokGrp: nokCodeData ? nokCodeData.nokGrp : null,
    active: nokCodeData ? nokCodeData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: nokCodeData ? nokCodeData.id : '',
      nokCode: nokCodeData ? nokCodeData.nokCode : '',
      nokDesc:  nokCodeData ? nokCodeData.nokDesc : '',
      nokGrp: nokCodeData ? nokCodeData.nokGrp : null,
      active: nokCodeData ? nokCodeData.active : false,
    };
    setFormValues(formData);
  },[formType, nokCodeData]);

  // Get NOK Group List
  const nokGrpResults = useQuery('NokGrps',nokGrpServices.getNokGrp, { refetchOnWindowFocus: false });

  const nokGrpsList: NokGroup[] = nokGrpResults.data || [];

  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleGroupChange = (newValue: NokGroup) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      ['nokGrp']: newValue,
      ['nokGrpId']: newValue.id
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (formValues.nokGrp) {
      const newNokCode: NokCodeData  = {
        id: (typeof formValues.id === 'number') ? formValues.id : 0,
        nokCode: formValues.nokCode,
        nokDesc: formValues.nokDesc,
        nokGrp: formValues.nokGrp,
        nokGrpId: formValues.nokGrp.id,
        active: formValues.active,
      };
      submitHandler(newNokCode);
    } else {
      alert('Please select a NOK Group');
    }
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayNokCodeForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'row'} >
            <TextField
              label='NOK Code'
              name='nokCode'
              sx={{ marginLeft: 2, width: '20%' }}
              value={formValues.nokCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='Descriptoin'
              name='nokDesc'
              sx={{ marginLeft: 2, width: '35%' }}
              value={formValues.nokDesc}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
            />
            <Autocomplete
              id='nokGrp'
              sx={{ marginLeft: 2, marginTop: 1, width: '22%' }}
              size='small'
              aria-required
              options={nokGrpsList}
              isOptionEqualToValue={
                (option: NokGroup, value: NokGroup) => option.nokGrpCode === value.nokGrpCode
              }
              value={formValues.nokGrp ? formValues.nokGrp : null}
              onChange={(_event, newValue) => newValue && handleGroupChange(newValue)}
              getOptionLabel={(option: NokGroup) => `${option.nokGrpCode}, ${option.nokGrpName}`}
              renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                <TextField
                  {...params}
                  label='NOK Group'
                  placeholder='Add Group'
                  size='small'
                  required
                />
              )}
            />
            <FormControlLabel
              sx={{ marginLeft: 1, width: '10%'  }}
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

export default NokCodeForm;