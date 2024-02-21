import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import rcaCodeServices from '../../services/rcaCodeServices';
import RcaCodeList from './RcaCodeList';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { RcaCode, RcaCodeData } from '../../../../types/QualityHubTypes';
import RcaCodeForm from './RcaCodeForm';

const RcaCodes = () => {

  const [ showRcaCodeForm, setShowRcaCodeForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedRcaCode, setSelectedRcaCode ] = useState<RcaCode | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New rcaCode
  const newRcaCodeMutation = useMutation(rcaCodeServices.createRcaCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('rcaCodes');
      setNotification({ message: 'RcaCode added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit RcaCode
  const editRcaCodeMutation = useMutation(rcaCodeServices.editRcaCode,{
    onSuccess: () => {
      queryClient.invalidateQueries('rcaCodes');
      setNotification({ message: 'RcaCode updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get RcaCode List
  const rcaCodeResults = useQuery('rcaCodes',rcaCodeServices.getRcaCode, { refetchOnWindowFocus: false });

  const rcaCodes: RcaCode[] = rcaCodeResults.data || [];

  console.log('materilas  ->', rcaCodes);


  const handleRcaCodeFormSubmit = (newUserData:  RcaCodeData) => {

    if (showRcaCodeForm.formType === 'ADD') {
      newRcaCodeMutation.mutate(newUserData);
    }

    if (showRcaCodeForm.formType === 'EDIT') {
      editRcaCodeMutation.mutate(newUserData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { rcaCodeResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showRcaCodeForm.show && <RcaCodeForm rcaCodeData={selectedRcaCode} formType={showRcaCodeForm.formType} submitHandler={handleRcaCodeFormSubmit} displayRcaCodeForm={setShowRcaCodeForm} />}
      </Grid>
      <Grid item>
        { rcaCodeResults.data && <RcaCodeList rcaCodes={rcaCodes} selectRcaCode={setSelectedRcaCode} displayRcaCodeForm={setShowRcaCodeForm}/>}
      </Grid>
    </Grid>
  );
};

export default RcaCodes;