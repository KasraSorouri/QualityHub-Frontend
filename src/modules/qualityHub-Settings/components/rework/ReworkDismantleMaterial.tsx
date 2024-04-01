import React from 'react';
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
  TextField
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { ConsumingMaterial, Reusable } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof DismantledMaterial;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

interface DismantledMaterial extends ConsumingMaterial {
  id: number;
  recipeCode: string;
  dismantledQty? : number;
  note?: string;
  mandatoryRemove?: boolean;
}

type DismantleMaterialListProps = {
  affectedMaterials: DismantledMaterial[];
  confirmSelection: (dismantledMaterial: DismantledMaterial[]) => void;
}

const ReworkDismantledMaterial = ({ affectedMaterials, confirmSelection } : DismantleMaterialListProps) => {

  const [ selectedMaterials, setSelectedMaterials ] = useState<number[]>([]);
  const [ dismantledMaterial, setDismantledMaterial ] = useState<DismantledMaterial[]>([]);

  const setNotification = useNotificationSet();

  console.log('** ** ** Rework Materials list * Affected Materials ->', affectedMaterials);

  console.log('* Rework Materials list * selected Materials ->', selectedMaterials);
  console.log('**** Rework Materials list * Dismantled Materials ->', dismantledMaterial);


  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof DismantledMaterial; sortOrder: number }>({ sortItem: 'recipeCode' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof DismantledMaterial = sort.sortItem;

  const sortedMaterials: DismantledMaterial[]  = affectedMaterials.sort((a, b) => {
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
    { id: 'qty', lable: 'Qty', width: '5%', minWidth: '7%', borderRight: true },
    { id: 'traceable', lable: 'Traceable', width: '5%', minWidth: 10, borderRight: true },
    { id: 'reusable', lable: 'Reusable', width: '5%', minWidth: 10, borderRight: true },
    { id: 'dismantleQty', lable: 'Dismantle Qty', width: '10%', minWidth: 10, borderRight: true },
    { id: 'note', lable: 'Note', width: '35%', minWidth: 10, borderRight: true },
    { id: 'mandatoryRemove', lable: 'Mandatory Remove', width: '3%', minWidth: 5, borderRight: true },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof DismantledMaterial) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  const handleSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = id;
    if (selectedMaterials.includes(selectedIndex)){
      const newSelected = selectedMaterials.filter((id) => id !== selectedIndex);
      setSelectedMaterials(newSelected);
    } else {
      const newSelected = selectedMaterials.concat(selectedIndex);
      const newDismantledMaterial = affectedMaterials.filter((item) => newSelected.includes(item.id));
      setDismantledMaterial(newDismantledMaterial);
      setSelectedMaterials(newSelected);
    }
  };

  const isSelected = (id: number) => selectedMaterials.indexOf(id) !== -1;

  // Set Dismantle Qty
  const handleDismantleQty = (value: number, index: number) => {

    const updateDismantled = dismantledMaterial.filter((item) => item.id === index);
    if (value <= 0) {
      setNotification({ message: 'Dismantled Qty must be greater than 0', type: 'error', time: 5 });
    }
    if (value > updateDismantled[0].qty) {
      setNotification({ message: 'Dismantled Qty must be less than or equal to the Qty', type: 'error', time: 5 });
    } else {
      if (updateDismantled.length > 0 && value > 0) {
        updateDismantled[0].dismantledQty = value;
      }
      const newDismantledMaterial = [...dismantledMaterial];
      setDismantledMaterial(newDismantledMaterial);
    }
  };

  // Set Dismantle Note
  const handleDismantleNote = (value: string, index: number) => {
    const updateDismantled = dismantledMaterial.filter((item) => item.id === index);
    if (updateDismantled.length > 0) {
      updateDismantled[0].note = value;
    }
    const newDismantledMaterial = [...dismantledMaterial];
    setDismantledMaterial(newDismantledMaterial);
  };

  // Set Mandatory Remove
  const handleMandatoryRemove = (value: boolean, index: number) => {
    const updateDismantled = dismantledMaterial.filter((item) => item.id === index);
    if (updateDismantled.length > 0) {
      updateDismantled[0].mandatoryRemove = value;
    }
    const newDismantledMaterial = [...dismantledMaterial];
    setDismantledMaterial(newDismantledMaterial);
  };

  const handleResetSelection = () => {
    setSelectedMaterials([]);
    setDismantledMaterial([]);
  };

  const handleConfirmSelection = () => {
    console.log('** * **Confirm dismantle material ->', dismantledMaterial);

    confirmSelection(dismantledMaterial);
  };

  return(
    <Paper>
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
            disabled={!dismantledMaterial.every(item => item.dismantledQty && item.dismantledQty > 0)}
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
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof DismantledMaterial)}
          />
          <TableBody>
            { sortedMaterials.map((material, index) => {
              const isItemSelected = isSelected(material.id);
              const labelId = `enhanced-table-checkbox-${index}`;

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
                      {material.recipeCode}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {material.material.itemShortName}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {material.qty}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' , background: material.material.traceable ? '#FCFEA0' : '#A0F1FE' }} >
                      {material.material.traceable ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray',
                      backgroundColor: material.reusable === Reusable.YES ? '#A8F285' : material.reusable === Reusable.IQC ? '#FFFFAB' : '#F2A8A8' }} >
                      {material.reusable}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {selectedMaterials.includes(material.id) ?
                        <TextField
                          name='qty'
                          sx={{ '& .MuiInputBase-input': { maxHeight: 'inhirent', margin: 0, padding: '0px', textAlign: 'center' } , overflow: 'hidden' }}
                          variant= 'filled'
                          value={material.dismantledQty}
                          onChange={(event) => handleDismantleQty(parseInt(event.target.value), material.id)}
                          InputProps={{ inputProps: { min: 1, max: material. qty, step: 1 } } }
                          required /> :
                        '' }
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {selectedMaterials.includes(material.id) ?
                        <TextField
                          name='note'
                          sx={{ '& .MuiInputBase-input': { maxHeight: 'inhirent', margin: 0, padding: '0px' } , overflow: 'hidden' }}
                          variant= 'filled'
                          value={material.note}
                          onChange={(event) => handleDismantleNote((event.target.value), material.id)}
                        /> :
                        '' }
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        {selectedMaterials.includes(material.id) ?
                          <Checkbox
                            style={{ height: '16px', width: '16px' }}
                            disabled={!selectedMaterials.includes(material.id)}
                            checked={material.mandatoryRemove}
                            onChange={(event) => handleMandatoryRemove(event.target.checked, material.id)}
                          />
                          :
                          <Checkbox
                            style={{ height: '16px', width: '16px' }}
                            disabled={!selectedMaterials.includes(material.id)}
                            checked={false}
                          />
                        }
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