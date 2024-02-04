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
  IconButton,
  Typography,
  Grid,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

//import { useNotificationSet } from '../../../contexts/NotificationContext';

type ProductGrListProps = {
  productGrps: ProductGrp[];
  allProductGrs: number;
  displayProductGrForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectProductGr: (userData: ProductGrp | null) => void;
}

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

const ProductGrList = ({ productGrs, allProductGrs, displayProductGrForm, selectProductGr } : ProductGrListProps) => {

  //const setNotification = useNotificationSet();

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof ProductGr; sortOrder: number }>({ sortItem: 'productGrName' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof ProductGr = sort.sortItem;

  const sortedProductGrs: ProductGr[]  = productGrs.sort((a, b) => {
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

  const showEditProductGr = (id : number | string) => {
    const productGrData = productGrs.filter((r) => r.id === id )[0];
    selectProductGr(productGrData);
    displayProductGrForm({ show: true, formType: 'EDIT' });
  };

  const addNewProductGr = () => {
    selectProductGr(null);
    displayProductGrForm({ show: true, formType: 'ADD' });
  };

  const columnHeader = [
    { id: 'productGrName', lable: 'ProductGr Name', minWidth: 30 },
    { id: 'active', lable: 'Active', minWidth: 5 },
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

  const handleRequestSort = (_event : undefined, property : keyof ProductGr) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  return(
    <div>
      <Paper>
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
          <Typography margin={1} >ROLE LIST</Typography>
          <Typography margin={1} >{productGrs.length} of {allProductGrs} productGrs</Typography>
          <div style={{ margin: '10px' }} >
            <IconButton onClick={addNewProductGr} style={{ height: '16px', width: '16px', color:'white' }}>
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
              { sortedProductGrs.map((productGr) => {
                return(
                  <TableRow hover productGr='checkbox' tabIndex={-1} key={productGr.id}>
                    <TableCell align='left'>
                      {productGr.productGrName}
                    </TableCell>
                    <TableCell align='center'>
                      <Box justifyContent={'space-between'} >
                        <Checkbox checked={productGr.active} style={{ height: '16px', width: '16px' }} />
                        <IconButton onClick={() => showEditProductGr(productGr.id)} style={{ height: '12px', width: '12px', marginLeft: 25 , color:'#1976d2d9' }}>
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
    </div>
  );
};

export default ProductGrList;