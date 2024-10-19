import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  //Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import nokDetectServices from '../../services/nokDetectServices';
import { NokData } from '../../../../types/QualityHubTypes';
import dayjs from 'dayjs';


type NokFromProps = {
  nokId: number;
}

const NokInfo = ({ nokId }: NokFromProps) => {

  const [ nok, setNok ] = useState<NokData>();
  const [ showDetial, setShowDitail ] = useState<boolean>(false);

  useEffect(() => {
    const getNokData = async () => {
      const result = await nokDetectServices.getNokDetectById(nokId);
      setNok(result);
    };
    getNokData();
  },[nokId]);
  if (!nok) {
    return(
      <TextField>
        Loading .... !
      </TextField>
    );
  }

  return (
    <Box>
      <Grid container direction={'column'} marginBottom={1} >
        <Typography variant='h6' marginLeft={2}>
          NOK information
        </Typography>
        <Grid container width={'100%'} flexDirection={'row'} marginTop={1}>
          <TextField
            id='product'
            label='product'
            value={nok?.product.productName}
            disabled={true}
            sx={{ marginLeft: 2, width: '30%', minWidth: '180px' }}
            size='small'
          />
          <TextField
            id='productSN'
            name='productSN'
            label='Product SN'
            value={nok?.productSN}
            disabled={true}
            sx={{ marginLeft: 2, width: '30%', minWidth: '180px' }}
            size='small'
          />
          <TextField
            id='initNokCode'
            name='initNokCode'
            label='NOK Code'
            value={nok?.initNokCode.nokCode}
            disabled={true}
            sx={{ marginLeft: 2, width: '10%', minWidth: '180px' }}
            size='small'
          />
          <Button
            id='showDetail'
            variant='contained'
            color='primary'
            size='small'
            sx={{ marginLeft: 1, width: 'auto', height: '38px' }}
            onClick={() => setShowDitail(!showDetial)}
          >
            {showDetial ? 'hide Detail' : 'show Detail'}
          </Button>
        </Grid>
        { showDetial &&
        <Grid>
          <Grid container width={'100%'} flexDirection={'row'} marginTop={1} >
            <TextField
              name='detectedStation'
              label='Station'
              value={nok?.detectedStation.stationCode}
              disabled={true}
              size='small'
              sx={{ marginLeft: 2, width: '150px','& .MuiInputBase-root': { height: '40px' } }}
            />
            <TextField
              name='detectedShift'
              label='Shift'
              value={nok?.detectedShift.shiftCode}
              disabled={true}
              size='small'
              sx={{ marginLeft: 2, width: '100px','& .MuiInputBase-root': { height: '40px' } }}
            />
            <TextField
              name='detectedTime'
              label='Detect Time'
              value={dayjs(nok?.detectTime).format('YYYY.MM.DD  hh:mm')}
              disabled={true}
              size='small'
              sx={{ marginLeft: 2, width: '180px','& .MuiInputBase-root': { height: '40px' } }}
            />
          </Grid>
          <Grid display={'flex'} marginTop={1} >
            <TextField
              id='description'
              name='description'
              label='Description'
              value={nok?.description}
              multiline
              disabled={true}
              sx={{ marginLeft: 2, width: '100%', minWidth: '180px' }}
              size='small'
            />
          </Grid>
        </Grid>
        }
      </Grid>
    </Box>
  );
};

export default NokInfo;

