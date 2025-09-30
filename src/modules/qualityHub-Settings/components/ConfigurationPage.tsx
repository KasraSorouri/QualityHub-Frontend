import { Link } from 'react-router-dom';

import { Grid, Button, Stack } from '@mui/material';

import HardwareIcon from '@mui/icons-material/Hardware';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { Token } from '../../../types/UserAuthTypes';

const ConfigurationPage = ({ signedUser }: { signedUser: Token | null }) => {
  const buttonStyle = {
    width: 500,
    height: 150,
    fontSize: '1.75rem',
    backgroundColor: '#1976d2',
    color: '#FFFFFF',
  };

  const showConfigUser = signedUser && signedUser.roles?.includes('Admin');
  const ShowConfigBom = signedUser && signedUser.roles?.includes('Admin');

  return (
    <Grid container justifyContent="space-between" height={800}>
      <Grid item margin={5}>
        {showConfigUser && (
          <Button
            component={Link}
            to="/quality-setting/product-management"
            style={buttonStyle}
            startIcon={<HardwareIcon style={{ fontSize: '80px' }} />}
          >
            Product Management
          </Button>
        )}
        <Stack margin={2}></Stack>
        {ShowConfigBom && (
          <Button
            component={Link}
            to="/quality-setting/system-setting"
            style={buttonStyle}
            startIcon={<PrecisionManufacturingIcon style={{ fontSize: '80px' }} />}
          >
            System Settings
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default ConfigurationPage;
