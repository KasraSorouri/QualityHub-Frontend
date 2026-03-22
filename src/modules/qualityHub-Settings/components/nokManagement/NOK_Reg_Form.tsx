/* eslint-disable react-hooks/exhaustive-deps */
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
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import {
  NokData,
  NewNokData,
  NokCode,
  Station,
  WorkShift,
  Product,
  NokStatus,
  ProductStatus,
  IImageData,
} from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import productServices from '../../services/productServices';
import { useQuery } from 'react-query';
import stationServices from '../../services/stationServices';
import nokCodeServices from '../../services/nokCodeServices';
import workShiftServices from '../../services/workShiftServices';
import nokDetectServices from '../../services/nokDetectServices';
import ImageFileUploader from './NOK_Images_Upload_Form';
import ImageListView from './ImageListView';

type NokFromProps = {
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokData?: NokData | NewNokData | null;
};

type FormData = {
  nokId: number | undefined;
  product: Product | null;
  productSN: string;
  initNokCode: NokCode | null;
  detectedStation: Station | null;
  detectedShift: WorkShift | null;
  detectTime: Dayjs;
  description: string;
};

const NokForm = ({ nokData, formType }: NokFromProps) => {
  const submitTitle = formType === 'ADD' ? 'Add NOK' : 'Update NOK';
  const [openfileUpload, setOpenFileUpload] = useState<boolean>(false);
  const [nokImages, setNokImages] = useState<IImageData[]>([]);

  const initFormValues: FormData = {
    nokId: nokData?.id,
    product: nokData?.product ? nokData.product : null,
    productSN: nokData ? nokData.productSN : '',
    initNokCode: nokData?.initNokCode ? nokData.initNokCode : null,
    detectedStation: nokData?.detectedStation ? nokData.detectedStation : null,
    detectedShift: nokData?.detectedShift ? nokData.detectedShift : null,
    detectTime: nokData?.detectTime ? dayjs(nokData.detectTime) : dayjs(new Date()),
    description: nokData ? nokData.description : '',
  };

  const [formValues, setFormValues] = useState<FormData>(initFormValues);

  useEffect(() => {
    setFormValues(initFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType, nokData]);

  // Get Production List
  const productResults = useQuery('productions', productServices.getProduct, { refetchOnWindowFocus: false });
  const productList: Product[] = productResults.data || [];

  // get Station List
  const stationResults = useQuery('stations', stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  // Get NOK Code List
  const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });
  const nokCodeList: NokCode[] = nokCodeResults.data || [];

  // Get Work Shift List
  const workShiftResults = useQuery('workShifts', workShiftServices.getShift, { refetchOnWindowFocus: false });
  const workShiftList: WorkShift[] = workShiftResults.data || [];

  // handle Changes
  const handleChange = (event: { target: { name: string; value: unknown; checked: boolean } }) => {
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

  const timeHandler = (value: Dayjs | null) => {
    if (value) {
      setFormValues((prevValues: FormData) => ({
        ...prevValues,
        detectedTime: value,
      }));
    }
  };

  // Register NOK
  const registerNok = async() : Promise<NokData> => {
    if (
      formValues.product &&
        formValues.initNokCode &&
        formValues.detectedStation &&
        formValues.detectedShift &&
        formValues.detectTime
    ) {
      const newNokData: NewNokData = {
        productId: formValues.product.id,
        productSN: formValues.productSN,
        initNokCodeId: formValues.initNokCode.id,
        detectStationId: formValues.detectedStation.id,
        detectShiftId: formValues.detectedShift.id,
        detectTime: new Date(formValues.detectTime.toISOString()),
        description: formValues.description,
        nokStatus: NokStatus.PENDING,
        productStatus: ProductStatus.NOK,
        removeReport: false,
      };

      const result = await nokDetectServices.createNokDetect(newNokData);
      return result;
    } else {
      throw new Error('Missing data');
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await registerNok();
  };

  // Handle Upload Images
  const handleFileUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!formValues.nokId) {
      // Check for Required Field
      const form = event.currentTarget.form;
      if (form && form.reportValidity()) {
        const result = await registerNok();
        setFormValues(prevValues => ({
          ...prevValues,
          nokId: result.id
        }));
        setOpenFileUpload(true);
      }
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container direction={'column'} sx={{ background: '#9FEAF7' }}>
          <Grid container width={'100%'} flexDirection={'row'} marginTop={1}>
            <Autocomplete
              id="product"
              sx={{ marginLeft: 2, marginTop: 1, width: '20%', minWidth: '180px' }}
              size="small"
              disabled={formType === 'VIEW'}
              aria-required
              options={productList}
              isOptionEqualToValue={(option: Product, value: Product) => option.id === value.id}
              value={formValues.product ? formValues.product : null}
              onChange={(_event, newValue) => newValue && handleAutoCompeletChange('product', newValue)}
              getOptionLabel={(option: { productName: string }) => option.productName}
              renderInput={(
                params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                    OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                    'variant'
                  >,
              ) => <TextField {...params} label="Product" placeholder="Product" size="small" required />}
            />
            <TextField
              id="productSN"
              name="productSN"
              label="Product SN"
              disabled={formType === 'VIEW'}
              sx={{ marginLeft: 2, marginTop: 1, width: '20%', minWidth: '180px' }}
              value={formValues.productSN}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              size="small"
              required
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                name="detectedTime"
                label="Detect Time"
                disabled={formType === 'VIEW'}
                viewRenderers={{
                  seconds: null,
                }}
                value={formValues.detectTime}
                onChange={(newValue) => timeHandler(newValue)}
                sx={{ marginLeft: 2, marginTop: 1, width: '210px', '& .MuiInputBase-root': { height: '40px' } }}
                disableFuture
                format="YYYY.MM.DD    HH:mm"
                maxDate={dayjs(new Date())}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container width={'100%'} flexDirection={'row'}>
            <Autocomplete
              id="detectedStation"
              sx={{ marginLeft: 2, marginTop: 1, width: '20%', minWidth: '200px' }}
              size="small"
              aria-required
              disabled={formType === 'VIEW'}
              options={stationList}
              isOptionEqualToValue={(option: Station, value: Station) => option.stationName === value.stationName}
              value={formValues.detectedStation ? formValues.detectedStation : null}
              onChange={(_event, newValue) => newValue && handleAutoCompeletChange('detectedStation', newValue)}
              getOptionLabel={(option: { stationName: string }) => option.stationName}
              renderInput={(
                params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                    OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                    'variant'
                  >,
              ) => <TextField {...params} label="Station" placeholder="Add Station" size="small" required />}
            />
            <Autocomplete
              id="initNokCode"
              sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth: '150px' }}
              size="small"
              aria-required
              disabled={formType === 'VIEW'}
              options={nokCodeList}
              isOptionEqualToValue={(option: NokCode, value: NokCode) => option.nokCode === value.nokCode}
              value={formValues.initNokCode ? formValues.initNokCode : null}
              onChange={(_event, newValue) => newValue && handleAutoCompeletChange('initNokCode', newValue)}
              getOptionLabel={(option: { nokCode: string }) => option.nokCode}
              renderInput={(
                params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                    OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                    'variant'
                  >,
              ) => <TextField {...params} label="NOK Code" placeholder="NOK Code" size="small" required />}
            />
            <Autocomplete
              id="detectedShift"
              sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth: '140px' }}
              size="small"
              aria-required
              disabled={formType === 'VIEW'}
              options={workShiftList}
              isOptionEqualToValue={(option: WorkShift, value: WorkShift) => option.shiftName === value.shiftName}
              value={formValues.detectedShift ? formValues.detectedShift : null}
              onChange={(_event, newValue) => newValue && handleAutoCompeletChange('detectedShift', newValue)}
              getOptionLabel={(option: { shiftName: string }) => option.shiftName}
              renderInput={(
                params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                    OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                    'variant'
                  >,
              ) => <TextField {...params} label="Shift" placeholder="Shift" size="small" required />}
            />
            <Button
              variant="contained"
              type='button'
              color="primary"
              size="small"
              onClick={(event) => handleFileUpload(event)}
              sx={{ margin: 1, marginLeft: 1, width: 'auto', height: '38px', alignSelf: 'flex-end' }}
              disabled={formType === 'VIEW'}
            >ADD Picture</Button>
          </Grid>
          <Grid display={'flex'} marginBottom={1}>
            <TextField
              id="description"
              name="description"
              label="Description"
              disabled={formType === 'VIEW'}
              sx={{ marginLeft: 2, marginTop: 1, width: '55%' }}
              multiline
              value={formValues.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              size="small"
            />
            {formType !== 'VIEW' && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                sx={{ margin: 1, marginLeft: 1, width: 'auto', height: '38px', alignSelf: 'flex-end' }}
              >
                {submitTitle}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
      <Divider />
      <ImageListView imagesData={nokImages} />
      <Dialog open={openfileUpload} onClose={() => setOpenFileUpload(false)} fullWidth maxWidth='md'>
        <DialogTitle>Upload Images</DialogTitle>
        <Divider />
        <DialogContent>
          <ImageFileUploader  nokId={nokData?.id||0} qualityStatus='NOK' nokCode={nokData?.initNokCode?.id || 0} station={nokData?.detectedStation?.id || 0} closeForm={setOpenFileUpload}  setNokImages={setNokImages} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NokForm;
