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

import { RcaCode, RcaCodeData } from '../../../../types/QualityHubTypes';

interface FormData {
  id: string | number;
  rcaCode: string;
  rcaDesc: string;
  active: boolean;
}

type RcaCodeFormProps = {
  rcaCodeData: RcaCode | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (rcaCode: RcaCodeData ) => void;
  displayRcaCodeForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const RcaCodeForm = ({ rcaCodeData, formType, submitHandler, displayRcaCodeForm } : RcaCodeFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Code' : 'Edit Code';
  const submitTitle = formType === 'ADD' ? 'Add Code' : 'Update Code';

  const initialFormData : FormData = {
    id: rcaCodeData ? rcaCodeData.id : '',
    rcaCode: rcaCodeData ? rcaCodeData.rcaCode : '',
    rcaDesc: rcaCodeData ? rcaCodeData.rcaDesc : '',
    active: rcaCodeData ? rcaCodeData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: rcaCodeData ? rcaCodeData.id : '',
      rcaCode: rcaCodeData ? rcaCodeData.rcaCode : '',
      rcaDesc: rcaCodeData ? rcaCodeData.rcaDesc : '',
      active: rcaCodeData ? rcaCodeData.active : false,
    };
    setFormValues(formData);
  },[formType, rcaCodeData]);


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
    const newRcaCode: RcaCodeData = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      rcaCode: formValues.rcaCode,
      rcaDesc: formValues.rcaDesc,
      active: formValues.active,
    };
    submitHandler(newRcaCode);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayRcaCodeForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'column'} >
            <Grid container flexDirection={'row'} >
              <TextField
                label='RCA Code'
                name='rcaCode'
                sx={{ marginLeft: 2, width:'15%' }}
                value={formValues.rcaCode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Description'
                name='rcaDesc'
                sx={{ marginLeft: 2, width:'65%' }}
                value={formValues.rcaDesc}
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

export default RcaCodeForm;