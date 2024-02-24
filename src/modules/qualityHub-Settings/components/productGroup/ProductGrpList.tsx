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

import { ProductGroup } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof ProductGroup;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type ProductGrpListProps = {
  productGrps: ProductGroup[];
  displayProductGrpForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectProductGrp: (ProductGrpData: ProductGroup | null) => void;
}


const ProductGrpList = ({ productGrps, displayProductGrpForm, selectProductGrp } : ProductGrpListProps) => {


  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof ProductGroup; sortOrder: number }>({ sortItem: 'groupName' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof ProductGroup = sort.sortItem;

  const sortedProductGrps: ProductGroup[]  = productGrps.sort((a, b) => {
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
    { id: 'groupName', lable: 'Group Name', minWidth: 10, borderRight: true },
    { id: 'groupCode', lable: 'Group Code', minWidth: 10, borderRight: true },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof ProductGroup) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const showEditProductGrp = (id : number | string) => {
    const productGrpGrpData: ProductGroup = productGrps.filter((u) => u.id === id )[0];
    selectProductGrp(productGrpGrpData);
    displayProductGrpForm({ show: true, formType: 'EDIT' });
  };

  const addNewProductGrp = () => {
    selectProductGrp(null);
    displayProductGrpForm({ show: true, formType: 'ADD' });
  };


  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >GROUP LIST</Typography>
        <Typography margin={1} >{productGrps.length} groups</Typography>
        <div style={{ margin: '10px' }} >
          <IconButton onClick={addNewProductGrp} style={{ height: '16px', width: '16px', color:'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof ProductGroup)}
          />
          <TableBody>
            { sortedProductGrps.map((productGrp) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={productGrp.id} >
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {productGrp.groupName}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {productGrp.groupCode}
                  </TableCell>
                  <TableCell align='center' >
                    <Box justifyContent={'space-between'} >
                      <Checkbox checked={productGrp.active} style={{ height: '16px', width: '16px' }}/>
                      <IconButton onClick={() => showEditProductGrp(productGrp.id)}
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

export default ProductGrpList;