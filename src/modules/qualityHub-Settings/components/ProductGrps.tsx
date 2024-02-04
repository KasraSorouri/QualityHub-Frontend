import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import productGrpServices from '../services/productGrpServices';
import ProductGrpList from './ProductGrpList';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import { ProductGroup, NewProductGrp } from '../../../types/QualityHubTypes';
import ProductGrpForm from './ProductGrpForm';

const ProductGrps = () => {

  const [ showProductGrpForm, setShowProductGrpForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedProductGrp, setSelectedProductGrp ] = useState<ProductGroup | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New productGrp
  const newProductGrpMutation = useMutation(productGrpServices.createProductGrp, {
    onSuccess: () => {
      queryClient.invalidateQueries('productGrps');
      setNotification({ message: 'Role added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit ProductGrp
  const editProductGrpMutation = useMutation(productGrpServices.editProductGrp,{
    onSuccess: () => {
      queryClient.invalidateQueries('productGrps');
      setNotification({ message: 'User updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get ProductGrp List
  const productGrpResults = useQuery('productGrps',productGrpServices.getProductGrp, { refetchOnWindowFocus: false });

  const productGrps: ProductGroup[] = productGrpResults.data || [];

  const handleProductGrpFormSubmit = (newUserData:  NewProductGrp) => {

    if (showProductGrpForm.formType === 'ADD') {
      newProductGrpMutation.mutate(newUserData as NewProductGrp);
    }

    if (showProductGrpForm.formType === 'EDIT') {
      editProductGrpMutation.mutate(newUserData as NewProductGrp);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { productGrpResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showProductGrpForm.show && <ProductGrpForm productGrpData={selectedProductGrp} formType={showProductGrpForm.formType} submitHandler={handleProductGrpFormSubmit} displayProductGrpForm={setShowProductGrpForm} />}
      </Grid>
      <Grid item>
        { productGrpResults.data && <ProductGrpList productGrps={productGrps} selectProductGrp={setSelectedProductGrp} displayProductGrpForm={setShowProductGrpForm}/>}
      </Grid>
    </Grid>
  );
};

export default ProductGrps;