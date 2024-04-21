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

import { WorkShift, WorkShiftData } from '../../../../types/QualityHubTypes';

interface FormData {
  id: string | number;
  shiftName: string;
  shiftCode: string;
  active: boolean;
}

type ShiftFormProps = {
  shiftData: WorkShift | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (shift: WorkShiftData ) => void;
  displayShiftForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const ShiftForm = ({ shiftData, formType, submitHandler, displayShiftForm } : ShiftFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add Shift' : 'Edit Shift';
  const submitTitle = formType === 'ADD' ? 'Add Shift' : 'Update Shift';

  const initialFormData : FormData = {
    id: shiftData ? shiftData.id : '',
    shiftName: shiftData ? shiftData.shiftName : '',
    shiftCode: shiftData ? shiftData.shiftCode : '',
    active: shiftData ? shiftData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: shiftData ? shiftData.id : '',
      shiftName: shiftData ? shiftData.shiftName : '',
      shiftCode: shiftData ? shiftData.shiftCode : '',
      active: shiftData ? shiftData.active : false,
    };
    setFormValues(formData);
  },[formType, shiftData]);


  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = (name === 'active' || name ==='traceable') ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newShift: WorkShiftData = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      shiftName: formValues.shiftName,
      shiftCode: formValues.shiftCode,
      active: formValues.active,
    };
    submitHandler(newShift);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayShiftForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'column'} >
            <Grid container flexDirection={'row'} >
              <TextField
                label='Shift Name'
                name='shiftName'
                sx={{ marginLeft: 2, width:'15%' }}
                value={formValues.shiftName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Shift Code'
                name='shiftCode'
                sx={{ marginLeft: 2, width:'65%' }}
                value={formValues.shiftCode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <FormControlLabel
                sx={{ marginLeft: 2 }}
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
          </Grid>
          <Grid>
            <Button type='submit' variant='contained' color='primary' sx={{ margin: 1, minWidth: '120px' , width: 'auto' }}>
              {submitTitle}
            </Button>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default ShiftForm;