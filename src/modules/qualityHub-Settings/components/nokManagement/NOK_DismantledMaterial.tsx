import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  Box,
  TableRow,
  Checkbox,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  TextFieldVariants,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  IconButton,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import materialServices from '../../services/materialServices';

import { MaterialStatus, Reusable, Material, AffectedMaterial, DismantledMaterialData } from '../../../../types/QualityHubTypes';


import DeleteIcon from '@mui/icons-material/Delete';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof FormDismantledMaterialData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

interface FormDismantledMaterialData extends DismantledMaterialData {
  index2: string;
}

type DismantleMaterialListProps = {
  affectedMaterials: AffectedMaterial[];
  nokDismantledMaterials? : DismantledMaterialData[];
  confirmSelection: (dismantledMaterial: DismantledMaterialData[]) => void;
  confirmChange: (value: boolean) => void;
  editable: boolean;
}

const NokDismantledMaterialForm = ({ affectedMaterials, nokDismantledMaterials, confirmSelection, confirmChange, editable } : DismantleMaterialListProps) => {

  console.log('## Dismantled Matrail Form ** Nok DismantledMaterial -> ', nokDismantledMaterials);
  //console.log('** Dismantled Matrail Form **  Affected DismantledMaterial -> ', affectedMaterials);


  const [ selectedMaterials, setSelectedMaterials ] = useState<string[]>([]);
  const [ formValues, setFormValues ] = useState<FormDismantledMaterialData[]>([]);
  const [ confirmActive, setConfirmActive ] = useState<boolean>(false);
  const [ openDialog , setOpenDialog ] = useState<boolean>(false);
  const [ extraAffectedMaterials , setExteraAffectedMaterials ] = useState<FormDismantledMaterialData[]>([]);

  const setNotification = useNotificationSet();

  useEffect(() => {
    const affectedMaterialsData = affectedMaterials.map(afMaterial => {

      // find if the material is already dismantled
      const dismantledItem = nokDismantledMaterials?.find(dm => dm.index === afMaterial.rwDismantledMaterialId);
      const data : FormDismantledMaterialData = {
        isSelected: dismantledItem ? true : false,
        id: dismantledItem ? dismantledItem.id : 0,
        rwDismantledMaterialId: afMaterial.rwDismantledMaterialId,
        index: afMaterial.rwDismantledMaterialId,
        index2: dismantledItem ? `dm-${dismantledItem.id}` : `am-${afMaterial.rwDismantledMaterialId}`,
        recipeCode: afMaterial.recipeCode,
        recipeDescription: afMaterial.recipeDescription,
        material: afMaterial.material,
        recipeBomId: afMaterial.recipeBomId,
        recipeQty: afMaterial.recipeQty,
        suggestedDismantledQty: afMaterial.suggestedDismantledQty,
        mandatoryRemove: 'mandatoryRemove' in  afMaterial  ? afMaterial.mandatoryRemove : false,
        reusable: afMaterial.reusable,
        actualDismantledQty: dismantledItem?.actualDismantledQty ? dismantledItem.actualDismantledQty : 0,
        rwNote: 'rwNote' in  afMaterial  ? afMaterial.rwNote : '',
        materialStatus: dismantledItem ? dismantledItem.materialStatus : MaterialStatus.SCRAPPED,
      };
      return data;
    });

    let externalMateralIndex = 0;
    const dismantledMaterialsData = nokDismantledMaterials?.map(dmMaterial => {
      if (!dmMaterial.rwDismantledMaterialId) {
        externalMateralIndex--;
      }

      const data : FormDismantledMaterialData = {
        ...dmMaterial,
        recipeCode: dmMaterial.recipeCode || 'extra',
        index: dmMaterial.rwDismantledMaterialId ? dmMaterial.rwDismantledMaterialId : externalMateralIndex,
        index2: dmMaterial.rwDismantledMaterialId ? `dm-${ dmMaterial.index}` : `de-${externalMateralIndex}`,
      };
      return data;
    });

    const allMaterialsData =[...affectedMaterialsData, ...dismantledMaterialsData || []];
    console.log('$1 Dismantled Matrail Form ** affectedMaterialsData -> ', affectedMaterialsData);
    console.log('$2 Dismantled Matrail Form ** dismantledMaterialsData -> ', dismantledMaterialsData);
    console.log('$3 Dismantled Matrail Form ** allMaterialsData -> ', allMaterialsData);
    console.log('$4 Dismantled Matrail Form ** extraAffectedMaterials -> ', extraAffectedMaterials);
    // Remove duplicates Items
    const initialFormValues = allMaterialsData.filter((item, index, self) =>
      index === self.findIndex((t) => t.index === item.index)
    );

    console.log('$$ Dismantled Matrail Form ** initialFormValues -> ', initialFormValues);

    const select : string[] = [];
    initialFormValues.map(material => {
      if (material.isSelected) {
        select.push(material.index2);
      }
    });
    setFormValues(initialFormValues);
    setSelectedMaterials(select);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affectedMaterials, nokDismantledMaterials]);

  // Get Material List
  const materialResult = useQuery('materialList',materialServices.getMaterial, { refetchOnWindowFocus: false });
  const materialList = materialResult.data ? materialResult.data : [];

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof FormDismantledMaterialData; sortOrder: number }>({ sortItem: 'index2' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof FormDismantledMaterialData = sort.sortItem;

  const sortedMaterials: FormDismantledMaterialData[]  = formValues.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue !== undefined && bValue !== undefined) {
      if (aValue < bValue) {
        return -1 * sort.sortOrder;
      }
      if (aValue > bValue) {
        return 1 * sort.sortOrder;
      }
    }
    return 0;
  });

  // Table Header
  const columnHeader = [
    { id: 'recipeCode', lable: 'Recipe', width: '7%', minWidth: 10, borderRight: true },
    { id: 'material', lable: 'Material', width: '25%', minWidth: 10, borderRight: true },
    { id: 'recipeQty', lable: 'Recipe Qty', width: '5%', minWidth: '7%', borderRight: true },
    { id: 'traceable', lable: 'Traceable', width: '3%', minWidth: 7 , borderRight: true },
    { id: 'reusable', lable: 'Reusable', width: '5%', minWidth: 10, borderRight: true },
    { id: 'note', lable: 'Note', width: '20%', minWidth: 12, borderRight: true },
    { id: 'mandatoryRemove', lable: 'Mandatory Remove', width: '3%', minWidth: 5, borderRight: true },
    { id: 'dismantleQty', lable: 'Dismantle Qty', width: '10%', minWidth: 10, borderRight: true },
    { id: 'materialStatus', lable: 'Status', width: '12%', minWidth: 10, borderRight: false },
  ];

  const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({
    order,
    orderBy,
    onRequestSort,
  }) => {
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell
            key={'select'}
            align='right'
            sx={{ backgroundColor: '#1976d2', color: 'white', maxWidth: '10px',  borderRight: '1px solid white' }}
          >
          </TableCell>
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align='center'
              style={{ width: column.width ? column.width : undefined, minWidth: column.minWidth }}
              sx={{
                width: column.width ? column.width : undefined,
                minWidth: column.minWidth,
                padding: '1px',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRight: column.borderRight ? '1px solid white' : undefined,
                whiteSpace: 'none'
              }}
              sortDirection={orderBy === column.id ? order : false }
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc' }
                onClick={createSortHandler(column.id)}
                sx={{ padding: 0, margin: 0, display: 'contents', alignItems: 'center' }}
              >
                {column.lable}
                {orderBy === column.id ? (
                  <Box  sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof FormDismantledMaterialData) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  // Handle Select
  const handleSelect = (_event: React.MouseEvent<unknown>, index: string) => {
    const selectedIndex = index;
    if (selectedMaterials.includes(selectedIndex)){
      const newSelected = selectedMaterials.filter((id) => id !== selectedIndex);
      setSelectedMaterials(newSelected);
      // remove dismantled data
      const updateValue = formValues.find((item) => item.index2 === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = false;
        updateValue.actualDismantledQty = 0;
        updateValue.materialStatus = MaterialStatus.SCRAPPED;
      }
    } else {
      const newSelected = selectedMaterials.concat(selectedIndex);
      const updateValue = formValues.find((item) => item.index2 === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = true;
        updateValue.actualDismantledQty = updateValue.suggestedDismantledQty ? updateValue.suggestedDismantledQty : updateValue.recipeQty;
      }
      setSelectedMaterials(newSelected);
    }
    setConfirmActive(true);
    confirmChange(false);
  };

  // select all material
  const selectAll = () => {
    const selectedItem: string[] = [];
    formValues.forEach(item => {
      selectedItem.push(item.index2);
    });

    formValues.forEach(item => item.isSelected = true);
    setSelectedMaterials(selectedItem);
    setConfirmActive(true);
    confirmChange(false);
  };

  const isSelected = (index: string) => selectedMaterials.indexOf(index) !== -1;

  // Set Dismantle Qty
  const handleActualDismantleQty = (value: number, index: string) => {

    console.log('## Dismantled Matrail Form ** handleActualDismantleQty * params -> ', value, index);


    const updateValue = formValues.find((item) => item.index2 === index);
    if (value <= 0) {
      setNotification({ message: 'Dismantled Qty must be greater than 0', type: 'error', time: 5 });
    }
    if (updateValue && value > 0) {
      updateValue.actualDismantledQty = value;
      setFormValues([...formValues]);
      setConfirmActive(true);
      confirmChange(false);
      console.log('## Dismantled Matrail Form ** handleActualDismantleQty * update  -> ', updateValue);

    }
    if (updateValue && updateValue.recipeCode !== 'extra' && value > updateValue.recipeQty) {
      setOpenDialog(true);
    }
  };

  const handleStatus = (newValue: MaterialStatus, index: string) => {
    const updateValue = formValues.find((item) => item.index2 === index);
    if (updateValue) {
      updateValue.materialStatus = newValue;
    }
    setFormValues([...formValues]);
    setConfirmActive(true);
    confirmChange(false);
  };

  const handleResetSelection = () => {
    setSelectedMaterials([]);
    setConfirmActive(true);
    confirmChange(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddExtra = () => {
    const newExtraMaterial : FormDismantledMaterialData = {
      index: Math.round(Math.random()*-100),
      index2: `ae-${extraAffectedMaterials.length}`,
      recipeCode: 'extra',
      recipeDescription: 'extra',
      recipeQty: 0,
      suggestedDismantledQty: 0,
      mandatoryRemove: false,
      isSelected: true,
      actualDismantledQty: 1,
      materialStatus: MaterialStatus.SCRAPPED,
      id: undefined,
      material: materialList[0],
      rwDismantledMaterialId: 0, };
    setExteraAffectedMaterials(extraAffectedMaterials.concat(newExtraMaterial));
  };

  const handleAddMaterial = (newValue: Material, index: string) => {
    const updatedBom = extraAffectedMaterials.map((item) => {
      if (item.index2 === index) {
        return {
          ...item,
          material: newValue,
        };
      }
      return item;
    });
    setExteraAffectedMaterials(updatedBom);
    setConfirmActive(true);
  };

  const handleExtraMatrialQty = (value: number, index: string) => {
    const updatedBom = extraAffectedMaterials.map((item) => {
      if (item.index2 === index) {
        return {
          ...item,
          actualDismantledQty: value,
        };
      }
      return item;
    });
    setExteraAffectedMaterials(updatedBom);
  };

  const handleExtraMatrialStatus = (newValue: MaterialStatus, index: string) => {
    const updatedBom = extraAffectedMaterials.map((item) => {
      if (item.index2 === index) {
        return {
          ...item,
          status: newValue,
        };
      }
      return item;
    });
    setExteraAffectedMaterials(updatedBom);
  };

  const handleExtraMatrialRemove = (index: string) => {
    const extraMaterial = extraAffectedMaterials.filter((item,) => item.index2 !== index);
    setExteraAffectedMaterials(extraMaterial);
    setConfirmActive(true);
  };

  const handleConfirmSelection = () => {
    const dismantledmaterials : DismantledMaterialData[] = formValues.filter(material => material.isSelected);
    dismantledmaterials.forEach(material => {
      if (material.actualDismantledQty === 0) {
        material.actualDismantledQty = material.suggestedDismantledQty ? material.suggestedDismantledQty : material.recipeQty;
      }
      if (material.materialStatus === undefined) {
        material.materialStatus = MaterialStatus.SCRAPPED;
      }
    });

    if (extraAffectedMaterials.length > 0) {
      extraAffectedMaterials.forEach( em => {
        if (em.material && em.actualDismantledQty > 0) {
          const newMaterial : DismantledMaterialData = {
            isSelected: true,
            id: em.id,
            index:em.index,
            rwDismantledMaterialId: 0,
            recipeCode: 'extra',
            material: em.material,
            actualDismantledQty: em.actualDismantledQty,
            materialStatus: em.materialStatus ? em.materialStatus : MaterialStatus.SCRAPPED,
            recipeQty: 0,
          };
          dismantledmaterials.push(newMaterial);
        }
      });

    }
    confirmChange(true);
    setConfirmActive(false);
    confirmSelection(dismantledmaterials);
  };

  return(
    <Paper sx={{ pointerEvents: editable ? 'all' : 'none' }}>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
        <Typography margin={1}>Material Dismantle</Typography>
        <Typography margin={1}>{selectedMaterials.length} Items is Selected</Typography>
        <Stack direction={'row'} spacing={1} margin={.5}>
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleAddExtra}>
            Add Extra Material
          </Button>
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleResetSelection}>
            Clear Selection
          </Button>
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={selectAll} disabled={formValues.length === selectedMaterials.length}>
            Select All
          </Button>
          <Button
            variant='contained'
            color='primary'
            sx={{ height: '30px' }}
            onClick={handleConfirmSelection}
            disabled={!confirmActive}
          >
            Confirm
          </Button>
        </Stack>
      </Grid>
      <TableContainer  sx={{ maxHeight: '300px', overflow: 'auto' }}>
        <Table stickyHeader aria-label='sticky table' size='small' sx={{ tableLayout:'auto' }} >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof FormDismantledMaterialData)} />
          <TableBody>
            {extraAffectedMaterials.length > 0 ?
              extraAffectedMaterials.map((eMaterial) => {
                return(
                  <TableRow key={eMaterial.index2}>
                    <TableCell padding="none" sx={{ width:'22px', padding: '7px' }}>
                      <IconButton
                        title='remove'
                        color='primary'
                        sx={{  width: '20px', height: '20px', padding: '0px', margin: '0px' }}
                        onClick={() => handleExtraMatrialRemove(eMaterial.index2)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      Extra
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      <Autocomplete
                        id='materilas'
                        sx={{
                          '& .MuiInputBase-input': { maxHeight: '15px', padding: '0px', width: '100px' },
                          overflow: 'hidden',
                          marginLeft: '-8px'
                        }}
                        size='small'
                        aria-required
                        disableClearable={true}
                        options={materialList}
                        isOptionEqualToValue={(option: Material, value: Material) => option.id === value.id}
                        value={eMaterial.material}
                        onChange={(_event, newValue) => newValue && handleAddMaterial(newValue, eMaterial.index2)}
                        getOptionLabel={(option: { itemShortName: string; }) => option.itemShortName}
                        renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                          <TextField
                            {...params}
                            placeholder='Add Material'
                            size='small'
                            sx={{ width: '98%', margin: '2' }}
                            required />
                        )} />
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      -
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray',  background: eMaterial.material ? eMaterial.material.traceable ? '#FCFEA0' : '#A0F1FE' : null  }}>
                      {eMaterial.material ? (eMaterial.material.traceable ? 'Yes' : 'No') : ''}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      -
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      -
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      -
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      <TextField
                        name='actualDismantledQty'
                        sx={{ '& .MuiInputBase-input': { maxHeight: '10px', padding: '8px', textAlign: 'center' }, overflow: 'hidden' }}
                        variant='filled'
                        value={eMaterial.actualDismantledQty}
                        //defaultValue={1}
                        onChange={(event) => handleExtraMatrialQty(parseInt(event.target.value), eMaterial.index2)}
                        required />
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      <TextField
                        name='status'
                        sx={{
                          '& .MuiInputBase-input': { maxHeight: '15px', padding: '5px', textAlign: 'center', width: '100px' },
                          backgroundColor: eMaterial.materialStatus === MaterialStatus.OK ? '#A8F285' :
                            eMaterial.materialStatus === MaterialStatus.IQC ? '#FFFFAB' :
                              eMaterial.materialStatus === MaterialStatus.CLAIMABLE ? '#44bafc' : '#f93a00',
                          overflow: 'hidden',
                          marginLeft: '-10px'
                        }}
                        select
                        value={eMaterial.materialStatus}
                        onChange={(event) => handleExtraMatrialStatus(event.target.value as MaterialStatus, eMaterial.index2)}
                      >
                        {Object.values(MaterialStatus).map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ); })
              : null }
            {sortedMaterials.map((material) => {
              const isItemSelected = isSelected(material.index2);
              const labelId = `enhanced-table-checkbox-${material.index2}`;
              return (
                <TableRow
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={material.index}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="none" sx={{ width:'22px', padding: '7px' }}
                    onClick={(event) => handleSelect(event, material.index2)}
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      sx={{  width: '20px', height: '20px', padding: '0px', margin: '0px' }}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }} />
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {material.recipeCode}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                    {material.material.itemShortName}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {material.recipeQty}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray', background: material.material.traceable ? '#FCFEA0' : '#A0F1FE' }}>
                    {material.material.traceable ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell align='center' sx={{
                    borderRight: '1px solid gray',
                    backgroundColor: material.reusable === Reusable.YES ? '#A8F285' : material.reusable === Reusable.IQC ? '#FFFFAB' : '#F2A8A8'
                  }}>
                    {material.reusable}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                    {material.rwNote}
                  </TableCell>
                  <TableCell align='center'>
                    <Box justifyContent={'space-between'}>
                      <Checkbox
                        style={{ height: '16px', width: '16px' }}
                        checked={material.mandatoryRemove}
                        disabled={true} />
                    </Box>
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {material.isSelected ?
                      <TextField
                        name='actualDismantledQty'
                        sx={{ '& .MuiInputBase-input': { maxHeight: '15px', padding: '5px', textAlign: 'center' }, overflow: 'hidden' }}
                        variant='filled'
                        value={material.actualDismantledQty || material.suggestedDismantledQty}
                        onChange={(event) => handleActualDismantleQty(parseInt(event.target.value), material.index2)}
                        required /> :
                      ''}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {material.isSelected ?
                      <TextField
                        name='status'
                        sx={{
                          '& .MuiInputBase-input': { maxHeight: '15px', padding: '5px', textAlign: 'center', width: '100px' },
                          backgroundColor: material.materialStatus === MaterialStatus.OK ? '#A8F285' :
                            material.materialStatus === MaterialStatus.IQC ? '#FFFFAB' :
                              material.materialStatus === MaterialStatus.CLAIMABLE ? '#44bafc' : '#f93a00',
                          overflow: 'hidden',
                          marginLeft: '-10px'
                        }}
                        select
                        value={material.materialStatus}
                        onChange={(event) => handleStatus(event.target.value as MaterialStatus, material.index2)}
                      >
                        {(material.reusable === 'NO') ?
                          Object.values(MaterialStatus).filter(status => status !== 'OK').map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          )) :
                          Object.values(MaterialStatus).map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                      </TextField>
                      : ''}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Removed Qty is greater than BOM Qty?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The amount removed is greater than the amount consumed in the BOM,
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NokDismantledMaterialForm;