import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Checkbox
} from  '@mui/material';
import { NokStatus } from '../../../../types/QualityHubTypes';

type AnalyzeStatus = {
	analyseStatus: NokStatus;
	removeFromReportStatus: boolean;
}

type NokStatusProps = {
  status: AnalyzeStatus;
  updateStatus: (status: AnalyzeStatus) => void;
}

const NokAnalyseStatusForm = ({ status, updateStatus} : NokStatusProps) => {


  const handleStatusChange = (value: NokStatus) => {
    const newStatus: AnalyzeStatus = {
      analyseStatus: value,
      removeFromReportStatus: status.removeFromReportStatus
    };
    updateStatus(newStatus);
  };

  const handleRemoveFromReportChange = () => {
    const newStatus: AnalyzeStatus = {
      analyseStatus: status.analyseStatus,
      removeFromReportStatus: !status.removeFromReportStatus
    };
    updateStatus(newStatus);
  };

  return (
    <Box sx={{ display: 'flex', width: 300,  border: 1, borderColor: 'grey.500', borderRadius: 1, paddingLeft: 1 }}>
      <Stack direction='column' >

    <RadioGroup
      name='analyseStatus'
      value={status}
      onChange={(_event, value) => handleStatusChange(value as NokStatus)}
      sx={{ gap: 0 }}
    >
      <Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: 18 }}>
        Analyse Status:
      </Typography>
      <FormControlLabel value={NokStatus.ANALYSED} checked={status.analyseStatus === 'ANALYSED'} control={<Radio />} label='Analyse is done' />
      <FormControlLabel value={NokStatus.NEED_INVESTIGATION} checked={status.analyseStatus === 'NEED INVESTIGATION'} control={<Radio />} label='More investigation should be done' sx={{ marginTop: -1}} />
      <FormControlLabel value={NokStatus.NOT_FOUND} checked={status.analyseStatus === 'NOT FOUND'} control={<Radio />} label='Nok did not found' sx={{ marginTop: -1}} />
     
    </RadioGroup>
    <FormControlLabel 
      control={<Checkbox checked={status.removeFromReportStatus} />}
      onChange={handleRemoveFromReportChange}
      label='Remove Nok from the reports' 
      sx={{ marginTop: -1}} />
    </Stack>
  </Box>
  );
}

export default NokAnalyseStatusForm;
