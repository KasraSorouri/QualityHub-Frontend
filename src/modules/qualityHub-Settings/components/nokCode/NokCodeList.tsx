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

import { NokCode } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof NokCode;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type NokCodeListProps = {
  nokCodes: NokCode[];
  displayNokCodeForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectNokCode: (NokCodeData: NokCode | null) => void;
}


const NokCodeList = ({ nokCodes, displayNokCodeForm, selectNokCode } : NokCodeListProps) => {

  console.log(' Nok code list * nok codes ->', nokCodes);

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof NokCode; sortOrder: number }>({ sortItem: 'nokCode' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof NokCode = sort.sortItem;

  const sortedNokCodes: NokCode[]  = nokCodes.sort((a, b) => {
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
    { id: 'nokCode', lable: 'NOK Code', minWidth: 10, borderRight: true },
    { id: 'nokDesc', lable: 'NOK Description', minWidth: 10, borderRight: true },
    { id: 'nokGrp', lable: 'NOK Group', minWidth: 10, borderRight: true },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof NokCode) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const showEditNokCode = (id : number | string) => {
    const nokCodeGrpData: NokCode = nokCodes.filter((u) => u.id === id )[0];
    selectNokCode(nokCodeGrpData);
    displayNokCodeForm({ show: true, formType: 'EDIT' });
  };

  const addNewNokCode = () => {
    selectNokCode(null);
    displayNokCodeForm({ show: true, formType: 'ADD' });
  };


  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} > NOK CODE LIST</Typography>
        <Typography margin={1} >{nokCodes.length} codes</Typography>
        <div style={{ margin: '10px' }} >
          <IconButton onClick={addNewNokCode} style={{ height: '16px', width: '16px', color:'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof NokCode)}
          />
          <TableBody>
            { sortedNokCodes.map((nokCode) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={nokCode.id} >
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {nokCode.nokCode}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {nokCode.nokDesc}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {nokCode.nokGrp.nokGrpCode}, {nokCode.nokGrp.nokGrpName}
                  </TableCell>
                  <TableCell align='center' >
                    <Box justifyContent={'space-between'} >
                      <Checkbox checked={nokCode.active} style={{ height: '16px', width: '16px' }}/>
                      <IconButton onClick={() => showEditNokCode(nokCode.id)}
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

export default NokCodeList;