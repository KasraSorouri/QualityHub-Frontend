import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Grid, LinearProgress } from '@mui/material';

import classCodeServices from '../../services/classCodeServices';
import ClassCodeList from './ClassCodeList';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { ClassCode, ClassCodeData } from '../../../../types/QualityHubTypes';
import ClassCodeForm from './ClassCodeForm';

const ClassCodes = () => {
  const [showClassCodeForm, setShowClassCodeForm] = useState<{ show: boolean; formType: 'ADD' | 'EDIT' }>({
    show: false,
    formType: 'ADD',
  });
  const [selectedClassCode, setSelectedClassCode] = useState<ClassCode | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New classCode
  const newClassCodeMutation = useMutation(classCodeServices.createClassCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('classCodes');
      setNotification({ message: 'ClassCode added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  // Edit ClassCode
  const editClassCodeMutation = useMutation(classCodeServices.editClassCode, {
    onSuccess: () => {
      queryClient.invalidateQueries('classCodes');
      setNotification({ message: 'ClassCode updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  // Get ClassCode List
  const classCodeResults = useQuery('classCodes', classCodeServices.getClassCode, { refetchOnWindowFocus: false });

  const classCodes: ClassCode[] = classCodeResults.data || [];

  console.log('materilas  ->', classCodes);

  const handleClassCodeFormSubmit = (newUserData: ClassCodeData) => {
    if (showClassCodeForm.formType === 'ADD') {
      newClassCodeMutation.mutate(newUserData);
    }

    if (showClassCodeForm.formType === 'EDIT') {
      editClassCodeMutation.mutate(newUserData);
    }
  };
  return (
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        {classCodeResults.isLoading && <LinearProgress sx={{ margin: 1 }} />}
        {showClassCodeForm.show && (
          <ClassCodeForm
            classCodeData={selectedClassCode}
            formType={showClassCodeForm.formType}
            submitHandler={handleClassCodeFormSubmit}
            displayClassCodeForm={setShowClassCodeForm}
          />
        )}
      </Grid>
      <Grid item>
        {classCodeResults.data && (
          <ClassCodeList
            classCodes={classCodes}
            selectClassCode={setSelectedClassCode}
            displayClassCodeForm={setShowClassCodeForm}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ClassCodes;
