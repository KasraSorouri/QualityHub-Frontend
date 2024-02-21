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
  Grid
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { RcaCode } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof RcaCode;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RcaCodeListProps = {
  rcaCodes: RcaCode[];
  displayRcaCodeForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectRcaCode: (RcaCodeData: RcaCode | null) => void;
}


const RcaCodeList = ({ rcaCodes, displayRcaCodeForm, selectRcaCode } : RcaCodeListProps) => {


  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof RcaCode; sortOrder: number }>({ sortItem: 'rcaCode' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof RcaCode = sort.sortItem;

  const sortedRcaCodes: RcaCode[]  = rcaCodes.sort((a, b) => {
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
    { id: 'rcaCode', lable: 'RCA Code', minWidth: 10, borderRight: true },
    { id: 'rcaDesc', lable: 'Description', minWidth: 10, borderRight: true },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof RcaCode) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const showEditRcaCode = (id : number | string) => {
    const rcaCodeData: RcaCode = rcaCodes.filter((u) => u.id === id )[0];
    selectRcaCode(rcaCodeData);
    displayRcaCodeForm({ show: true, formType: 'EDIT' });
  };

  const addNewRcaCode = () => {
    selectRcaCode(null);
    displayRcaCodeForm({ show: true, formType: 'ADD' });
  };


  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >RCA CODES</Typography>
        <Typography margin={1} >{rcaCodes.length} Codes</Typography>
        <div style={{ margin: '10px' }} >
          <IconButton onClick={addNewRcaCode} style={{ height: '16px', width: '16px', color:'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof RcaCode)}
          />
          <TableBody>
            { sortedRcaCodes.map((rcaCode) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={rcaCode.id} >
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {rcaCode.rcaCode}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {rcaCode.rcaDesc}
                  </TableCell>
                  <TableCell align='center' >
                    <Box justifyContent={'space-between'} >
                      <Checkbox checked={rcaCode.active} style={{ height: '16px', width: '16px' }}/>
                      <IconButton onClick={() => showEditRcaCode(rcaCode.id)}
                        title='Edit'
                        style={{ height: '12px', width: '12px', marginLeft: 25 , color:'#1976d2d9' }}>
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

export default RcaCodeList;