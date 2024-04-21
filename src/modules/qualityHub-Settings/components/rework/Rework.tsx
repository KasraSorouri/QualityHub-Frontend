import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import ReworkList from './ReworkList';
import ReworkForm from './ReworkForm';
import ReworkProductChoice from './ReworkProductChoice';

import reworkServices from '../../services/reworkServices';

import { Product, Rework } from '../../../../types/QualityHubTypes';

const Reworks = () => {

  const [ showReworkForm, setShowReworkForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' | 'VIEW' }>({ show: false, formType: 'ADD' });
  const [ selectedRework, setSelectedRework ] = useState<Rework | null>(null);
  const [ product, setProduct ] = useState<Product | null>(null);

  // Query implementation
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateReworkQuery = async() => {
      await queryClient.invalidateQueries('reworks');
    };
    updateReworkQuery();
  },[product, queryClient]);

  const handleSelectedProduct = (product : Product) => {
    setProduct(product);
  };

  const productId : number = product ? product.id : 0;

  // Get Reworks based on Selected product
  const reworkResults = useQuery(['reworks',productId], async() => {
    const response = productId > 0 && reworkServices.getReworkByProduct(productId);
    return response;
  },{ refetchOnWindowFocus: false, enabled: true });

  const reworks: Rework[] = reworkResults.data || [];

  return(
    <Grid container direction={'column'} spacing={2} marginLeft={2}>
      { product ?
        <Grid>
          {(!showReworkForm.show) && <ReworkProductChoice selectProduct={handleSelectedProduct} />}
          <Grid item>
            {reworkResults.isLoading && <LinearProgress sx={{ margin: 1 }} />}
            {showReworkForm.show && <ReworkForm reworkData={selectedRework} product={product} formType={showReworkForm.formType} displayReworkForm={setShowReworkForm} />}
          </Grid>
          <Grid item>
            {(reworkResults.data && !showReworkForm.show) && <ReworkList reworks={reworks} selectRework={setSelectedRework} displayReworkForm={setShowReworkForm} />}
          </Grid>
        </Grid>
        :
        <ReworkProductChoice selectProduct={handleSelectedProduct} />
      }
    </Grid>
  );
};

export default Reworks;