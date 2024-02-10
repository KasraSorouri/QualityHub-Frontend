import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import productServices from '../services/productServices';
import ProductList from './ProductList';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import { NewProduct, Product, UpdateProductData } from '../../../types/QualityHubTypes';
import ProductForm from './ProductForm';

const Products = () => {

  const [ showProductForm, setShowProductForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedProduct, setSelectedProduct ] = useState<Product | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New product
  const newProductMutation = useMutation(productServices.createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      setNotification({ message: 'Product added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit Product
  const editProductMutation = useMutation(productServices.editProduct,{
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      setNotification({ message: 'Product updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get Product List
  const productResults = useQuery('products',productServices.getProduct, { refetchOnWindowFocus: false });

  const products: Product[] = productResults.data || [];

  const handleProductFormSubmit = (newUserData:  NewProduct | UpdateProductData) => {

    if (showProductForm.formType === 'ADD') {
      newProductMutation.mutate(newUserData as NewProduct);
    }

    if (showProductForm.formType === 'EDIT') {
      editProductMutation.mutate(newUserData as UpdateProductData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { productResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showProductForm.show && <ProductForm productData={selectedProduct} formType={showProductForm.formType} submitHandler={handleProductFormSubmit} displayProductForm={setShowProductForm} />}
      </Grid>
      <Grid item>
        { productResults.data && <ProductList products={products} selectProduct={setSelectedProduct} displayProductForm={setShowProductForm}/>}
      </Grid>
    </Grid>
  );
};

export default Products;