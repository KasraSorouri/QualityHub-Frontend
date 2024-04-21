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

import { ClassCode, ClassCodeData } from '../../../../types/QualityHubTypes';

interface FormData {
  id: string | number;
  className: string;
  classCode: string;
  classDesc: string;
  active: boolean;
}

type ClassCodeFormProps = {
  classCodeData: ClassCode | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (classCode: ClassCodeData ) => void;
  displayClassCodeForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const ClassCodeForm = ({ classCodeData, formType, submitHandler, displayClassCodeForm } : ClassCodeFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Code' : 'Edit Code';
  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initialFormData : FormData = {
    id: classCodeData ? classCodeData.id : '',
    className: classCodeData ? classCodeData.className : '',
    classCode: classCodeData ? classCodeData.classCode : '',
    classDesc: classCodeData ? classCodeData.classDesc : '',
    active: classCodeData ? classCodeData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: classCodeData ? classCodeData.id : '',
      className: classCodeData ? classCodeData.className : '',
      classCode: classCodeData ? classCodeData.classCode : '',
      classDesc: classCodeData ? classCodeData.classDesc : '',
      active: classCodeData ? classCodeData.active : false,
    };
    setFormValues(formData);
  },[formType, classCodeData]);


  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = (name === 'active') ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newClassCode: ClassCodeData = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      className: formValues.className,
      classCode: formValues.classCode,
      classDesc: formValues.classDesc,
      active: formValues.active,
    };
    submitHandler(newClassCode);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayClassCodeForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'column'} >
            <Grid container flexDirection={'row'} >
              <TextField
                label='Class Name'
                name='className'
                sx={{ marginLeft: 2, width:'20%' }}
                value={formValues.className}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Code'
                name='classCode'
                sx={{ marginLeft: 2, width:'10%' }}
                value={formValues.classCode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Description'
                name='classDesc'
                sx={{ marginLeft: 2, width:'55%' }}
                value={formValues.classDesc}
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

export default ClassCodeForm;