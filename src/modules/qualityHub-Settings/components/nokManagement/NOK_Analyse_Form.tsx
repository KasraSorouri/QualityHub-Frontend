import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import NOK_Reg_Form from './NOK_Reg_Form';
import RCAs_Form from './RCAs_Form';
import NokReworkForm from './NOK_Rework_Form';
import NokStatusIndicator from './NokStatusIndicator';
import NokAnalyseStatusForm from './NOK_Analyse_Status_Form';
import NokCostForm from './NOK_Cost_Form';

import stationServices from '../../services/stationServices';
import nokCodeServices from '../../services/nokCodeServices';
import workShiftServices from '../../services/workShiftServices';
import nokDetectServices from '../../services/nokDetectServices';
import nokrcaServices from '../../services/nokRcaServices';
import nokRcaServices from '../../services/nokRcaServices';
import nokAnalyseServices from '../../services/nokAnalyseServices';
import classCodeServices from '../../services/classCodeServices';

import {
  NokCode,
  Station,
  WorkShift,
  Product,
  NokAnalyseData,
  NewNokAnalyseData,
  NokData,
  RCA,
  NewRca,
  NokCodeS,
  ClassCode,
  NokStatus,
  IImageData,
} from '../../../../types/QualityHubTypes';

import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ImageFileUploader from '../imageView/NOK_Images_Upload_Form';
import ImageAnalyse from './imageAnalyse/ImageAnalyse';

type NokFromProps = {
  nokId: number;
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokAnalyseData?: NokAnalyseData | null;
  removeNok: (nok: null) => void;
};

type AnalyzeStatus = {
  analyseStatus: NokStatus;
  removeFromReportStatus: boolean;
};

type FormData = {
  nokCode: NokCodeS | null;
  causeStation: Station | null;
  causeShift: WorkShift | null;
  classCode: ClassCode | null;
  description: string;
  timeWaste?: number;
  materialWaste?: number;
  closed: boolean;
  costData?: { [key: string]: number };
  reworkStatus?: string;
};

const compactTextFieldSx = {
  '& .MuiInputBase-root': {
    minHeight: 36,
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 10px',
  },
};

const compactAutocompleteSx = {
  ...compactTextFieldSx,
  '& .MuiAutocomplete-inputRoot': {
    paddingTop: '1px !important',
    paddingBottom: '1px !important',
    paddingRight: '36px !important',
  },
  '& .MuiAutocomplete-input': {
    padding: '6px 4px !important',
  },
  '& .MuiAutocomplete-endAdornment': {
    right: 6,
  },
};

