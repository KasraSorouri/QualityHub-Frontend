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
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { AffectedMaterial, MaterialStatus, DismantledMaterial, Reusable, RwDismantledMaterial } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof FormData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type DismantleMaterialListProps = {
  affectedMaterials: RwDismantledMaterial[];
  rwDismantledMaterial? : DismantledMaterial[];
  confirmSelection: (dismantledMaterial: DismantledMaterial[]) => void;
  confirmChange: (value: boolean ) => void;
  editable: boolean;
}

interface FormData extends DismantledMaterial {
  isSelected: boolean;
  materialStatus?: MaterialStatus;
}

const NokDismantledMaterial = ({ affectedMaterials, rwDismantledMaterial, confirmSelection, confirmChange, editable } : DismantleMaterialListProps) => {

  const [ selectedMaterials, setSelectedMaterials ] = useState<number[]>([]);
  const [ formValues, setFormValues ] = useState<FormData[]>([]);
  const [ confirmActive, setConfirmActive ] = useState<boolean>(false);

  const setNotification = useNotificationSet();

  console.log(' rework Dismantled materail in NOK * affectedMaterials ', affectedMaterials);
  console.log(' rework Dismantled materail in NOK * rwDismantledMaterial ', rwDismantledMaterial);
  console.log('******* rework Dismantled materail in NOK * formValues ', formValues);


  useEffect(() => {
    const initialFormValues = affectedMaterials.map(material => {

      // find the rwDismantled Material where id is equal to material id
      const rwDismantled = rwDismantledMaterial?.find(rwm => rwm.recipeBom.id === material.recipeBom.id);
      return {
        isSelected: rwDismantledMaterial?.map(dm => (dm.recipeBom.id)).includes(material.recipeBom.id) || false,
        ...material,
        mandatoryRemove: rwDismantled ? rwDismantled.mandatoryRemove : false,
        actualDismantledQty: rwDismantled ? rwDismantled?.actualDismantledQty : 0
      };
    });

    const select : number[] = [];
    initialFormValues.map(material => {
      if (material.isSelected) {
        select.push(material.recipeBom.id);
      }
    });
    setFormValues(initialFormValues);
    setSelectedMaterials(select);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affectedMaterials]);

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof FormData; sortOrder: number }>({ sortItem: 'id' , sortOrder: 1 });
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
          />
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align='center'
              style={{ width: column.width ? column.width : undefined, minWidth: column.minWidth }}
              sx={{ backgroundColor: '#1976d2', color: 'white' , borderRight: column.borderRight ? '1px solid white' : undefined }}
              sortDirection={orderBy === column.id ? order : false }
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc' }
                onClick={createSortHandler(column.id)}
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof AffectedMaterial) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  const handleSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = id;
    if (selectedMaterials.includes(selectedIndex)){
      const newSelected = selectedMaterials.filter((id) => id !== selectedIndex);
      setSelectedMaterials(newSelected);
      // remove dismantled data
      const updateValue = formValues.find((item) => item.recipeBom.id === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = false;
        updateValue.dismantledQty = 0;
        updateValue.materialStatus = undefined;
      }
      setConfirmActive(true);
    } else {
      const newSelected = selectedMaterials.concat(selectedIndex);
      const updateValue = formValues.find((item) => item.recipeBom.id === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = true;
      }
      setSelectedMaterials(newSelected);
    }
    confirmChange(false);
  };

  const isSelected = (id: number) => selectedMaterials.indexOf(id) !== -1;

  // Set Dismantle Qty
  const handleActualDismantleQty = (value: number, index: number) => {

    const updateValue = formValues.find((item) => item.recipeBom.id === index);
    if (value <= 0) {
      setNotification({ message: 'Dismantled Qty must be greater than 0', type: 'error', time: 5 });
    }
    if (updateValue && value > updateValue.recipeBom.qty) {
      setNotification({ message: 'Dismantled Qty must be less than or equal to the Qty', type: 'error', time: 5 });
    } else {
      if (updateValue && value > 0) {
        updateValue.actualDismantledQty = value;
      }
    }
    setFormValues([...formValues]);
    setConfirmActive(true);
    confirmChange(false);
  };

  const handleStatus = (newValue: MaterialStatus, index: number) => {
    const updateValue = formValues.find((item) => item.recipeBom.id === index);
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

  const handleConfirmSelection = () => {
    const dismantledmaterials : DismantledMaterial[] = formValues.filter(material => material.isSelected);
    const isDataCorrect = dismantledmaterials.every(item => item.dismantledQty > 0);
    if (isDataCorrect) {
      confirmChange(true);
      setConfirmActive(false);
      confirmSelection(dismantledmaterials);
    }

  };

  return(
    <Paper sx={{ pointerEvents: editable ? 'all' : 'none' }}>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >Material Dismantle</Typography>
        <Typography margin={1} >{selectedMaterials.length} Items is Selected</Typography>
        <Stack direction={'row'} spacing={1} margin={.5} >
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleResetSelection} >
            Clear Selection
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
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof AffectedMaterial)}
          />
          <TableBody>
            { sortedMaterials.map((material, index) => {
              const isItemSelected = isSelected(material.recipeBom.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              //const formValue = formValues.filter((item) => item.id === material.id);
              return(
                <React.Fragment key={material.recipeBom.id}>
                  <TableRow
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={material.recipeBom.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(event) => handleSelect(event, material.recipeBom.id)}
                    >
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {material.recipeBom.recipe.recipeCode}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {material.recipeBom.material.itemShortName}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {material.recipeBom.qty}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' , background: material.recipeBom.material.traceable ? '#FCFEA0' : '#A0F1FE' }} >
                      {material.recipeBom.material.traceable ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray',
                      backgroundColor: material.recipeBom.reusable === Reusable.YES ? '#A8F285' : material.recipeBom.reusable === Reusable.IQC ? '#FFFFAB' : '#F2A8A8' }} >
                      {material.recipeBom.reusable}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {material.note}
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        <Checkbox
                          style={{ height: '16px', width: '16px' }}
                          checked={material.mandatoryRemove}
                          disabled={true}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {material.isSelected ?
                        <TextField
                          name='qty'
                          sx={{ '& .MuiInputBase-input': { maxHeight: 'inherit', margin: 0, padding: '0px', textAlign: 'center' } , overflow: 'hidden' }}
                          variant= 'filled'
                          value={material.actualDismantledQty || material.dismantledQty}
                          defaultValue={material.dismantledQty}
                          onChange={(event) => handleActualDismantleQty(parseInt(event.target.value), material.recipeBom.id)}
                          InputProps={{ inputProps: { min: 1, max: material.recipeBom.qty, step: 1 } } }
                          required /> :
                        '' }
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      {material.isSelected ?
                        <TextField
                          name='status'
                          sx={{ '& .MuiInputBase-input': { maxHeight: 'inherit', margin: 0, padding: '0px', textAlign: 'center' ,width: '100px' },
                            backgroundColor: material.materialStatus === MaterialStatus.OK ? '#A8F285' : material.materialStatus === MaterialStatus.CLAIMABLE ? '#FFFFAB' : '#F2A8A8'
                            , overflow: 'hidden' }}
                          select
                          value={material.materialStatus}
                          defaultValue={MaterialStatus.SCRAPPED}
                          onChange={(event) => handleStatus(event.target.value as MaterialStatus,material.recipeBom.id)}
                        >
                          {Object.values(MaterialStatus).map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </TextField>
                        : material.materialStatus
                      }
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NokDismantledMaterial;