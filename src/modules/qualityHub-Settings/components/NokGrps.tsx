import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import nokGrpServices from '../services/nokGrpServices';
import NokGrpList from './NokGrpList';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import { NokGroup, NokGrpData } from '../../../types/QualityHubTypes';
import NokGrpForm from './NokGrpForm';

const NokGrps = () => {

  const [ showNokGrpForm, setShowNokGrpForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedNokGrp, setSelectedNokGrp ] = useState<NokGroup | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New nokGrp
  const newNokGrpMutation = useMutation(nokGrpServices.createNokGrp, {
    onSuccess: () => {
      queryClient.invalidateQueries('nokGrps');
      setNotification({ message: 'Nok Group added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit NokGrp
  const editNokGrpMutation = useMutation(nokGrpServices.editNokGrp,{
    onSuccess: () => {
      queryClient.invalidateQueries('nokGrps');
      setNotification({ message: 'Nok Group updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get NokGrp List
  const nokGrpResults = useQuery('nokGrps',nokGrpServices.getNokGrp, { refetchOnWindowFocus: false });

  const nokGrps: NokGroup[] = nokGrpResults.data || [];

  console.log('* NOk Group ->', nokGrps);

  const handleNokGrpFormSubmit = (newUserData:  NokGrpData) => {

    if (showNokGrpForm.formType === 'ADD') {
      newNokGrpMutation.mutate(newUserData);
    }

    if (showNokGrpForm.formType === 'EDIT') {
      editNokGrpMutation.mutate(newUserData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { nokGrpResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showNokGrpForm.show && <NokGrpForm nokGrpData={selectedNokGrp} formType={showNokGrpForm.formType} submitHandler={handleNokGrpFormSubmit} displayNokGrpForm={setShowNokGrpForm} />}
      </Grid>
      <Grid item>
        { nokGrpResults.data && <NokGrpList nokGrps={nokGrps} selectNokGrp={setSelectedNokGrp} displayNokGrpForm={setShowNokGrpForm}/>}
      </Grid>
    </Grid>
  );
};

export default NokGrps;