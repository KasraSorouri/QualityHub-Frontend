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

import { Machine } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Machine;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type MachineListProps = {
  machines: Machine[];
  displayMachineForm: ({ show, formType }: { show: boolean; formType: 'ADD' | 'EDIT' }) => void;
  selectMachine: (MachineData: Machine | null) => void;
};

const MachineList = ({ machines, displayMachineForm, selectMachine }: MachineListProps) => {
  // Sort Items
  const [sort, setSort] = useState<{ sortItem: keyof Machine; sortOrder: number }>({
    sortItem: 'machineName',
    sortOrder: 1,
  });
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof Machine = sort.sortItem;

  const sortedMachines: Machine[] = machines.sort((a, b) => {
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
    { id: 'machineName', lable: 'Device / Tool Name', width: '25%', borderRight: true },
    { id: 'machineCode', lable: 'Device / Tool Code', width: '10%', borderRight: true },
    { id: 'description', lable: 'Description', width: '35%', borderRight: true },
    { id: 'station', lable: 'Place', width: '30%', borderRight: true },
    { id: 'active', lable: 'Active', width: 3 },
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
              style={{ width: column.width ? column.width : undefined }}
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Machine) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
  };

  const showEditMachine = (id: number | string) => {
    const machineData: Machine = machines.filter((u) => u.id === id)[0];
    selectMachine(machineData);
    displayMachineForm({ show: true, formType: 'EDIT' });
  };

  const addNewMachine = () => {
    selectMachine(null);
    displayMachineForm({ show: true, formType: 'ADD' });
  };

  return (
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
        <Typography margin={1}>Device / Machines / Tools</Typography>
        <Typography margin={1}>{machines.length} items</Typography>
        <div style={{ margin: '10px' }}>
          <IconButton onClick={addNewMachine} style={{ height: '16px', width: '16px', color: 'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Machine)}
          />
          <TableBody>
            {sortedMachines.map((machine) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={machine.id}>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {machine.machineName}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {machine.machineCode}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {machine.description}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {machine.station?.stationCode}
                  </TableCell>
                  <TableCell align="center">
                    <Box justifyContent={'space-between'}>
                      <Checkbox checked={machine.active} style={{ height: '16px', width: '16px' }} />
                      <IconButton
                        onClick={() => showEditMachine(machine.id)}
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

export default MachineList;
