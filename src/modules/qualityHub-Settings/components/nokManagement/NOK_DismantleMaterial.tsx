import React, { useEffect } from 'react';
import { useState } from 'react';

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

import DeleteIcon from '@mui/icons-material/Delete';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { MaterialStatus, DismantledMaterial, Reusable, RwDismantledMaterial, Material } from '../../../../types/QualityHubTypes';
import { useQuery } from 'react-query';
import materialServices from '../../services/materialServices';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof FormData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type DismantleMaterialListProps = {
  affectedMaterials: RwDismantledMaterial[];
  rwDismantledMaterial? : DismantledMaterial[];
  confirmSelection: (dismantledMaterial: DismantledMaterial[]) => void;
  confirmChange: (value: boolean) => void;
  editable: boolean;
}

interface FormData extends DismantledMaterial {
  isSelected: boolean;
  materialStatus?: MaterialStatus;
}

type ExtraMaterial = {
    isSelected: boolean;
    id: string;
    material?: Material;
    actualDismantledQty: number;
    status?: MaterialStatus;
}

const NokDismantledMaterial = ({ affectedMaterials, rwDismantledMaterial, confirmSelection, confirmChange, editable } : DismantleMaterialListProps) => {

  console.log('## Dismantled Matrail Form ** rwDismantledMaterial -> ', rwDismantledMaterial);
   
  const [ selectedMaterials, setSelectedMaterials ] = useState<number[]>([]);
  const [ formValues, setFormValues ] = useState<FormData[]>([]);
  const [ confirmActive, setConfirmActive ] = useState<boolean>(false);
  const [ openDialog , setOpenDialog ] = useState<boolean>(false);
  const [ extraAffectedMaterials , setExteraAffectedMaterials ] = useState<ExtraMaterial[]>([]);

  const setNotification = useNotificationSet();

  useEffect(() => {
    const initialFormValues = affectedMaterials.map(material => {

      // find the rwDismantled Material where id is equal to material id
      const rwDismantled = rwDismantledMaterial?.find(rwm => rwm.recipeBomId === material.recipeBom.id);
      const data : FormData = {
        isSelected: rwDismantledMaterial?.map(dm => (dm.recipeBomId)).includes(material.recipeBom.id) || false,
        recipeCode: material.recipeBom.recipe.recipeCode,
        recipeDescription: material.recipeBom.recipe.description,
        material: material.recipeBom.material,
        recipeBomId: material.recipeBom.id,
        qty: material.recipeBom.qty,
        suggestedDismantledQty: material.dismantledQty,
        note: material.note,
        mandatoryRemove: material.mandatoryRemove,
        reusable: material.recipeBom.reusable,
        actualDismantledQty: rwDismantled ? rwDismantled?.actualDismantledQty : 0
      };
      return data;
    });

    const select : number[] = [];
    initialFormValues.map(material => {
      if (material.isSelected) {
        select.push(material.recipeBomId);
      }
    });
    setFormValues(initialFormValues);
    setSelectedMaterials(select);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affectedMaterials]);

  // Get Material List
  const materialResult = useQuery('materialList',materialServices.getMaterial, { refetchOnWindowFocus: false });
  const materialList = materialResult.data ? materialResult.data : [];

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof FormData; sortOrder: number }>({ sortItem: 'material' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof FormData = sort.sortItem;

  const sortedMaterials: FormData[]  = formValues.sort((a, b) => {
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
                //maxWidth: column.maxWidth ? column.maxWidth : undefined,
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof FormData) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  // Handle Select
  const handleSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = id;
    if (selectedMaterials.includes(selectedIndex)){
      const newSelected = selectedMaterials.filter((id) => id !== selectedIndex);
      setSelectedMaterials(newSelected);
      // remove dismantled data
      const updateValue = formValues.find((item) => item.recipeBomId === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = false;
        updateValue.actualDismantledQty = 0;
        updateValue.materialStatus = undefined;
      }
    } else {
      const newSelected = selectedMaterials.concat(selectedIndex);
      const updateValue = formValues.find((item) => item.recipeBomId === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = true;
      }
      setSelectedMaterials(newSelected);
    }
    setConfirmActive(true);
    confirmChange(false);
  };

  // select all material
  const selectAll = () => {
    const selectedItem: number[] = [];
    formValues.forEach(item => {
      selectedItem.push(item.recipeBomId);
    });

    formValues.forEach(item => item.isSelected = true);
    setSelectedMaterials(selectedItem);
    setConfirmActive(true);
    confirmChange(false);
  };

  const isSelected = (id: number) => selectedMaterials.indexOf(id) !== -1;

  // Set Dismantle Qty
  const handleActualDismantleQty = (value: number, index: number) => {

    const updateValue = formValues.find((item) => item.recipeBomId === index);
    if (value <= 0) {
      setNotification({ message: 'Dismantled Qty must be greater than 0', type: 'error', time: 5 });
    }
    if (updateValue && value > 0) {
      updateValue.actualDismantledQty = value;
      setFormValues([...formValues]);
      setConfirmActive(true);
      confirmChange(false);
    }
    if (updateValue && value > updateValue.qty) {
      setOpenDialog(true);
    }
  };

  const handleStatus = (newValue: MaterialStatus, index: number) => {
    const updateValue = formValues.find((item) => item.recipeBomId === index);
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
    const newExtraMaterial : ExtraMaterial = { isSelected: true, id:'extra', actualDismantledQty: 1 };
    setExteraAffectedMaterials(extraAffectedMaterials.concat(newExtraMaterial));
  };

  const handleAddMaterial = (newValue: Material, index: number) => {
    const updatedBom = extraAffectedMaterials.map((item, i) => {
      if (i === index) {
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

  const handleExtraMatrialQty = (value: number, index: number) => {
    const updatedBom = extraAffectedMaterials.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          actualDismantledQty: value,
        };
      }
      return item;
    });
    setExteraAffectedMaterials(updatedBom);
  };

  const handleExtraMatrialStatus = (newValue: MaterialStatus, index: number) => {
    const updatedBom = extraAffectedMaterials.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          status: newValue,
        };
      }
      return item;
    });
    setExteraAffectedMaterials(updatedBom);
  };

  const handleExtraMatrialRemove = (index: number) => {
    const extraMaterial = extraAffectedMaterials.filter((_item, i) => i !== index);
    setExteraAffectedMaterials(extraMaterial);
    setConfirmActive(true);
  };

  const handleConfirmSelection = () => {
    const dismantledmaterials : DismantledMaterial[] = formValues.filter(material => material.isSelected);
    dismantledmaterials.forEach(material => {
      if (material.actualDismantledQty === 0) {
        material.actualDismantledQty = material.suggestedDismantledQty ? material.suggestedDismantledQty : material.qty;
      }
      if (material.materialStatus === undefined) {
        material.materialStatus = MaterialStatus.SCRAPPED;
      }
    });

    if (extraAffectedMaterials.length > 0) {
      extraAffectedMaterials.forEach( em => {
        if (em.material && em.actualDismantledQty > 0) {
          const newMaterial : DismantledMaterial = {
            recipeBomId: 0,
            recipeCode: 'extra',
            material: em.material,
            actualDismantledQty: em.actualDismantledQty,
            materialStatus: em.status ? em.status : MaterialStatus.SCRAPPED,
            qty: 0
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
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof FormData)} />
          <TableBody>
            {extraAffectedMaterials.length > 0 ?
              extraAffectedMaterials.map((eMaterial, index) => {
                return(
                  <TableRow>
                    <TableCell padding="none" sx={{ width:'22px', padding: '7px' }}>
                      <IconButton
                        title='remove'
                        color='primary'
                        sx={{  width: '20px', height: '20px', padding: '0px', margin: '0px' }}
                        onClick={() => handleExtraMatrialRemove(index)}
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
                        onChange={(_event, newValue) => newValue && handleAddMaterial(newValue, index)}
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
                        defaultValue={1}
                        onChange={(event) => handleExtraMatrialQty(parseInt(event.target.value), index)}
                        required />
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      <TextField
                        name='status'
                        sx={{
                          '& .MuiInputBase-input': { maxHeight: '15px', padding: '5px', textAlign: 'center', width: '100px' },
                          backgroundColor: eMaterial.status === MaterialStatus.OK ? '#A8F285' : eMaterial.status === MaterialStatus.CLAIMABLE ? '#FFFFAB' : '#F2A8A8',
                          overflow: 'hidden',
                          marginLeft: '-10px'
                        }}
                        select
                        value={eMaterial.status}
                        defaultValue={MaterialStatus.SCRAPPED}
                        onChange={(event) => handleExtraMatrialStatus(event.target.value as MaterialStatus, index)}
                      >
                        {Object.values(MaterialStatus).map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ); })
              : null }
            {sortedMaterials.map((material, index) => {
              const isItemSelected = isSelected(material.recipeBomId);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={material.recipeBomId}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="none" sx={{ width:'22px', padding: '7px' }}
                    onClick={(event) => handleSelect(event, material.recipeBomId)}
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
                    {material.qty}
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
                    {material.note}
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
                        defaultValue={material.suggestedDismantledQty}
                        onChange={(event) => handleActualDismantleQty(parseInt(event.target.value), material.recipeBomId)}
                        required /> :
                      ''}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {material.isSelected ?
                      <TextField
                        name='status'
                        sx={{
                          '& .MuiInputBase-input': { maxHeight: '15px', padding: '5px', textAlign: 'center', width: '100px' },
                          backgroundColor: material.materialStatus === MaterialStatus.OK ? '#A8F285' : material.materialStatus === MaterialStatus.CLAIMABLE ? '#FFFFAB' : '#F2A8A8',
                          overflow: 'hidden',
                          marginLeft: '-10px'
                        }}
                        select
                        value={material.materialStatus}
                        defaultValue={MaterialStatus.SCRAPPED}
                        onChange={(event) => handleStatus(event.target.value as MaterialStatus, material.recipeBomId)}
                      >
                        {(material.reusable === 'NO') ?
                          Object.values(MaterialStatus).filter(status => status !== 'OK').map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          )) :
                          Object.values(MaterialStatus).map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                      </TextField>
                      : material.materialStatus}
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

export default NokDismantledMaterial;