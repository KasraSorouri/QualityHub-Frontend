import { useState } from 'react';
import { useQuery } from 'react-query';

import {
  Autocomplete,
  FilledTextFieldProps,
  Grid,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography,
} from '@mui/material';

import { Product } from '../../../../types/QualityHubTypes';
import productServices from '../../services/productServices';
import Reworks from './Rework';

const ReworkProductChoice = () => {

  const [ selectedProduct, setSelectedProduct ] = useState<Product | null>(null);

  // Get Product List
  const productResults = useQuery('products', productServices.getProduct, { refetchOnWindowFocus: false });
  const products: Product[] = productResults.data || [];

  const handleSelectedProduct = async(product : Product) => {
    setSelectedProduct(product);
  };

  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        <Autocomplete
          id='product'
          sx={{ margin: 1, width: '150px' }}
          size='small'
          aria-required
          options={products}
          isOptionEqualToValue={
            (option: Product, value: Product) => option.productName === value.productName
          }
          value={selectedProduct}
          onChange={(_event, newValue) => newValue && handleSelectedProduct(newValue)}
          getOptionLabel={(option: { productName: string; }) => option.productName}
          renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
            <TextField
              {...params}
              label=' Product'
              placeholder='Product'
              size='small'
              sx={{ width: '180px', margin: '2' }}
              required
            />
          )}
        />
      </Grid>
      <Grid item>
        { selectedProduct ?
          <Reworks product={selectedProduct} />
          :
          <Grid>
            <Typography variant='h6' marginLeft={2}>
        Please select a product to view reworks.
              <br/>
        If you do not see any products, please add a new product.
              <br/>
              <br/>
            </Typography>
          </Grid>
        }
      </Grid>
    </Grid>
  );
};

export default ReworkProductChoice;