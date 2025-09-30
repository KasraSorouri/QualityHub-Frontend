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
  IconButton,
  Grid,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { WorkShift } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof WorkShift;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type ShiftListProps = {
  shifts: WorkShift[];
  displayShiftForm: ({ show, formType }: { show: boolean; formType: 'ADD' | 'EDIT' }) => void;
  selectShift: (ShiftData: WorkShift | null) => void;
};

const ShiftList = ({ shifts, displayShiftForm, selectShift }: ShiftListProps) => {
  // Sort Items
  const [sort, setSort] = useState<{ sortItem: keyof WorkShift; sortOrder: number }>({
    sortItem: 'shiftName',
    sortOrder: 1,
  });
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof WorkShift = sort.sortItem;

  const sortedShifts: WorkShift[] = shifts.sort((a, b) => {
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
    { id: 'shiftName', lable: 'Shift Name', width: '40%', borderRight: true },
    { id: 'shidtCode', lable: 'Shift Code', width: '40%', borderRight: true },
    { id: 'active', lable: 'Active', minWidth: 3 },
  ];

  const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({ order, orderBy, onRequestSort }) => {
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align="center"
              style={{ width: column.width ? column.width : undefined, minWidth: column.minWidth }}
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                borderRight: column.borderRight ? '1px solid white' : undefined,
              }}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.lable}
                {orderBy === column.id ? (
                  <Box sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof WorkShift) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
  };

  const showEditShift = (id: number | string) => {
    const shiftData: WorkShift = shifts.filter((u) => u.id === id)[0];
    selectShift(shiftData);
    displayShiftForm({ show: true, formType: 'EDIT' });
  };

  const addNewShift = () => {
    selectShift(null);
    displayShiftForm({ show: true, formType: 'ADD' });
  };

  return (
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
        <Typography margin={1}>Work Shifts</Typography>
        <Typography margin={1}>{shifts.length} Shifts</Typography>
        <div style={{ margin: '10px' }}>
          <IconButton onClick={addNewShift} style={{ height: '16px', width: '16px', color: 'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof WorkShift)}
          />
          <TableBody>
            {sortedShifts.map((shift) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={shift.id}>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {shift.shiftName}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {shift.shiftCode}
                  </TableCell>
                  <TableCell align="center">
                    <Box justifyContent={'space-between'}>
                      <Checkbox checked={shift.active} style={{ height: '16px', width: '16px' }} />
                      <IconButton
                        onClick={() => showEditShift(shift.id)}
                        title="Edit"
                        style={{ height: '12px', width: '12px', marginLeft: 25, color: '#1976d2d9' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShiftList;
