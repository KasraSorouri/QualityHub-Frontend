import React,{ useState } from 'react';
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
  Grid
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { Rework } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Rework;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type ReworkListProps = {
  reworks: Rework[];
  displayReworkForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectRework: (ReworkData: Rework | null) => void;
}


const ReworkList = ({ reworks, displayReworkForm, selectRework } : ReworkListProps) => {

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof Rework; sortOrder: number }>({ sortItem: 'creationDate' , sortOrder: 1 });
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
    { id: 'reworkShortDesc', lable: 'Rework', width:'5%', minWidth: 5, borderRight: true },
    { id: 'nokCode', lable: 'Nok Code', width:'5%', minWidth: 5, borderRight: true },
    { id: 'station', lable: 'Station', width:'20%', minWidth: 5, borderRight: true },
    { id: 'description', lable: 'Description', width:'30%', minWidth: 20, borderRight: true },
    { id: 'order', lable: 'order', width:'5%', minWidth: 5, borderRight: true },
    { id: 'timeDuration', lable: 'Duration', width:'3%', minWidth: 3, borderRight: true },
    { id: 'creationDate', lable: 'Creation Date', width:'5%', minWidth: 7, borderRight: true },
    { id: 'deprecatedDate', lable: 'Deprecated Date', width:'5%', minWidth: 7, borderRight: true },
    { id: 'active', lable: 'Active', width: 3 },
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

  const showEditRework = (id : number | string) => {
    const reworkData: Rework = reworks.filter((u) => u.id === id )[0];
    selectRework(reworkData);
    displayReworkForm({ show: true, formType: 'EDIT' });
  };

  const addNewRework = () => {
    selectRework(null);
    displayReworkForm({ show: true, formType: 'ADD' });
  };


  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >REWORK LIST</Typography>
        <Typography margin={1} >{reworks.length} Reworks</Typography>
        <div style={{ margin: '10px' }} >
          <IconButton onClick={addNewRework} style={{ height: '16px', width: '16px', color:'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Rework)}
          />
          <TableBody>
            { sortedReworks.map((rework) => {
              return(
                <React.Fragment key={rework.id}>
                  <TableRow hover role='checkbox' tabIndex={-1} key={rework.id} >
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.reworkShortDesc}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {rework.nokCode.nokCode}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.station.stationName}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {rework.description}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.order}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.timeDuration}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {new Date(rework.creationDate).toISOString().split('T')[0].replace(/-/g, '.')}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {rework.deprecatedDate ? new Date(rework.deprecatedDate).toISOString().split('T')[0].replace(/-/g, '.') : ''}
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        <Checkbox checked={rework.active} style={{ height: '16px', width: '16px' }}/>
                        <IconButton onClick={() => showEditRework(rework.id)}
                          title='Edit'
                          style={{ height: '12px', width: '12px', marginLeft: 25 , color:'#1976d2d9' }}>
                          <EditIcon />
                        </IconButton>
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

export default ReworkList;