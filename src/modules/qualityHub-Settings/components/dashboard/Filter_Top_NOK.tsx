import { useState } from 'react';
import { useQuery } from 'react-query';

import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import productServices from '../../services/productServices';
import workShiftServices from '../../services/workShiftServices';

import { Product, WorkShift } from '../../../../types/QualityHubTypes';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

interface FilterProps {
  closeFilter() : void;
  applyFilter(apply: boolean) : void;
}

const Filter_NOK_Detect = ({ closeFilter, applyFilter }: FilterProps ) => {

  const [ filterParams, setFilterParams ] = useState(window.sessionStorage.getItem('TopNokFilter') ? JSON.parse(window.sessionStorage.getItem('TopNokFilter') || '{}') : {});

  const shiftList = useQuery('workShifts', workShiftServices.getShift,
    { refetchOnWindowFocus: false, retry: 1 });

  const productList = useQuery('productList', productServices.getProduct,
    { refetchOnWindowFocus: false, retry: 1 });

  const handleTopN = (newValue: string) => {
    setFilterParams({ ...filterParams, topN: newValue });
  };

  const handleShiftChange = (_event: unknown, value: WorkShift[]) => {
    setFilterParams({ ...filterParams, shifts: JSON.stringify(value) });
  };

  const handleProductChange = (_event: unknown, value: Product[]) => {
    setFilterParams({ ...filterParams, products: JSON.stringify(value) });
  };

  const timeFromHandler = (newValue: dayjs.Dayjs | null) => {
    setFilterParams({ ...filterParams, time_from: newValue ? newValue.toISOString() : null });
  };

  const timeUntilHandler = (newValue: dayjs.Dayjs | null) => {
    setFilterParams({ ...filterParams, time_until: newValue ? newValue.toISOString() : null });
  };

  const clearFilter = () => {
    setFilterParams({});
    window.sessionStorage.removeItem('TopNokFilter');
    applyFilter(true);
    closeFilter();
  };

  const saveFilter = () => {
    window.sessionStorage.setItem('TopNokFilter', JSON.stringify(filterParams));
    applyFilter(true);
    closeFilter();
  };

  return (
    <Dialog open={true}>
      <DialogTitle variant='h5' fontWeight={'bold'} align='center' >
          Set Filters
      </DialogTitle>
      <Grid container spacing={1} alignContent={'start'} direction={'row'}>
        <Grid item xs={2} marginTop={1}>
          <Typography variant='h6' fontWeight={'bold'} align='right'>
            Top:
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            name='topN'
            label='Top N'
            datatype='Number'
            defaultValue={10}
            size='small'
            onChange={(newValue) => handleTopN(newValue.target.value) }
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} alignContent={'start'} direction={'row'}>
        <Grid item xs={2} marginTop={1}>
          <Typography variant='h6' fontWeight={'bold'} align='right'>
            Time:
          </Typography>
        </Grid>
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
              sx={{ marginTop: 1, marginLeft: 0 , width: '195px','& .MuiInputBase-root': { height: '40px' } }}
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
              sx={{ marginTop: 1, marginLeft: 1, width: '195px','& .MuiInputBase-root': { height: '40px' } }}
              disableFuture
              format= 'YYYY.MM.DD  HH:mm'
              maxDate={dayjs(new Date())}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container spacing={1} alignContent={'start'} direction={'row'}>
        <Grid item xs={2} marginTop={1}>
          <Typography variant='h6' fontWeight={'bold'} align='right'>
            Shift:
          </Typography>
        </Grid>
        <Grid item xs={10} mt={1} >
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
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Shift'
                placeholder='Shifts'
                size='small'
                sx={{ width: '430px' , marginLeft: 0 }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} alignContent={'start'} direction={'row'}>
        <Grid item xs={2} marginTop={1}>
          <Typography variant='h6' fontWeight={'bold'} align='right'>
            product:
          </Typography>
        </Grid>
        <Grid item xs={10} mt={1} >
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
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='products'
                placeholder='Products'
                size='small'
                sx={{ width: '430px', marginLeft: 0 }}
              />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
          <Button variant="outlined" size="small" onClick={() => closeFilter()}>Cancel</Button>
          <Button variant="outlined" size="small" onClick={() => clearFilter()}>Clear filter</Button>
          <Button variant="outlined" size="small" onClick={() => saveFilter()}>Set Filter</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default Filter_NOK_Detect;