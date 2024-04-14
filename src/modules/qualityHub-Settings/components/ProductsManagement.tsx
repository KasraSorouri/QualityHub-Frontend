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

import Product from './product/Products';
import ProductGrp from './productGroup/ProductGrps';
import Station from './station/Stations';
import Material from './material/Materials';
import RecipeProductChoice from './recipe/RecipeProductChoice';
import ReworkProductChoice from './rework/ReworkProductChoice';

const ProductsManagement = () => {

  const navigate = useNavigate();

  type ShowListForm = 'PRODUCT' | 'PRODUCT_GRP' | 'RECIPE' | 'MATERIAL' | 'STATION' | 'REWORK' | 'NONE'

  const [ showListForm, setShowListForm ] = useState<ShowListForm>('NONE');

  return(
    <Paper sx={{ marginTop: 1, border: 'solid', borderRadius: 2, borderColor: '#1976d270', width: '99.7%', height: '100%' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        borderRadius={2} bgcolor={'#1976d270'}
      >
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
          <Typography margin={1}>PRODUCT SETTINGS</Typography>
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
            <ListItem onClick={() => setShowListForm('PRODUCT_GRP')}>
              <ListItemText primary='Product Groups' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('PRODUCT')}>
              <ListItemText primary='Products' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('STATION')}>
              <ListItemText primary='Stations' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('MATERIAL')}>
              <ListItemText primary='Materials' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('RECIPE')}>
              <ListItemText primary='Recipes' sx={{ color: 'black' }} />
            </ListItem>
            <Divider />
            <ListItem onClick={() => setShowListForm('REWORK')}>
              <ListItemText primary='Rework' sx={{ color: 'black' }} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10} p={2}>
          <Box>
            {showListForm === 'PRODUCT' && <Product /> }
            {showListForm === 'PRODUCT_GRP' && <ProductGrp /> }
            {showListForm === 'STATION' && <Station /> }
            {showListForm === 'MATERIAL' && <Material /> }
            {showListForm === 'RECIPE' && <RecipeProductChoice /> }
            {showListForm === 'REWORK' && <ReworkProductChoice /> }
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductsManagement;