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
  Stack
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { Rework } from '../../../../types/QualityHubTypes';
import React from 'react';
import { useQuery } from 'react-query';
import reworkServices from '../../services/reworkServices';
import dayjs from 'dayjs';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Rework;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RecipeListProps = {
  productId: number;
  selectedReworks: number[];
  confirmSelection: (reworks : Rework[]) => void;
  confirmChange: (value: boolean ) => void;
  editable: boolean;
}


const ReworkChooseList = ({ productId, selectedReworks, confirmSelection, confirmChange, editable } : RecipeListProps) => {

  console.log('selectedReworks ->', selectedReworks);

  const [ selectedRw, setSelectedRw ] = useState<number[]>(selectedReworks);
  const [ confirmActive, setConfirmActive ] = useState<boolean>(false);

  const filterParameters = {
    productId: productId,
  };

  console.log('selectedReworks * confirmActive  ->', confirmActive);

  const reworkResults = useQuery(['reworks',filterParameters], async() => {
    const response = await reworkServices.getFilteredRework(filterParameters);
    return response;
  },{ refetchOnWindowFocus: false, enabled: true });

  const reworks: Rework[] = reworkResults.data || [];

  console.log('rework List * reworkResults ->', reworkResults);
  console.log('rework List * selectedRw ->', selectedRw);


  console.log('rework List * reworks ->', reworks);

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof Rework; sortOrder: number }>({ sortItem: 'reworkShortDesc' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof Rework = sort.sortItem;

  const sortedReworks: Rework[]  = reworks.sort((a, b) => {
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
    { id: 'reworkShortDesc', lable: 'Description', witdh: '40%', minWidth: 10, borderRight: true },
    { id: 'nokCode', lable: 'NOK Code', width: '10%', minWidth: 20, borderRight: true },
    { id: 'station', lable: 'Station', width: '10%', minWidth: 10, borderRight: true },
    { id: 'order', lable: 'order', width: '7%', minWidth: 10, borderRight: true },
    { id: 'creationDate', lable: 'Creation Date', width: '20%', minWidth: 10, borderRight: true },
    { id: 'active', lable: 'Active', width: 2 },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Rework) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  const handleSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = id;
    setConfirmActive(true);
    if (selectedRw.includes(selectedIndex)){
      const newSelected = selectedRw.filter((id) => id !== selectedIndex);
      setSelectedRw(newSelected);
    } else {
      const newSelected = selectedRw.concat(selectedIndex);
      setSelectedRw(newSelected);
    }
    confirmChange(false);
  };

  const isSelected = (id: number) => selectedRw.indexOf(id) !== -1;

  const handleResetSelection = () => {
    setSelectedRw([]);
    setConfirmActive(true);
    confirmChange(false);
  };

  const handleConfirmSelection = () => {
    confirmChange(true);
    setConfirmActive(false);
    const selectedReworks = reworks.filter(rework => selectedRw.includes(rework.id));
    confirmSelection(selectedReworks);
  };

  return(
    <Paper sx={{ pointerEvents: editable ? 'all' : 'none' }}>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >{selectedRw.length} Rework is Selected</Typography>
        <Stack direction={'row'} spacing={1} margin={.5} >
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleResetSelection} >
            Clear Selection
          </Button>
          <Button variant='contained' color='primary' /*disabled={!confirmActive}*/ sx={{ height: '30px' }} onClick={handleConfirmSelection} >
            Confirm
          </Button>
        </Stack>
      </Grid>
      <TableContainer sx={{ maxHeight: '200Px' }}  >
        <Table stickyHeader aria-label='sticky table' size='small' >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Rework)}
          />
          <TableBody>
            { sortedReworks.map((rework, index) => {
              const isItemSelected = isSelected(rework.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return(
                <React.Fragment key={rework.id}>
                  <TableRow
                    hover
                    onClick={(event) => handleSelect(event, rework.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={rework.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {rework.reworkShortDesc}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.nokCode.nokCode}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.station.stationName}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.order}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {dayjs(rework.creationDate).format('YYYY.MM.DD  hh:mm')}
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        <Checkbox checked={rework.active} style={{ height: '16px', width: '16px' }}/>
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

export default ReworkChooseList;