import { useEffect, useState } from 'react';

import {
  TextField,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { NewRight, Right } from '../../../types/UserAuthTypes';

interface FormData extends Right {
}

type RightFormProps = {
  rightData: Right | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (role: NewRight | Right) => void;
  displayRightForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}

const RightForm = ({ formType, rightData, submitHandler, displayRightForm } : RightFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Right' : 'Edit Right';
  const submitTitle = formType === 'ADD' ? 'Add Righte' : 'Update Right';

  const initialFormData : FormData = {
    id: rightData ? rightData.id : '',
    right: rightData ? rightData.right : '',
    relatedModule: rightData ? rightData.relatedModule : '',
    active: rightData ? rightData.active : true,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: rightData ? rightData.id : '',
      right: rightData ? rightData.right : '',
      relatedModule: rightData ? rightData.relatedModule : '',
      active: rightData ? rightData.active : true,
    };
    setFormValues(formData);
  },[rightData]);

  const handleChange = (event: { target: { name: string; value: string | number | boolean; }; }) => {
    const { name, value } = event.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    submitHandler(formValues);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 3, marginBottom: 1  }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        border={'solid'} borderColor={'#1976d270'} borderRadius={3}  margin={0}
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained' onClick={() => displayRightForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex' flexDirection='row' alignItems='center'
          border={'solid'} borderColor={'#1976d2'} borderRadius={3} >
          <TextField
            label='Right'
            name='right'
            value={formValues.right}
            onChange={handleChange}
            margin='dense'
            variant='outlined'
            size='small'
            required
            sx={{ marginLeft: 2 }}
          />
          <TextField
            label='Related Module'
            name='relatedModule'
            value={formValues.relatedModule}
            onChange={handleChange}
            margin='dense'
            variant='outlined'
            size='small'
            required
            sx={{ marginLeft: 2 }}
          />
          <Button type='submit' variant='contained' color='primary' sx={{ marginLeft: 2 }} >
            {submitTitle}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default RightForm;