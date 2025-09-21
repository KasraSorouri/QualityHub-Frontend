import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import ContentPasteSearchTwoToneIcon from '@mui/icons-material/ContentPasteSearchTwoTone';
import TroubleshootTwoToneIcon from '@mui/icons-material/TroubleshootTwoTone';

import { Box, colors, Stack, Typography } from '@mui/material';

type NokStatusProps = {
	status: {
    reworkStatus?: string;
    rcaStatus?: string;
    analyseStatus?: string;
    costStatus?: string;
    claimStatus?: string;
    removedFromReport: boolean;
  };
};

const NokStatusIndicator = ({ status }: NokStatusProps) => {
  console.log(' Status ->', status);


  // Rework Status Color
  let reworkStatusColor;
  switch (status.reworkStatus) {
  case 'REWORKED':
    reworkStatusColor = colors.green[500];
    break;
  case 'REWORK IN PROGRESS':
    reworkStatusColor = colors.yellow[500];
    break;
  case 'SCRAPPED':
    reworkStatusColor = colors.red[500];
    break;
  case 'NOK':
    reworkStatusColor = colors.grey[500];
    break;
  default:
    reworkStatusColor = colors.grey[500];
  }

  // Cost Status Color
  let costStatusColor;
  switch (status.costStatus) {
  case 'OK':
    costStatusColor = colors.green[500];
    break;
  case 'IQC':
    costStatusColor = colors.yellow[500];
    break;
  case 'SomeIssues':
    costStatusColor = colors.red[500];
    break;
  default:
    costStatusColor = colors.grey[500];
  }

  // Rework Status Color
  let rcaStatusColor;
  switch (status.rcaStatus) {
  case 'OK':
    rcaStatusColor = colors.green[500];
    break;
  case 'SomeIssues':
    rcaStatusColor = colors.red[500];
    break;
  default:
    rcaStatusColor = colors.grey[500];
  }

  // Analyse Status Color
  let analyseSatusColor;
  switch (status.analyseStatus) {
  case 'OK':
    analyseSatusColor = colors.green[500];
    break;
  case 'SomeIssues':
    analyseSatusColor = colors.red[500];
    break;
  default:
    analyseSatusColor = colors.grey[500];
  }
  // Claim Status Color
  let claimStatusColor;
  switch (status.claimStatus) {
  case 'Accepted':
    claimStatusColor = colors.green[500];
    break;
  case 'Rejected':
    claimStatusColor = colors.red[500];
    break;
  case 'Pending':
    claimStatusColor = colors.yellow[500];
    break;
  default:
    claimStatusColor = colors.grey[500];
  }

  return (
    <Stack direction={'row'} spacing={0} marginTop={1} marginLeft={1}>
      <BuildCircleTwoToneIcon titleAccess='Rework Status' sx={{ fontSize: '45px', color: reworkStatusColor }} />
      <MonetizationOnTwoToneIcon titleAccess='Cost Status' sx={{ fontSize: '45px', color: costStatusColor }} />
      <ContentPasteSearchTwoToneIcon titleAccess='Analyse Status' sx={{ fontSize: '45px', color: analyseSatusColor }} />
      <TroubleshootTwoToneIcon titleAccess='RCA Status' sx={{ fontSize: '45px', color: rcaStatusColor }} />
      <Box sx={{ width: '80px', height: '35px', borderRadius: '8px', border:'4px solid',  textAlign: 'center', paddingTop: '3px', borderColor: claimStatusColor }}>
        <Typography fontSize={22} sx={{ color: claimStatusColor }}>
          CLAIM
        </Typography>
      </Box>
      {status.removedFromReport ?
        <Box sx={{ width: '230px', height: '35px', borderRadius: '8px', border:'4px solid',  textAlign: 'center', paddingTop: '3px', marginLeft: 1, borderColor: colors.red[500] }}>
          <Typography fontSize={22} sx={{ color: colors.red[500] }}>
          Removed from Report
          </Typography>
        </Box>
        : null}
    </Stack>
  );
};

export default NokStatusIndicator;