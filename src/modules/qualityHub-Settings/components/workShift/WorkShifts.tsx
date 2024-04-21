import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import shiftServices from '../../services/workShiftServices';
import ShiftList from './WorkShiftList';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { WorkShift, WorkShiftData } from '../../../../types/QualityHubTypes';
import ShiftForm from './WorkShiftForm';

const Shifts = () => {

  const [ showShiftForm, setShowShiftForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedShift, setSelectedShift ] = useState<WorkShift | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New shift
  const newShiftMutation = useMutation(shiftServices.createShift, {
    onSuccess: () => {
      queryClient.invalidateQueries('shifts');
      setNotification({ message: 'Shift added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit Shift
  const editShiftMutation = useMutation(shiftServices.editShift,{
    onSuccess: () => {
      queryClient.invalidateQueries('shifts');
      setNotification({ message: 'Shift updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get Shift List
  const shiftResults = useQuery('shifts',shiftServices.getShift, { refetchOnWindowFocus: false });

  const shifts: WorkShift[] = shiftResults.data || [];

  console.log('materilas  ->', shifts);


  const handleShiftFormSubmit = (newShiftData:  WorkShiftData) => {

    if (showShiftForm.formType === 'ADD') {
      newShiftMutation.mutate(newShiftData);
    }

    if (showShiftForm.formType === 'EDIT') {
      editShiftMutation.mutate(newShiftData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { shiftResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showShiftForm.show && <ShiftForm shiftData={selectedShift} formType={showShiftForm.formType} submitHandler={handleShiftFormSubmit} displayShiftForm={setShowShiftForm} />}
      </Grid>
      <Grid item>
        { shiftResults.data && <ShiftList shifts={shifts} selectShift={setSelectedShift} displayShiftForm={setShowShiftForm}/>}
      </Grid>
    </Grid>
  );
};

export default Shifts;