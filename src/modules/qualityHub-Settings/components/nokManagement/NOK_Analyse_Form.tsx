import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FilledTextFieldProps,
  Grid,
  IconButton,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography
} from '@mui/material';

import { NokCode, Station, WorkShift, Product, NokAnalyseData, NewNokAnalyseData, NokData, RCA } from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import stationServices from '../../services/stationServices';
import nokCodeServices from '../../services/nokCodeServices';
import workShiftServices from '../../services/workShiftServices';
import nokDetectServices from '../../services/nokDetectServices';
import NOK_Reg_Form from './NOK_Reg_Form';
import RCAs_Form from './RCAs_Form';
import NokReworkForm from './NOK_Rework_Form';

import CloseIcon from "@mui/icons-material/Close";
import NokCostForm from './NOK_Cost_Form';

type NokFromProps = {
  nokId: number,
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokAnalyseData?: NokAnalyseData | NewNokAnalyseData  | null;
  removeNok: (nok: null) => void;
}

type FormData = {
  nokCode: NokCode | null;
  causeStation: Station | null;
  causeShift: WorkShift | null;
  description: string;
  timeWaste?: number;
  materialWaste?: number;
  closed: boolean;
}

const NokAnalyseForm = ({ nokId, nokAnalyseData, formType, removeNok }: NokFromProps) => {
  console.log('nok ID ->', nokId);
  console.log('** nok anaylzie DATA->', nokAnalyseData);

  const fakeRCA : RCA[] | undefined = nokAnalyseData?.rcas

  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initFormValues: FormData = {
    nokCode: nokAnalyseData?.nokCode ? nokAnalyseData.nokCode : null,
    causeStation: nokAnalyseData?.causeStation ? nokAnalyseData.causeStation : null,
    causeShift: nokAnalyseData?.causeShift ? nokAnalyseData.causeShift : null,
    description: nokAnalyseData ? nokAnalyseData.description : '',
    closed: nokAnalyseData ? nokAnalyseData.closed : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ nok, setNok ] = useState<NokData | null>(null);
  const [ showReworkForm, setShowReworkForm ] = useState<boolean>(false)
  const [ showCostForm, setShowCostForm ] = useState<boolean>(false)


  console.log('NOK Analyse * NOK Data ->', nok);
  console.log('NOK Analyse * showReworkForm Data ->', showReworkForm);


  useEffect(() => {
    setFormValues(initFormValues);
    const getNokData = async () => {
      const result = await nokDetectServices.getNokDetectById(nokId);
      setNok(result);
    };
    getNokData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formType]);

  // get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  // Get NOK Code List
  const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });
  const nokCodeList: NokCode[] = nokCodeResults.data || [];

  // Get Work Shift List
  const workShiftResults = useQuery('workShifts', workShiftServices.getShift, { refetchOnWindowFocus: false });
  const workShiftList: WorkShift[] = workShiftResults.data || [];



  // handle Changes
  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleAutoCompeletChange = (parameter: string, newValue: Product | Station | WorkShift | NokCode) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };

  const handleUpdateRCA = (rcas: RCA[]) => {
    console.log(' *** NOK registeration * Update RCA * rcas -> ', rcas);
  };


  /*
  const timeHandler = (value: Dayjs | null) => {
    if (value) {
      setFormValues((prevValues: FormData) => ({
        ...prevValues,
        detectedTime: value,
      }));
    }
  };
  */

  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (formType === 'ADD') {

      console.log(' *** NOK registeration * Submit form * newNokData -> ',formValues);
      //console.log(' *** NOK registeration * Submit form * result -> ', result);

    } else {
      console.log(' *** NOK registeration * Submit form * Error -> ', 'Missing data');
    }
  };


  return (
    <Grid container direction={'column'}>
      <Grid container direction={'row'} >
        <Grid item xs ={7}>
          <Typography variant='h5' marginLeft={2}>
            Detect Information
          </Typography>
          <NOK_Reg_Form formType={'VIEW'} nokData={nok} />
        </Grid>
        <Grid item xs ={5}>
            <Button variant='contained' sx={{ marginLeft: 2 }} onClick={() => setShowReworkForm(true)}>
              Rework
            </Button>
            <Button variant='contained' sx={{ marginLeft: 2 }} onClick={() => setShowCostForm(true)}>
              Calculate Cost
            </Button>

          </Grid>
        </Grid>
      <Divider sx={{ margin:1 }}/>
      <Typography variant='h5' marginLeft={2}>
        Origin of NOK
      </Typography>
      <Box>
        <form onSubmit={handleSubmit} >
          <Grid container direction={'column'} sx={{ background: '#FEC0D4' }}>
            <Grid container width={'100%'} flexDirection={'row'} >
              <Autocomplete
                id='causeStation'
                sx={{ marginLeft: 2, marginTop: 1, width: '20%', minWidth: '200px' }}
                size='small'
                aria-required
                options={stationList}
                isOptionEqualToValue={
                  (option: Station, value: Station) => option.stationName === value.stationName
                }
                value={formValues.causeStation ? formValues.causeStation : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('causeStation', newValue)}
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
              <Autocomplete
                id='nokCode'
                sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth: '150px' }}
                size='small'
                aria-required
                options={nokCodeList}
                isOptionEqualToValue={
                  (option: NokCode, value: NokCode) => option.nokCode === value.nokCode
                }
                value={formValues.nokCode ? formValues.nokCode : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('nokCode', newValue)}
                getOptionLabel={(option: { nokCode: string; }) => option.nokCode}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='NOK Code'
                    placeholder='NOK Code'
                    size='small'
                    required
                  />
                )}
              />
              <Autocomplete
                id='causeShift'
                sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth:'140px' }}
                size='small'
                aria-required
                options={workShiftList}
                isOptionEqualToValue={
                  (option: WorkShift, value: WorkShift) => option.shiftName === value.shiftName
                }
                value={formValues.causeShift ? formValues.causeShift : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('causeShift', newValue)}
                getOptionLabel={(option: { shiftName: string; }) => option.shiftName}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='Shift'
                    placeholder='Shift'
                    size='small'
                    required
                  />
                )}
              />
            </Grid>
            <Grid display={'flex'}>
              <TextField
                id="description"
                name="description"
                label="Description"
                sx={{ marginLeft: 2, marginTop: 1 , width:'85%' }}
                value={formValues.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small'
              />
              <Button type='submit' variant='contained' color='primary' size='small' sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}>
                {submitTitle}
              </Button>
              <Button onClick={() => removeNok(null)} variant='contained' color='primary' size='small' sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}>
              Back
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Divider sx={{ margin:1 }}/>
      <Typography variant='h5' marginLeft={2} >
        Root Cause Analysis
      </Typography>
      <RCAs_Form formType={'ADD'} rcas={fakeRCA} updateRCA={handleUpdateRCA} />
      <Dialog open={showReworkForm}
              fullWidth
              maxWidth="xl"
              sx={{
                '& .MuiDialog-paper': {
                  minHeight: '400px', 
                  maxHeight: '80vh', 
                },
              }}
      >
      <DialogTitle>
          Rework Form
          <IconButton
            aria-label="close"
            onClick={ () => setShowReworkForm(false)}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <NokReworkForm nokId={nokId} formType={'ADD'} removeNok={function (nok: null): void {
          throw new Error('Function not implemented.');
        } } />
      </DialogContent>
      </Dialog>
      <Dialog open={showCostForm}
              fullWidth
              maxWidth="xl"
              sx={{
                '& .MuiDialog-paper': {
                  minHeight: '400px', 
                  maxHeight: '80vh', 
                },
              }}
      >
      <DialogTitle>
          Cost Form
          <IconButton
            aria-label="close"
            onClick={ () => setShowCostForm(false)}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <NokCostForm nokId={nokId} formType={'ADD'}  />
      </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default NokAnalyseForm;