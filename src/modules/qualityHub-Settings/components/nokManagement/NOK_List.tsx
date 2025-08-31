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
  Typography,
  Grid
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { NokData } from '../../../../types/QualityHubTypes';
import { useQuery } from 'react-query';
import nokDetectServices from '../../services/nokDetectServices';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof NokData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type NokListProps = {
  listType: string;
  selectNok : (nok: NokData) => void;
}

const NokList = ({ listType , selectNok } : NokListProps) => {

  // Get NOKs
  const nokResults = useQuery('noks',nokDetectServices.getNokDetect, { refetchOnWindowFocus: false });
  const noks = nokResults.data? nokResults.data : [];

  console.log('** NOK List * NOKs ->', noks);



  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof NokData; sortOrder: number }>({ sortItem: 'detectTime' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof NokData = sort.sortItem;

  const sortedNoks: NokData[]  = noks.sort((a, b) => {
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
    { id: 'product', lable: 'Product', width:'10%', minWidth: '90px', borderRight: true },
    { id: 'productSN', lable: 'Serial No', width: '10%', minWidth: '90px', borderRight: true },
    { id: 'nokCode', lable: 'NOK Code', width: '5%', minWidth: '60px', borderRight: true },
    { id: 'station', lable: 'Station', width: '5%', minWidth: '60px',borderRight: true },
    { id: 'description', lable: 'Description', width: '35%',borderRight: true },
    { id: 'shift', lable: 'Shift', width: '3%', minWidth: '30px', borderRight: true },
    { id: 'time', lable: 'Time', width: '10%', minWidth: '90px', borderRight: true },
    { id: 'status', lable: 'Status', width: '10%' },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof NokData) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const showEditNok = (id : number | string) => {
    const nokData: NokData = noks.filter((u) => u.id === id )[0];
 
    selectNok(nokData);
   
    console.log('list type ->',listType);

  };

  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >NOK LIST</Typography>
        <Typography margin={1} >{noks.length} NOKs</Typography>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof NokData)}
          />
          <TableBody>
            { sortedNoks.map((nok) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={nok.id} onClick={() => showEditNok(nok.id)} >
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {nok.product.productName}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {nok.productSN}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {nok.initNokCode.nokCode}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {nok.detectedStation.stationCode}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {nok.description}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {nok.detectedShift.shiftCode}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {new Date(nok.detectTime).toLocaleString('fi-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                  </TableCell>
                  <TableCell align='center' >
                    {listType === 'REWORK' ? nok.productStatus :  nok.nokStatus}
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

export default NokList;