import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

import NokGrps from './NokGrps';
import NokCodes from './NokCodes';
import RcaCodes from './rcaCode/RcaCodes';

const SystemSetting = () => {

  const navigate = useNavigate();

  type ShowListForm = 'NOK-CODE' | 'NOK-GRP' | 'RCA-CODE' | '' | '' | 'NONE'

  const [ showListForm, setShowListForm ] = useState<ShowListForm>('NONE');

  return(
    <Paper sx={{ marginTop: 1, border: 'solid', borderRadius: 2, borderColor: '#1976d270', width: '99.7%', height: '100%' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        borderRadius={2} bgcolor={'#1976d270'}
      >
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
          <Typography margin={1}>SYSTEM SETTINGS</Typography>
          <Button onClick={() => navigate('/config')} variant='contained' sx={{ height: '39px' }}>
            close
          </Button>
        </Grid>
      </Box>
      <Grid container display={'flex'} direction={'row'} height={'650px'}>
        <Grid item p={2}
          width={'180x'}
          bgcolor={'#E5E7E9'}
          color={'white'}
          flexDirection={'column'}
          borderColor={'#1976d270'}>
          <List>
            <ListItem onClick={() => setShowListForm('NOK-CODE')}>
              <ListItemText primary='NOK Code' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('NOK-GRP')}>
              <ListItemText primary='NOK Groups' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('RCA-CODE')}>
              <ListItemText primary='RCA Code' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('')}>
              <ListItemText primary='**' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('')}>
              <ListItemText primary='**' sx={{ color: 'black' }} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10} p={2}>
          <Box>
            {showListForm === 'NOK-CODE' && <NokCodes /> }
            {showListForm === 'NOK-GRP' && <NokGrps /> }
            {showListForm === 'RCA-CODE' && <RcaCodes /> }
            {showListForm === '' &&'test'  }
            {showListForm === '' && 'test' }
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SystemSetting;