import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import { useNotificationSet } from '../../../../contexts/NotificationContext';
import stationServices from '../../services/stationServices';

import StationList from './StationList';
import StationForm from './StationForm';

import { NewStation, Station } from '../../../../types/QualityHubTypes';

const Stations = () => {

  const [ showStationForm, setShowStationForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedStation, setSelectedStation ] = useState<Station | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New station
  const newStationMutation = useMutation(stationServices.createStation, {
    onSuccess: () => {
      queryClient.invalidateQueries('stations');
      setNotification({ message: 'Station added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit Station
  const editStationMutation = useMutation(stationServices.editStation,{
    onSuccess: () => {
      queryClient.invalidateQueries('stations');
      setNotification({ message: 'Station updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });

  const stations: Station[] = stationResults.data || [];

  const handleStationFormSubmit = (newUserData:  NewStation) => {

    if (showStationForm.formType === 'ADD') {
      newStationMutation.mutate(newUserData);
    }

    if (showStationForm.formType === 'EDIT') {
      editStationMutation.mutate(newUserData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { stationResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showStationForm.show && <StationForm stationData={selectedStation} formType={showStationForm.formType} submitHandler={handleStationFormSubmit} displayStationForm={setShowStationForm} />}
      </Grid>
      <Grid item>
        { stationResults.data && <StationList stations={stations} selectStation={setSelectedStation} displayStationForm={setShowStationForm}/>}
      </Grid>
    </Grid>
  );
};

export default Stations;