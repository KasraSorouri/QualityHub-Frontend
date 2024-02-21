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
} from '@mui/material';

import { Station, NewStation } from '../../../types/QualityHubTypes';

interface FormData {
  id: number | string;
  stationName: string;
  stationCode:  string;
  active: boolean;
}

type StationFormProps = {
  stationData: Station | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (station: NewStation | NewStation) => void;
  displayStationForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const StationForm = ({ stationData, formType, submitHandler, displayStationForm } : StationFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Station' : 'Edit Station';
  const submitTitle = formType === 'ADD' ? 'Add Station' : 'Update Station';

  const initialFormData : FormData = {
    id: stationData ? stationData.id : '',
    stationName: stationData ? stationData.stationName : '',
    stationCode:  stationData ? stationData.stationCode : '',
    active: stationData ? stationData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: stationData ? stationData.id : '',
      stationName: stationData ? stationData.stationName : '',
      stationCode:  stationData ? stationData.stationCode : '',
      active: stationData ? stationData.active : false,
    };
    setFormValues(formData);
  },[formType, stationData]);

  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newStation: NewStation  = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      stationName: formValues.stationName,
      stationCode: formValues.stationCode,
      active: formValues.active,
    };
    submitHandler(newStation);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayStationForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'row'} >
            <TextField
              label='Station Name'
              name='stationName'
              sx={{ marginLeft: 2 }}
              value={formValues.stationName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='Station Code'
              name='stationCode'
              sx={{ marginLeft: 2 }}
              value={formValues.stationCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
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

export default StationForm;