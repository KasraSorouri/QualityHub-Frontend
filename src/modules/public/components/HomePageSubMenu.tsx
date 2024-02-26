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
} from '@mui/material';

import HomePage from './HomePage-Data';
import NokForm from '../../qualityHub-Settings/components/regNok/NokForm';

const HomePageSubMenu = () => {

  const navigate = useNavigate();

  type ShowListForm = 'NEW-NOK' | '*' | '**' | '***' | '' | 'NONE'

  const [ showListForm, setShowListForm ] = useState<ShowListForm>('NONE');

  return(
    <Paper sx={{ marginTop: 1, border: 'solid', borderRadius: 2, borderColor: '#1976d270', width: '99.7%', height: '100%' }}>
      <Grid container display={'flex'} direction={'row'} height={'650px'}>
        <Grid item p={2}
          width={'180x'}
          bgcolor={'#E5E7E9'}
          color={'white'}
          flexDirection={'column'}
          borderColor={'#1976d270'}>
          <List>
            <ListItem onClick={() => setShowListForm('NEW-NOK')}>
              <ListItemText primary='Register New NOK' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => navigate('/nok/register')}>
              <ListItemText primary='' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('')}>
              <ListItemText primary='' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('')}>
              <ListItemText primary='' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('')}>
              <ListItemText primary='' sx={{ color: 'black' }} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10} p={2}>
          <Box>
            {showListForm === 'NEW-NOK' && <NokForm formType={'ADD'} /> }
            {showListForm === '' && <HomePage /> }
            {showListForm === '' && <HomePage /> }
            {showListForm === '' && <HomePage /> }
            {showListForm === '' && <HomePage /> }
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomePageSubMenu;