import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

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
  TextFieldVariants,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from '@mui/material';

import { Machine, MachineData, Station } from '../../../../types/QualityHubTypes';
import stationServices from '../../services/stationServices';

interface FormData {
  id: string | number;
  machineName: string;
  machineCode: string;
  description: string;
  station?: Station | null;
  stationId?: number | null;
  active: boolean;
}

type MachineFormProps = {
  machineData: Machine | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (machine: MachineData ) => void;
  displayMachineForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const MachineForm = ({ machineData, formType, submitHandler, displayMachineForm } : MachineFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Device / Tool' : 'Edit Device / Tool';
  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initialFormData : FormData = {
    id: machineData ? machineData.id : '',
    machineName: machineData ? machineData.machineName : '',
    machineCode: machineData ? machineData.machineCode : '',
    description: machineData?.description ? machineData.description : '',
    station: machineData ? machineData.station : null,
    stationId: machineData?.station ? machineData.station.id : null,
    active: machineData ? machineData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: machineData ? machineData.id : '',
      machineName: machineData ? machineData.machineName : '',
      machineCode: machineData ? machineData.machineCode : '',
      description: machineData?.description ? machineData.description : '',
      station: machineData ? machineData.station : null,
      stationId: machineData?.station ? machineData.station.id : null,
      active: machineData ? machineData.active : false,
    };
    setFormValues(formData);
  },[formType, machineData]);


  // get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = (name === 'active' || name ==='traceable') ? checked : value;

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

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newMachine: MachineData = {
      id: (typeof formValues.id === 'number') ? formValues.id : 0,
      machineName: formValues.machineName,
      machineCode: formValues.machineCode,
      description: formValues.description,
      stationId: formValues.station ? formValues.station.id : undefined,
      active: formValues.active,
    };
    submitHandler(newMachine);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayMachineForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'row'} >
            <TextField
              label='Name'
              name='machineName'
              sx={{ marginLeft: 2, width:'15%' }}
              value={formValues.machineName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='Code'
              name='machineCode'
              sx={{ marginLeft: 2, width:'10%' }}
              value={formValues.machineCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='Description'
              name='description'
              sx={{ marginLeft: 2, width:'35%' }}
              value={formValues.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <Autocomplete
              id='station'
              sx={{ marginLeft: 2, marginTop: 1, width: '20%' }}
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

export default MachineForm;