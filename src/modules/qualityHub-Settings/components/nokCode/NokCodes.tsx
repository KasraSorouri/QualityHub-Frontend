import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Grid, LinearProgress } from '@mui/material';

import nokCodeServices from '../../services/nokCodeServices';
import NokCodeList from './NokCodeList';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { NokCodeData, NokCode } from '../../../../types/QualityHubTypes';
import NokCodeForm from './NokCodeForm';

const NokCodes = () => {
  const [showNokCodeForm, setShowNokCodeForm] = useState<{ show: boolean; formType: 'ADD' | 'EDIT' }>({
    show: false,
    formType: 'ADD',
  });
  const [selectedNokCode, setSelectedNokCode] = useState<NokCode | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New nokCode
  const newNokCodeMutation = useMutation(nokCodeServices.createNokCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('nokCodes');
      setNotification({ message: 'Nok Group added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  // Edit NokCode
  const editNokCodeMutation = useMutation(nokCodeServices.editNokCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('nokCodes');
      setNotification({ message: 'Nok Code updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  // Get NokCode List
  const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });

  const nokCodes: NokCode[] = nokCodeResults.data || [];

  console.log('* NOK CODES ->', nokCodes);

  const handleNokCodeFormSubmit = (newUserData: NokCodeData) => {
    if (showNokCodeForm.formType === 'ADD') {
      newNokCodeMutation.mutate(newUserData);
    }

    if (showNokCodeForm.formType === 'EDIT') {
      editNokCodeMutation.mutate(newUserData);
    }
  };
  return (
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        {nokCodeResults.isLoading && <LinearProgress sx={{ margin: 1 }} />}
        {showNokCodeForm.show && (
          <NokCodeForm
            nokCodeData={selectedNokCode}
            formType={showNokCodeForm.formType}
            submitHandler={handleNokCodeFormSubmit}
            displayNokCodeForm={setShowNokCodeForm}
          />
        )}
      </Grid>
      <Grid item>
        {nokCodeResults.data && (
          <NokCodeList nokCodes={nokCodes} selectNokCode={setSelectedNokCode} displayNokCodeForm={setShowNokCodeForm} />
        )}
      </Grid>
    </Grid>
  );
};

export default NokCodes;
