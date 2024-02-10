import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Grid,
  LinearProgress,
} from '@mui/material';

import materialServices from '../services/materialServices';
import MaterialList from './MaterialList';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import { NewMaterial, Material } from '../../../types/QualityHubTypes';
import MaterialForm from './MaterialForm';

const Materials = () => {

  const [ showMaterialForm, setShowMaterialForm ] = useState<{ show: boolean, formType: 'ADD' | 'EDIT' }>({ show: false, formType: 'ADD' });
  const [ selectedMaterial, setSelectedMaterial ] = useState<Material | null>(null);

  const setNotification = useNotificationSet();

  // Query implementation
  const queryClient = useQueryClient();

  // Add New material
  const newMaterialMutation = useMutation(materialServices.createMaterial, {
    onSuccess: () => {
      queryClient.invalidateQueries('materials');
      setNotification({ message: 'Material added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });

  // Edit Material
  const editMaterialMutation = useMutation(materialServices.editMaterial,{
    onSuccess: () => {
      queryClient.invalidateQueries('materials');
      setNotification({ message: 'Material updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    }
  });


  // Get Material List
  const materialResults = useQuery('materials',materialServices.getMaterial, { refetchOnWindowFocus: false });

  const materials: Material[] = materialResults.data || [];

  console.log('materilas  ->', materials);


  const handleMaterialFormSubmit = (newUserData:  NewMaterial) => {

    if (showMaterialForm.formType === 'ADD') {
      newMaterialMutation.mutate(newUserData);
    }

    if (showMaterialForm.formType === 'EDIT') {
      editMaterialMutation.mutate(newUserData);
    }
  };
  return(
    <Grid container direction={'column'} spacing={2}>
      <Grid item>
        { materialResults.isLoading && <LinearProgress sx={{ margin: 1 }}/> }
        { showMaterialForm.show && <MaterialForm materialData={selectedMaterial} formType={showMaterialForm.formType} submitHandler={handleMaterialFormSubmit} displayMaterialForm={setShowMaterialForm} />}
      </Grid>
      <Grid item>
        { materialResults.data && <MaterialList materials={materials} selectMaterial={setSelectedMaterial} displayMaterialForm={setShowMaterialForm}/>}
      </Grid>
    </Grid>
  );
};

export default Materials;