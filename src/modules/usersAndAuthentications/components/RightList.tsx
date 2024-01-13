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
  IconButton,
  Typography,
  Grid,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { visuallyHidden } from '@mui/utils';

import { Right } from '../../../types/UserAuthTypes';

type rightListProps = {
  rights: Right[];
  allRights: number;
  displayRightForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectRight: (rightData: Right | null) => void;
}

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

const RightList = ({ rights, allRights, displayRightForm, selectRight } : rightListProps) => {

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof Right; sortOrder: number }>({ sortItem: 'right' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof Right = sort.sortItem;

  const sortedRights: Right[]  = rights.sort((a, b) => {
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

  const showEditRight = (id : string) => {
    const roleData = rights.filter((r) => r.id === id )[0];
    selectRight(roleData);
    displayRightForm({ show: true, formType: 'EDIT' });
  };

  const addNewRight = () => {
    displayRightForm({ show: true, formType: 'ADD' });
  };

  const columnHeader = [
    { id: 'right', lable: 'Right', minWidth: 10 },
    { id: 'relatedModule', lable: 'Module', minWidth: 10 },
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
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align='center'
              style={{ minWidth: column.minWidth }}
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
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

  const handleRequestSort = (_event : undefined, property : keyof Right) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  return(
    <div>
      <Paper>
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
          <Typography margin={1} >RIGHT LIST</Typography>
          <Typography margin={1} >{rights.length} of {allRights} rights</Typography>
          <div style={{ margin: '10px' }} >
            <IconButton onClick={addNewRight} style={{ height: '16px', width: '16px', color:'white' }}>
              <AddIcon />
            </IconButton>
          </div>
        </Grid>
        <TableContainer sx={{ maxHeight: '250Px' }}>
          <Table stickyHeader aria-label='sticky table' size='small'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={() => handleRequestSort}
            />
            <TableBody>
              { sortedRights.map((right) => {
                return(
                  <TableRow hover role='checkbox' tabIndex={-1} key={right.id} >
                    <TableCell align='left' >
                      {right.right}
                    </TableCell>
                    <TableCell align='center' >
                      {right.relatedModule}
                    </TableCell>
                    <IconButton onClick={() => showEditRight(right.id)} style={{ height: '12px', width: '12px', marginLeft: 25 , color:'#1976d2d9' }}>
                      <EditIcon />
                    </IconButton>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );

};

export default RightList;