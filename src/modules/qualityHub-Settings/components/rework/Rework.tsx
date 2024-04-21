import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import reworkServices from '../../services/reworkServices';
import ReworkList from './ReworkList';

//import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { Product, Rework } from '../../../../types/QualityHubTypes';
import ReworkForm from './ReworkForm';

type ReworkProps = {
  product: Product;
}

const Reworks = ( { product } :ReworkProps) => {

  const [ showReworkForm, setShowReworkForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' | 'VIEW' }>({ show: false, formType: 'ADD' });
  const [ selectedRework, setSelectedRework ] = useState<Rework | null>(null);

  //const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateReworkQuery = async() => {
      await queryClient.invalidateQueries('reworks');
    };
    updateReworkQuery();
  },[product, queryClient]);

  // Get Reworks based on Selected product
  const reworkResults = useQuery(['reworks',product.id], async() => {
    const response = reworkServices.getReworkByProduct(product.id);
    if (!response) {
      throw new Error('Failed to fetch reworks');
    }
    return response;
  },{ refetchOnWindowFocus: false, enabled: true });

  const reworks: Rework[] = reworkResults.data || [];

  return(
    <Grid container direction={'column'} spacing={2} marginLeft={2}>
      <Grid item>
        { reworkResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showReworkForm.show && <ReworkForm reworkData={selectedRework} product={product} formType={showReworkForm.formType} displayReworkForm={setShowReworkForm} />}
      </Grid>
      <Grid item>
        { (reworkResults.data && !showReworkForm.show) && <ReworkList reworks={reworks} selectRework={setSelectedRework} displayReworkForm={setShowReworkForm}/>}
      </Grid>
    </Grid>
  );
};

export default Reworks;