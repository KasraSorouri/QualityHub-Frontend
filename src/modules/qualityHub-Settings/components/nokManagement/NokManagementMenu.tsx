import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';

import HomePage from '../../../public/components/HomePage-Data';
import NokForm from './NOK_Reg_Form';
import NokList from './NOK_List';
import NokAnalysis from './NOK_Analysis';
import Nokreworks from './NOK_Rework';

const HomePageSubMenu = () => {

  const navigate = useNavigate();

  type ShowListForm = 'NEW-NOK' | 'NOK-LIST' | 'ANALYSE' | 'REWORK' | '' | 'NONE'

  const [ showListForm, setShowListForm ] = useState<ShowListForm>('NONE');

  return(
    <Paper elevation={3}
      sx={{ marginTop: 1,
        border: 'solid',
        borderRadius: 2,
        borderColor: '#1976d270',
        width: '99.7%',
        height: '100%',
        minHeight: '70Vh',
      }}>
      <Stack direction={'row'} height={'650px'} width={'100%'} flexDirection={'row'} >
        <Grid
          minWidth={'180px'}
          bgcolor={'#E5E7E9'}
          color={'white'}
          flexDirection={'column'}
          borderColor={'#1976d270'}>
          <List>
            <ListItem onClick={() => setShowListForm('NEW-NOK')}>
              <ListItemText primary='Register New NOK' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('ANALYSE')}>
              <ListItemText primary='NOK Analyse' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('REWORK')}>
              <ListItemText primary='Rework' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('NOK-LIST')}>
              <ListItemText primary='NOK List' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => navigate('/nok/register')}>
              <ListItemText primary='' sx={{ color: 'black' }} />
            </ListItem>
          </List>
        </Grid>
        <Grid width={'90%'}>
          <Box>
            {showListForm === 'NEW-NOK' && <NokForm formType={'ADD'} /> }
            {showListForm === 'NOK-LIST' && <NokList listType='' /> }
            {showListForm === 'ANALYSE' && <NokAnalysis />}
            {showListForm === 'REWORK' &&  <Nokreworks />}
            {showListForm === '' && <HomePage /> }
          </Box>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default HomePageSubMenu;