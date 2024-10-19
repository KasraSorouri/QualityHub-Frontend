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
} from '@mui/material';

import { Product } from '../../../../types/QualityHubTypes';
import productServices from '../../services/productServices';

type ProductChoiceProps = {
  selectProduct: (product: Product) => void;
}

const ReworkProductChoice = ({ selectProduct } : ProductChoiceProps ) => {

  const [ product, setProduct ] = useState<Product | null>(null);

  // Get Product List
  const productResults = useQuery('products', productServices.getProduct, { refetchOnWindowFocus: false });
  const products: Product[] = productResults.data || [];

  const handleSelectedProduct = async(product : Product) => {
    selectProduct(product);
    setProduct(product);
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
          value={product}
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
    </Grid>
  );
};

export default ReworkProductChoice;