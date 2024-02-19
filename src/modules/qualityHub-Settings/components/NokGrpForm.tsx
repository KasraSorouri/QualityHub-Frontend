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

import { NokGroup, NokGrpData } from '../../../types/QualityHubTypes';

interface FormData {
  id: number | string;
  nokGrpName: string;
  nokGrpCode:  string;
  nokGrpDesc: string | undefined;
  active: boolean;
}

type NokGrpFormProps = {
  nokGrpData: NokGroup | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (nokGrp: NokGrpData) => void;
  displayNokGrpForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const NokGrpForm = ({ nokGrpData, formType, submitHandler, displayNokGrpForm } : NokGrpFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New NOK Group' : 'Edit Nok Group';
  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initialFormData : FormData = {
    id: nokGrpData ? nokGrpData.id : '',
    nokGrpName: nokGrpData ? nokGrpData.nokGrpName : '',
    nokGrpCode:  nokGrpData ? nokGrpData.nokGrpCode : '',
    nokGrpDesc: nokGrpData ? nokGrpData.nokGrpDesc : '',
    active: nokGrpData ? nokGrpData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: nokGrpData ? nokGrpData.id : '',
      nokGrpName: nokGrpData ? nokGrpData.nokGrpName : '',
      nokGrpCode:  nokGrpData ? nokGrpData.nokGrpCode : '',
      nokGrpDesc: nokGrpData ? nokGrpData.nokGrpDesc : '',
      active: nokGrpData ? nokGrpData.active : false,
    };
    setFormValues(formData);
  },[formType, nokGrpData]);

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
    const newNokGrp: NokGrpData  = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      nokGrpName: formValues.nokGrpName,
      nokGrpCode: formValues.nokGrpCode,
      nokGrpDesc: formValues.nokGrpDesc,
      active: formValues.active,
    };
    submitHandler(newNokGrp);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayNokGrpForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'row'} >
            <TextField
              label='Group Name'
              name='nokGrpName'
              sx={{ marginLeft: 2, width: '20%' }}
              value={formValues.nokGrpName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='Code'
              name='nokGrpCode'
              sx={{ marginLeft: 2, width: '10%' }}
              value={formValues.nokGrpCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='Description'
              name='nokGrpDesc'
              sx={{ marginLeft: 2, width: '45%'  }}
              value={formValues.nokGrpDesc}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
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

export default NokGrpForm;