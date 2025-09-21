
import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel,SelectChangeEvent, Button, Grid, Stack } from '@mui/material';
import { IQCData, MaterialStatus } from '../../../../types/QualityHubTypes';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import iqcServices from '../../services/iqcServices';


interface MaterialFormData {
  user: string;
  date: Dayjs;
  status: MaterialStatus;
  reference?: string;
  description?: string;
}

interface FormProps {
  materialId: number;
  onSubmit: (formData: MaterialFormData) => void;
}

const MaterialStatusUpdateForm = ({ materialId, onSubmit } : FormProps) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    user: '',
    date: dayjs(new Date()),
    reference: '',
    description: '',
    status: MaterialStatus.IQC
  });

  // Status options for combo box
  const statusOptions = [
    'IQC',
    'OK',
    'SCRAPPED',
    'CLAIMABLE'
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const timeHandler = (value: Dayjs | null) => {
    if (value) {
      setFormData(prevState => ({
        ...prevState,
        date: value
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<MaterialStatus>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const updateStatus = () => {
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    const newClaimData : IQCData  = {
      dismantledMaterialId: materialId,
      date: new Date(formData.date.toISOString()),
      materialStatus: formData.status,
      reference: formData.reference,
      description: formData.description,

    };
    iqcServices.editIqcStatus(materialId, newClaimData);
    onSubmit(formData);
  };

  return (
    <Grid direction={'row'} spacing={1} margin={1} >
      <TextField
        required
        name='user'
        label='User'
        size='small'
        sx={{ margin :1 }}
        value={formData.user}
        onChange={handleInputChange}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          name='date'
          label='Date'
          value={formData.date}
          onChange={(newValue: Dayjs | null) => timeHandler(newValue)}
          sx={{ marginLeft: 1, marginTop: 1, maxWidth: '150px','& .MuiInputBase-root': { height: '40px' } }}
          disableFuture
          format= 'YYYY.MM.DD'
          maxDate={dayjs(new Date())}
          views={['year', 'month', 'day']}
        />
      </LocalizationProvider>
      <TextField
        name='reference'
        label='Reference'
        size='small'
        sx={{ margin :1 }}
        value={formData.reference}
        onChange={handleInputChange}
      />
      <TextField
        name='description'
        label='Description'
        size='small'
        sx={{ margin :1 ,  minWidth: '200px' }}
        value={formData.description}
        onChange={handleInputChange}
      />
      <FormControl>
        <Stack direction={'row'}>
          <InputLabel>Status</InputLabel>
          <Select
            name='status'
            value={formData.status}
            label='Status'
            size='small'
            sx={{ margin :1 }}
            onChange={handleSelectChange}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Button variant='contained' color='primary' size='small' sx={{ margin: 1, height:'40px' }} onClick={updateStatus}>
          Update
          </Button>
        </Stack>
      </FormControl>
    </Grid>
  );
};

export default MaterialStatusUpdateForm;