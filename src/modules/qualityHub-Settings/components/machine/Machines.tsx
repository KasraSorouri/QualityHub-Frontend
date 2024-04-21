import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import machineServices from '../../services/machineServices';
import MachineList from './MachineList';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { Machine, MachineData } from '../../../../types/QualityHubTypes';
import MachineForm from './MachineForm';

const Machines = () => {

  const [ showMachineForm, setShowMachineForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedMachine, setSelectedMachine ] = useState<Machine | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New machine
  const newMachineMutation = useMutation(machineServices.createMachine, {
    onSuccess: () => {
      queryClient.invalidateQueries('machines');
      setNotification({ message: 'Machine added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit Machine
  const editMachineMutation = useMutation(machineServices.editMachine,{
    onSuccess: () => {
      queryClient.invalidateQueries('machines');
      setNotification({ message: 'Machine updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get Machine List
  const machineResults = useQuery('machines',machineServices.getMachine, { refetchOnWindowFocus: false });

  const machines: Machine[] = machineResults.data || [];

  console.log('materilas  ->', machines);


  const handleMachineFormSubmit = (newUserData:  MachineData) => {

    if (showMachineForm.formType === 'ADD') {
      newMachineMutation.mutate(newUserData);
    }

    if (showMachineForm.formType === 'EDIT') {
      editMachineMutation.mutate(newUserData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { machineResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showMachineForm.show && <MachineForm machineData={selectedMachine} formType={showMachineForm.formType} submitHandler={handleMachineFormSubmit} displayMachineForm={setShowMachineForm} />}
      </Grid>
      <Grid item>
        { machineResults.data && <MachineList machines={machines} selectMachine={setSelectedMachine} displayMachineForm={setShowMachineForm}/>}
      </Grid>
    </Grid>
  );
};

export default Machines;