import React, { useEffect, useState } from 'react';

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
  TextField
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { AffectedMaterial, RwDismantledMaterial, Reusable } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof FormData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type DismantleMaterialListProps = {
  affectedMaterials: AffectedMaterial[];
  rwDismantledMaterial? : RwDismantledMaterial[];
  confirmSelection: (dismantledMaterial: RwDismantledMaterial[]) => void;
  confirmChange: (value: boolean ) => void;
  editable: boolean;
}

interface FormData extends RwDismantledMaterial {
  isSelected: boolean;
}

const ReworkDismantledMaterial = ({ affectedMaterials, rwDismantledMaterial, confirmSelection, confirmChange, editable } : DismantleMaterialListProps) => {

  const [ selectedMaterials, setSelectedMaterials ] = useState<number[]>([]);
  const [ formValues, setFormValues ] = useState<FormData[]>([]);
  const [ confirmActive, setConfirmActive ] = useState<boolean>(false);

  const setNotification = useNotificationSet();
 
  useEffect(() => {
    const initialFormValues = affectedMaterials.map(material => {

      // find the rwDismantled Material where id is equal to material id
      const rwDismantled = rwDismantledMaterial?.find((rwm: { recipeBom: { id: number | undefined; }; }) => rwm.recipeBom.id === material.recipeBom?.id);
      return {
        id: material.recipeBom?.id || 0,
        isSelected: typeof material.recipeBom?.id === 'number' && rwDismantledMaterial?.map((dm: { recipeBom: { id: number; }; }) => dm.recipeBom.id).includes(material.recipeBom.id) || false,
        //...(rwDismantled ? { rwDismantledMaterial: rwDismantled.rwDismantledMaterial } : {}),
        ...material,
        dismantledQty: rwDismantled ? rwDismantled.dismantledQty : 0,
        note: rwDismantled ? rwDismantled.note : '',
        mandatoryRemove: rwDismantled ? rwDismantled.mandatoryRemove : false
      };
    });

    const select : number[] = [];
    initialFormValues.map(material => {
      if (material.isSelected && material.recipeBom) {
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
    { id: 'traceable', lable: 'Traceable', width: '5%', minWidth: 10, borderRight: true },
    { id: 'reusable', lable: 'Reusable', width: '5%', minWidth: 10, borderRight: true },
    { id: 'dismantleQty', lable: 'Dismantle Qty', width: '10%', minWidth: 10, borderRight: true },
    { id: 'note', lable: 'Note', width: '45%', minWidth: 12, borderRight: true },
    { id: 'mandatoryRemove', lable: 'Mandatory Remove', width: '3%', minWidth: 5, borderRight: false },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof FormData) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  const handleSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = id;
    if (selectedMaterials.includes(selectedIndex)){
      const newSelected = selectedMaterials.filter((id) => id !== selectedIndex);
      setSelectedMaterials(newSelected);
      // remove dismantled data
      const updateValue = formValues.find((item) => item.id === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = false;
        updateValue.dismantledQty = 0;
        updateValue.note = '';
        updateValue.mandatoryRemove = false;
      }
      setConfirmActive(true);
    } else {
      const newSelected = selectedMaterials.concat(selectedIndex);
      const updateValue = formValues.find((item) => item.id === selectedIndex);
      if (updateValue) {
        updateValue.isSelected = true;
      }
      setSelectedMaterials(newSelected);
    }
    confirmChange(false);
  };

  const isSelected = (id: number) => selectedMaterials.indexOf(id) !== -1;

  // Set Dismantle Qty
  const handleDismantleQty = (value: number, index: number) => {

    const updateValue = formValues.filter((item) => item.id === index);
    if (value <= 0) {
      setNotification({ message: 'Dismantled Qty must be greater than 0', type: 'error', time: 5 });
    }
    if (updateValue[0].recipeBom && value > updateValue[0].recipeBom.qty) {
      setNotification({ message: 'Dismantled Qty must be less than or equal to the Qty', type: 'error', time: 5 });
    } else {
      if (updateValue.length > 0 && value > 0) {
        updateValue[0].dismantledQty = value;
      }
    }
    setConfirmActive(true);
    confirmChange(false);
  };

  // Set Dismantle Note
  const handleDismantleNote = (value: string, index: number) => {
    const updateValue = formValues.filter((item) => item.id === index);
    if (updateValue.length > 0) {
      updateValue[0].note = value;
    }
    setConfirmActive(true);
    confirmChange(false);
  };

  // Set Mandatory Remove
  const handleMandatoryRemove = (value: boolean, index: number) => {
    const updateValue = formValues.filter((item) => item.id === index);
    if (updateValue.length > 0) {
      updateValue[0].mandatoryRemove = value;
    }
    setConfirmActive(true);
    confirmChange(false);
  };

  const handleResetSelection = () => {
    setSelectedMaterials([]);
    setConfirmActive(true);
    confirmChange(false);
  };

  const handleConfirmSelection = () => {
    const dismantledmaterials : RwDismantledMaterial[] = formValues.filter(material => material.isSelected);
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
        <Typography margin={1} >Material Dismantle (Material will be removed)</Typography>
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
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof FormData)}
          />
          <TableBody>
            { sortedMaterials.map((material, index) => {
              const isItemSelected = isSelected(material.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              //const formValue = formValues.filter((item) => item.id === material.id);
              return(
                <React.Fragment key={material.id}>
                  <TableRow
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={material.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(event) => handleSelect(event, material.id)}
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
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {material.isSelected ?
                        <TextField
                          name='qty'
                          sx={{ '& .MuiInputBase-input': { maxHeight: 'inherit', margin: 0, padding: '0px', textAlign: 'center' } , overflow: 'hidden' }}
                          variant= 'filled'
                          value={material.dismantledQty || ''}
                          onChange={(event) => handleDismantleQty(parseInt(event.target.value), material.id)}
                          InputProps={{ inputProps: { min: 1, max: material.recipeBom.qty, step: 1 } } }
                          required /> :
                        '' }
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {material.isSelected ?
                        <TextField
                          name='note'
                          sx={{ '& .MuiInputBase-input': { maxHeight: 'inherit', margin: 0, padding: '0px' } , overflow: 'hidden' }}
                          variant= 'filled'
                          value={material.note || ''}
                          onChange={(event) => handleDismantleNote((event.target.value), material.id)}
                        /> :
                        '' }
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        <Checkbox
                          style={{ height: '16px', width: '16px' }}
                          checked={material.isSelected ? material.mandatoryRemove : false}
                          disabled={!material.isSelected}
                          onChange={(event) => handleMandatoryRemove(event.target.checked, material.id)}
                        />
                      </Box>
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

export default ReworkDismantledMaterial;