const compactAutocompleteListboxSx = {
  '& .MuiAutocomplete-option': {
    minHeight: 34,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
};

const NokAnalyseForm = ({ nokId, nokAnalyseData, formType, removeNok }: NokFromProps) => {

  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initFormValues: FormData = {
    nokCode: nokAnalyseData?.nokCode || null,
    causeStation: nokAnalyseData?.causeStation || null,
    causeShift: nokAnalyseData?.causeShift || null,
    classCode: nokAnalyseData?.classCode || null,
    description: nokAnalyseData ? nokAnalyseData.description : '',
    closed: nokAnalyseData ? nokAnalyseData.closed : false,
    costData: nokAnalyseData?.costResult,
  };

  const initAnalyseStatus: AnalyzeStatus = {
    analyseStatus: NokStatus.PENDING,
    removeFromReportStatus: false,
  };

  const [formValues, setFormValues] = useState<FormData>(initFormValues);
  const [nok, setNok] = useState<NokData | null>(null);
  const [showReworkForm, setShowReworkForm] = useState<boolean>(false);
  const [showCostForm, setShowCostForm] = useState<boolean>(false);
  const [status, setStatus] = useState<AnalyzeStatus>(initAnalyseStatus);

  const [openImagesUpload, setOpenImagesUpload] = useState<{ show: boolean , qualityStatus: 'OK' | 'NOK' }>({show:false, qualityStatus: 'NOK'});
  const [openImages, setOpenImages] = useState<boolean>(false)
  const [nokImages, setNokImages] = useState<IImageData[]>([]);


  console.log('nok images', nokImages)
  

  useEffect(() => {
    const getInitData = async () => {
      const nokResult = await nokDetectServices.getNokDetectById(nokId);
      setNok(nokResult);
      const analyseResults = await nokAnalyseServices.getNokAnalyseByNokId(nokId);
      const newFormValue: FormData = {
        nokCode: analyseResults.nokCode,
        causeStation: analyseResults.causeStation,
        causeShift: analyseResults.causeShift,
        classCode: analyseResults.classCode,
        description: analyseResults.description,
        closed: analyseResults.closed,
        costData: analyseResults.costResult,
        reworkStatus: nokResult.productStatus,
      };

      setFormValues(newFormValue);

      setStatus({
        analyseStatus: nokResult.nokStatus,
        removeFromReportStatus: nokResult.removeReport ? nokResult.removeReport : false,
      });
    };
    getInitData();
  }, [nokId]);

  // Get RCAs for NOK ID
  const rcaResults = useQuery(['rcas', nokId], () => nokrcaServices.getNokRcaByNokId(nokId), {
    refetchOnWindowFocus: false,
  });
  let rcaList: RCA[] = rcaResults.data || [];

  // get Station List
  const stationResults = useQuery('stations', stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  // Get NOK Code List
  const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });
  const nokCodeList: NokCode[] = nokCodeResults.data || [];

  // Get Work Shift List
  const workShiftResults = useQuery('workShifts', workShiftServices.getShift, { refetchOnWindowFocus: false });
  const workShiftList: WorkShift[] = workShiftResults.data || [];

  // Get Nok Class Code List
  const nokClassCodeResults = useQuery('nokClassCodes', classCodeServices.getClassCode, {
    refetchOnWindowFocus: false,
  });
  const nokClassCodeList: ClassCode[] = nokClassCodeResults.data || [];

  // handle Changes
  const handleChange = (event: { target: { name: string; value: unknown; checked: boolean } }) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleAutoCompeletChange = (
    parameter: string,
    newValue: Product | Station | WorkShift | NokCodeS | ClassCode,
  ) => {
    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };

  const handleUpdateRCA = async (rca: NewRca): Promise<boolean> => {
    try {
      const result = await nokRcaServices.createNokRca(rca);
      rcaList = rcaList.concat(result);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Update Analyse Status
  const analyseStatusHandler = async () => {
    await nokAnalyseServices.updateStatus(nokId, status);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (
      formType === 'ADD' &&
      formValues.nokCode &&
      formValues.causeStation &&
      formValues.causeShift &&
      formValues.classCode
    ) {
      const newNokAnalyse: NewNokAnalyseData = {
        id: nokAnalyseData?.id,
        nokId: nokId,
        nokCodeId: formValues.nokCode.id,
        causeStationId: formValues.causeStation.id,
        causeShiftId: formValues.causeShift.id,
        classCodeId: formValues.classCode.id,
        description: formValues.description,
        closed: formValues.closed,
      };
      await nokAnalyseServices.createNokAnalyse(newNokAnalyse);
    }
  };

  const nokStatus = {
    rcaStatus: rcaList.length > 0 ? 'OK' : undefined,
    costStatus:
      formValues.costData &&
      (formValues.costData.issue === 1 ? 'SomeIssues' : formValues.costData.IQC > 0 ? 'IQC' : 'OK'),
    reworkStatus: formValues.reworkStatus,
    analyseStatus: formValues.nokCode ? 'OK' : undefined,
    claimStatus:
      formValues.costData &&
      (formValues.costData.approved > 0
        ? 'Accepted'
        : formValues.costData.pendding > 0
          ? 'Pending'
          : formValues.costData.rejected > 0
            ? 'Rejected'
            : undefined),
    removedFromReport: status.removeFromReportStatus,
  };

  const closeAnalysePermision = nokStatus.rcaStatus === 'OK' && nokStatus.analyseStatus === 'OK';

  // Handle NOK Images Upload
  const handleNokImageUpload = () => {
    setOpenImagesUpload({show:true, qualityStatus: 'NOK'});
  }

  // Handle Ok Images Upload
  const handleOkImageUpload = () => {
    setOpenImagesUpload({show:true, qualityStatus: 'OK'});
  }
  
  return (
    <Grid container direction={'column'}>
      <Grid container direction={'row'}>
        <Grid item xs={6}>
          <Grid item marginLeft={1} sx={{ background: '#9FEAF7' }}>
            <Typography variant="h5" marginLeft={1}>
              Detect Information
            </Typography>
            <NOK_Reg_Form formType={'VIEW'} nokData={nok} />
          </Grid>
          <Divider sx={{ margin: 1 }} />
          <Grid item sx={{ background: '#FEC0D4', marginLeft: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.5, pt: 1.5 }}
            >
              <Typography variant="h5">
                Origin of NOK
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  sx={{ height: '38px', minWidth: '38px', backgroundColor:'#50fc50' }}
                  onClick={handleOkImageUpload}
                  title='Add OK Images'
                >
                  <AddAPhotoIcon />
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  sx={{ height: '38px', minWidth: '38px', backgroundColor:'#fc5050' }}
                  onClick={handleNokImageUpload}
                  title='Add NOK Images'
                >
                  <AddAPhotoIcon />
                </Button>
                <Button
                  type="submit"
                  form="nok-analyse-form"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ height: '38px' }}
                >
                  {submitTitle}
                </Button>
              </Stack>
            </Stack>
            <Box px={1.5} pb={1.5} pt={1}>
              <form id="nok-analyse-form" onSubmit={handleSubmit}>
                <Grid container spacing={0.75} alignItems="center">
                  <Grid item xs={12}>
                    <Grid container spacing={0.75}>
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          id="causeStation"
                          sx={compactAutocompleteSx}
                          size="small"
                          aria-required
                          options={stationList}
                          ListboxProps={{ sx: compactAutocompleteListboxSx }}
                          isOptionEqualToValue={(option: Station, value: Station) =>
                            option.stationName === value.stationName
                          }
                          value={formValues.causeStation ? formValues.causeStation : null}
                          onChange={(_event, newValue) => newValue && handleAutoCompeletChange('causeStation', newValue)}
                          getOptionLabel={(option: { stationName: string }) => option.stationName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Station"
                              placeholder="Add Station"
                              size="small"
                              required
                              sx={compactTextFieldSx}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          id="nokCode"
                          sx={compactAutocompleteSx}
                          size="small"
                          aria-required
                          options={nokCodeList}
                          ListboxProps={{ sx: compactAutocompleteListboxSx }}
                          isOptionEqualToValue={(option: NokCodeS, value: NokCodeS) => option.nokCode === value.nokCode}
                          value={formValues.nokCode ? formValues.nokCode : null}
                          onChange={(_event, newValue) => newValue && handleAutoCompeletChange('nokCode', newValue)}
                          getOptionLabel={(option: { nokCode: string }) => option.nokCode}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="NOK Code"
                              placeholder="NOK Code"
                              size="small"
                              required
                              sx={compactTextFieldSx}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          id="causeShift"
                          sx={compactAutocompleteSx}
                          size="small"
                          aria-required
                          options={workShiftList}
                          ListboxProps={{ sx: compactAutocompleteListboxSx }}
                          isOptionEqualToValue={(option: WorkShift, value: WorkShift) =>
                            option.shiftName === value.shiftName
                          }
                          value={formValues.causeShift ? formValues.causeShift : null}
                          onChange={(_event, newValue) => newValue && handleAutoCompeletChange('causeShift', newValue)}
                          getOptionLabel={(option: { shiftName: string }) => option.shiftName}
                          renderInput={(params) => (
                            <TextField {...params} label="Shift" placeholder="Shift" size="small" required sx={compactTextFieldSx} />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          id="classCode"
                          sx={compactAutocompleteSx}
                          size="small"
                          aria-required
                          options={nokClassCodeList}
                          ListboxProps={{ sx: compactAutocompleteListboxSx }}
                          isOptionEqualToValue={(option: ClassCode, value: ClassCode) =>
                            option.classCode === value.classCode
                          }
                          value={formValues.classCode ? formValues.classCode : null}
                          onChange={(_event, newValue) => newValue && handleAutoCompeletChange('classCode', newValue)}
                          getOptionLabel={(option: { className: string }) => option.className}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Class Code"
                              placeholder="Class Code"
                              size="small"
                              required
                              sx={compactTextFieldSx}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="description"
                          name="description"
                          label="Description"
                          value={formValues.description}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                          fullWidth
                          size="small"
                          sx={compactTextFieldSx}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Stack direction={'row'} spacing={0} marginTop={1} marginLeft={1}>
            <NokAnalyseStatusForm
              status={status}
              closeAnalysePermision={closeAnalysePermision}
              updateStatus={setStatus}
            />
            <Box marginLeft={2}>
              <Typography variant='body1'>Dismantled Material Cost</Typography>
              <Table size="small" sx={{ maxWidth: '250px', marginTop: 1 }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: 'red' }}>SCRAPPED</TableCell>
                    <TableCell sx={{ color: 'red' }}>{formValues.costData?.SCRAPPED}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'orange' }}>IQC</TableCell>
                    <TableCell sx={{ color: 'orange' }}>{formValues.costData?.IQC}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'green' }}>OK</TableCell>
                    <TableCell sx={{ color: 'green' }}>{formValues.costData?.OK}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'blue' }}>CLAIMED</TableCell>
                    <TableCell sx={{ color: 'blue' }}>{formValues.costData?.CLAIMABLE}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box>
              <NokStatusIndicator status={nokStatus} />
            </Box>
            <Stack direction={'column'} spacing={1} marginLeft={2}>
              <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => setShowReworkForm(true)}>
              Rework
              </Button>
              <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => setShowCostForm(true)}>
              Calculate Cost
              </Button>
              <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => analyseStatusHandler()}>
              Update Status
              </Button>
              <Button
                onClick={() => removeNok(null)}
                variant="contained"
                color="primary"
                size="small"
                sx={{ margin: 1, marginLeft: 1, width: 'auto', height: '38px' }}
              >
              Back
              </Button>
              <Button
                onClick={() => setOpenImages(true)}
                variant="contained"
                color="primary"
                size="small"
                sx={{ margin: 1, marginLeft: 1, width: 'auto', height: '38px' }}
              >Images
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ margin: 1 }} />
      <Typography variant="h5" marginLeft={1}>
        Root Cause Analysis
      </Typography>
      <Grid marginLeft={1}>
        <RCAs_Form nokId={nokId} formType={'ADD'} rcas={rcaList} updateRCA={handleUpdateRCA} />
      </Grid>
      <Dialog
        open={showReworkForm}
        fullWidth
        maxWidth="xl"
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle>
          Rework Form
          <IconButton
            aria-label="close"
            onClick={() => setShowReworkForm(false)}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <NokReworkForm nokId={nokId} formType={'ADD'} removeNok={() => console.log()} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={showCostForm}
        fullWidth
        maxWidth="xl"
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle>
          Cost Form
          <IconButton
            aria-label="close"
            onClick={() => setShowCostForm(false)}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <NokCostForm nokId={nokId} formType={'ADD'} readonly={false} />
        </DialogContent>
        </Dialog>
        <Dialog
          open={openImagesUpload.show}
          onClose={() => setOpenImagesUpload({ show: false, qualityStatus: openImagesUpload.qualityStatus })}
          fullWidth
          maxWidth='md'
        >
        <DialogTitle>Upload Images</DialogTitle>
        <Divider />
        <DialogContent>
          <ImageFileUploader
            nokId={nokId}
            qualityStatus={openImagesUpload.qualityStatus}
            nokCode={formValues.nokCode?.id || 0}
            station={formValues.causeStation?.id || 0}
            closeForm={(show, qualityStatus) => setOpenImagesUpload({ show, qualityStatus })}
            setNokImages={setNokImages}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openImages} onClose={() => setOpenImages(false)} fullWidth maxWidth={'xl'}>
          <ImageAnalyse nokId={nokId} closeWindow={() => setOpenImages(false)}/>
      </Dialog>
    </Grid>
  );
};
export default NokAnalyseForm;
