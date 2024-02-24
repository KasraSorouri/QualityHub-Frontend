import { useEffect, useState } from 'react';

import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Grid,
  Autocomplete,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from '@mui/material';

import { NewProduct, ProductGroup, UpdateProductData } from '../../../../types/QualityHubTypes';
import { Product } from '../../../../types/QualityHubTypes';
import productGrpServices from '../../services/productGrpServices';
import { useQuery } from 'react-query';
import { JSX } from 'react/jsx-runtime';


interface FormData {
  id: number | string;
  productName: string;
  productCode:  string;
  productGrp?: ProductGroup | null;
  productGrpId: number | null;
  active: boolean;
}

type ProductFormProps = {
  productData: Product | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (product: NewProduct | UpdateProductData) => void;
  displayProductForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
}



const ProductForm = ({ productData, formType, submitHandler, displayProductForm } : ProductFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Product' : 'Edit Product';
  const submitTitle = formType === 'ADD' ? 'Add Product' : 'Update Product';

  const initialFormData : FormData = {
    id: productData ? productData.id : '',
    productName: productData ? productData.productName : '',
    productCode:  productData ? productData.productCode : '',
    productGrp:  productData ? productData.productGrp : null,
    productGrpId: productData ? productData.productGrp.id : null,
    active: productData ? productData.active : false,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: productData ? productData.id : '',
      productName: productData ? productData.productName : '',
      productCode:  productData ? productData.productCode : '',
      productGrp:  productData ? productData.productGrp : null,
      productGrpId: productData ? productData.productGrp.id : null,
      active: productData ? productData.active : false,
    };
    setFormValues(formData);
  },[formType, productData]);

  // Get Product List
  const productGrpResults = useQuery('productGrps',productGrpServices.getProductGrp, { refetchOnWindowFocus: false });

  const productGrps: ProductGroup[] = productGrpResults.data || [];

  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleGroupChange = (newValue: ProductGroup) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      ['productGrp']: newValue,
      ['productGrpId']: newValue.id
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (formValues.productGrp) {
      const newProduct: NewProduct | UpdateProductData  = {
        id: (typeof formValues.id === 'number') ? formValues.id : 0,
        productName: formValues.productName,
        productCode: formValues.productCode,
        active: formValues.active,
        productGrpId: formValues.productGrp.id
      };
      submitHandler(newProduct);
    }
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained'  size='small'  onClick={() => displayProductForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex'  margin={0} >
          <Grid container flexDirection={'row'} >
            <TextField
              label='Product Name'
              name='productName'
              sx={{ marginLeft: 2 }}
              value={formValues.productName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <TextField
              label='product Code'
              name='productCode'
              sx={{ marginLeft: 2 }}
              value={formValues.productCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
              margin='dense'
              variant='outlined'
              size='small'
              required
            />
            <Autocomplete
              id='productGrp'
              sx={{ margin: 1, width: '150px' }}
              size='small'
              aria-required
              options={productGrps}
              isOptionEqualToValue={
                (option: ProductGroup, value: ProductGroup) => option.groupName === value.groupName
              }
              value={formValues.productGrp}
              onChange={(_event, newValue) => newValue && handleGroupChange(newValue)}
              getOptionLabel={(option: { groupName: string; }) => option.groupName}
              renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                <TextField
                  {...params}
                  label=' Product Group'
                  placeholder='Add Group'
                  size='small'
                  sx={{ width: '180px', margin: '2' }}
                  required
                />
              )}
            />
            <FormControlLabel
              sx={{ marginLeft: 5 }}
              control={
                <Checkbox
                  checked={formValues.active}
                  onChange={handleChange}
                  name='active'
                  color='primary'
                />
              }
              label='Active'
            />
          </Grid>
          <Grid>
            <Button type='submit' variant='contained' color='primary' sx={{ margin: 1, minWidth: '200px' , width: 'auto' }}>
              {submitTitle}
            </Button>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default ProductForm;