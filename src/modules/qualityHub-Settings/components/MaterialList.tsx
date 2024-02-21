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

import { Material } from '../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Material;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type MaterialListProps = {
  materials: Material[];
  displayMaterialForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectMaterial: (MaterialData: Material | null) => void;
}


const MaterialList = ({ materials, displayMaterialForm, selectMaterial } : MaterialListProps) => {


  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof Material; sortOrder: number }>({ sortItem: 'itemShortName' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof Material = sort.sortItem;

  const sortedMaterials: Material[]  = materials.sort((a, b) => {
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
    { id: 'itemShortName', lable: 'Short Name', minWidth: 10, borderRight: true },
    { id: 'itemLongName', lable: 'Long Name', minWidth: 10, borderRight: true },
    { id: 'itemCode', lable: 'Item Code', minWidth: 10, borderRight: true },
    { id: 'traceable', lable: 'Traceable', minWidth: 10,  width: '5%',borderRight: true },
    { id: 'price', lable: 'Price', minWidth: 10, width: '10%', borderRight: true },
    { id: 'unit', lable: 'Unit', minWidth: 10, width: '5%', borderRight: true },
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Material) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const showEditMaterial = (id : number | string) => {
    const materialData: Material = materials.filter((u) => u.id === id )[0];
    selectMaterial(materialData);
    displayMaterialForm({ show: true, formType: 'EDIT' });
  };

  const addNewMaterial = () => {
    selectMaterial(null);
    displayMaterialForm({ show: true, formType: 'ADD' });
  };


  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >MATERIAL LIST</Typography>
        <Typography margin={1} >{materials.length} Materials</Typography>
        <div style={{ margin: '10px' }} >
          <IconButton onClick={addNewMaterial} style={{ height: '16px', width: '16px', color:'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Material)}
          />
          <TableBody>
            { sortedMaterials.map((material) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={material.id} >
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {material.itemShortName}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {material.itemLongName}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {material.itemCode}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {material.traceable ? 'YES' : 'NO'}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {material.price}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                    {material.unit}
                  </TableCell>
                  <TableCell align='center' >
                    <Box justifyContent={'space-between'} >
                      <Checkbox checked={material.active} style={{ height: '16px', width: '16px' }}/>
                      <IconButton onClick={() => showEditMaterial(material.id)}
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

export default MaterialList;