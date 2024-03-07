import {
  Autocomplete,
  Box,
  Button,
  FilledTextFieldProps,
  Grid,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants
} from '@mui/material';

import { NewRca, RCA, RcaCode } from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import rcaCodeServices from '../../services/rcaCodeServices';

type NokFromProps = {
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokId: number;
  rcaData: RCA | null;
}

type FormData = {
  rcaCode: RcaCode | null;
  whCauseId?: number | string;
  whCauseName?: string;
  description?: string;
  improveSugestion?: string;
}

const RCA_Form = ({ nokId, rcaData, formType }: NokFromProps) => {

  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initFormValues: FormData = {
    rcaCode: rcaData ? rcaData.rcaCode : null,
    whCauseId: rcaData ? rcaData.whCauseId : '',
    whCauseName: rcaData ? rcaData.whCauseName : '',
    description: rcaData ? rcaData.description : '',
    improveSugestion: rcaData ? rcaData.improveSugestion : '',
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);

  useEffect(() => {
    setFormValues(initFormValues);
  },[formType,rcaData, nokId]);

  // Get RCA Code List
  const rcaCodeResults = useQuery('rcaCode', rcaCodeServices.getRcaCode, { refetchOnWindowFocus: false });
  const rcaCodeList: RcaCode[] = rcaCodeResults.data || [];

  // handle Changes
  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleAutoCompeletChange = (parameter: string, newValue: RcaCode) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };


  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (formType === 'ADD') {
      if (formValues.rcaCode) {
        const newRcaData: NewRca = {
          nokId: nokId,
          rcaCodeId: formValues.rcaCode.id,
          whCauseId: formValues.whCauseId,
          whCauseName: formValues.whCauseName,
          description: formValues.description,
          improveSugestion: formValues.improveSugestion,
        };

        //const result = await nokDetectServices.createNokDetect(newRcaData);
        console.log(' *** NOK registeration * Submit form * result -> ', newRcaData);

      } else {
        console.log(' *** NOK registeration * Submit form * Error -> ', 'Missing data');
      }
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} >
        <Grid container width={'100%'} flexDirection={'row'}  marginTop={1} bgcolor={'#B7FFB3'} >
          <Autocomplete
            id='rcaCode'
            sx={{ marginLeft: 2, marginTop: 1, width: '10%', minWidth: '80px' }}
            size='small'
            disabled={formType === 'VIEW'}
            aria-required
            options={rcaCodeList}
            isOptionEqualToValue={
              (option: RcaCode, value: RcaCode) => option.id === value.id
            }
            value={formValues.rcaCode ? formValues.rcaCode : null}
            onChange={(_event, newValue) => newValue && handleAutoCompeletChange('rcaCode',newValue)}
            getOptionLabel={(option: { rcaCode: string; }) => option.rcaCode}
            renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
              <TextField
                {...params}
                label='RCA Code'
                placeholder='RCA Code'
                size='small'
                required
              />
            )}
          />
          <TextField
            id="whCauseId"
            name="whCauseId"
            label="Wh Cause ID"
            disabled={formType === 'VIEW'}
            sx={{ marginLeft: 2, marginTop: 1, width: '10%', minWidth: '100px' }}
            value={formValues.whCauseId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            size='small'
            required
          />
          <TextField
            id="whCauseName"
            name="whCauseName"
            label="Wh Cause Name"
            disabled={formType === 'VIEW'}
            sx={{ marginLeft: 2, marginTop: 1, width: '10%', minWidth: '100px' }}
            value={formValues.whCauseName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            size='small'
            required
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            disabled={formType === 'VIEW'}
            sx={{ marginLeft: 2, marginTop: 1 , width:'50%' }}
            value={formValues.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            fullWidth
            size='small'
          />
          {formType !== 'VIEW' && <Button type='submit' variant='contained' color='primary' size='small' sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}>
            {submitTitle}
          </Button> }
        </Grid>
      </form>
    </Box>
  );
};

export default RCA_Form;