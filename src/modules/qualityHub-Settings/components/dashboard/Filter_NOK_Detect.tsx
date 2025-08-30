import { useState } from 'react';
import { useQuery } from 'react-query';
import workShiftServices from '../../services/workShiftServices';
import { Autocomplete, Button, Checkbox, Grid, Paper, Stack, TextField } from '@mui/material';

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Product, WorkShift } from '../../../../types/QualityHubTypes';
import productServices from '../../services/productServices';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

interface FilterProps {
  closeFilter() : void;
}

const Filter_NOK_Detect = ({closeFilter}: FilterProps )=> {

  const [ filterParams, setFilterParams ] = useState(window.sessionStorage.getItem('NokDetectFilter') ? JSON.parse(window.sessionStorage.getItem('NokDetectFilter') || '{}') : {});

  const shiftList = useQuery('workShifts', workShiftServices.getShift,
    { refetchOnWindowFocus: false, retry: 1 });

  const productList = useQuery('productList', productServices.getProduct,
    { refetchOnWindowFocus: false, retry: 1 });

  const handleShiftChange = (_event: unknown, value: WorkShift[]) => {
    setFilterParams({ ...filterParams, shifts: JSON.stringify(value) });
  };

    const handleProductChange = (_event: unknown, value: Product[]) => {
    setFilterParams({ ...filterParams, products: JSON.stringify(value) });
  };

  const timeFromHandler = (newValue: dayjs.Dayjs | null) => {
    setFilterParams({ ...filterParams, time_from: newValue ? newValue.toISOString() : null });
  }

  const timeUntilHandler = (newValue: dayjs.Dayjs | null) => {
    setFilterParams({ ...filterParams, time_until: newValue ? newValue.toISOString() : null });
  }

  const clearFilter = () => {
    setFilterParams({});
    window.sessionStorage.removeItem('NokDetectFilter');
    closeFilter();
  }

  const saveFilter = () => {
    window.sessionStorage.setItem('NokDetectFilter', JSON.stringify(filterParams));
    closeFilter();
  }

  return (
    <Paper elevation={11} style={{ padding: '2px', width: '500px', position: 'absolute', backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={2} alignContent={'start'}>  
        <Grid item xs={5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              name='time_from'
              label='From'
              viewRenderers={{
                seconds: null
              }}
              value={filterParams.time_from ? dayjs(filterParams.time_from) : null}
              onChange={(newValue) => timeFromHandler(newValue)}
              sx={{ marginTop: 1, marginLeft: 1 , width: '195px','& .MuiInputBase-root': { height: '40px' } }}
              disableFuture
              format= 'YYYY.MM.DD  HH:mm'
              maxDate={dayjs(new Date())}
            />
            </LocalizationProvider>
        </Grid>
        <Grid item xs={5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              name='time_until'
              label='Until  '
              viewRenderers={{
                seconds: null
              }}
              value={filterParams.time_until ? dayjs(filterParams.time_until) : null}
              onChange={(newValue) => timeUntilHandler(newValue)}
              sx={{ marginTop: 1, marginLeft: 2, width: '195px','& .MuiInputBase-root': { height: '40px' } }}
              disableFuture
              format= 'YYYY.MM.DD  HH:mm'
              maxDate={dayjs(new Date())}
            />
            </LocalizationProvider>
        </Grid>        
        <Grid item mt={1} >
          <Autocomplete
            multiple
            id='shifts'
            options={shiftList?.data || []}
            disableCloseOnSelect
            value={filterParams?.shifts ? JSON.parse(filterParams.shifts) : []}
            onChange={handleShiftChange}
            getOptionLabel={(option) => option.shiftName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, { selected }) => {
              return (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                  {option.shiftName}
                </li>
              );
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Shift'
                placeholder='Shifts'
                size='small'
                sx={{ width: '480px' , marginLeft: 1 }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            multiple
            id='products'
            options={productList?.data || []}
            disableCloseOnSelect
            value={filterParams?.products ? JSON.parse(filterParams.products) : []}
            onChange={handleProductChange}
            getOptionLabel={(option) => option.productName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, { selected }) => {
              return (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.productName}
                </li>
              );
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='products'
                placeholder='Products'
                size='small'
                sx={{ width: '480px', marginLeft: 1 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} m={1}>
          <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
            <Button variant="outlined" size="small" onClick={() => clearFilter()}>Cancel</Button>
            <Button variant="outlined" size="small" onClick={() => saveFilter()}>Set Filter</Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Filter_NOK_Detect;