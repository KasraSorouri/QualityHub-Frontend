import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

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
  Autocomplete,
  TextField,
  TextFieldVariants,
  OutlinedTextFieldProps,
  FilledTextFieldProps,
  StandardTextFieldProps,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  //Button
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { useNotificationSet } from '../../../contexts/NotificationContext';
import materialServices from '../services/materialServices';

import { ConsumingMaterial, ConsumingMaterialData, Material, Reusable } from '../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof BomData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RecipeBomProps = {
  bom: ConsumingMaterial[];
  updateBOM: (bom: ConsumingMaterial[]) => void;
}

interface BomData extends Omit<ConsumingMaterialData, 'materialId'> {
  material?: Material;
  itemEditable?: boolean;
  bomIndex: number;
}

const RecipeBOM = ({ bom, updateBOM } : RecipeBomProps) => {

  const setNotification = useNotificationSet();

  const blankItem : BomData = {
    bomIndex: bom.length,
    qty: 0,
    reusable: Reusable.No,
    material: undefined,
    itemEditable: true,
  };

  const [ bomData, setBomData ] = useState<BomData[]>([blankItem]);

  useEffect(() => {
    setBomData(bom.map((item, index) => ({
      bomIndex: index,
      material: item.material,
      qty: item.qty,
      reusable: item.reusable
    })));
  }, [bom]);

  console.log('BOM Form * BomData ->', bomData);

  // Get Material List
  const materialResults = useQuery('materials',materialServices.getMaterial, { refetchOnWindowFocus: false });
  const materials: Material[] = materialResults.data || [];

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof BomData; sortOrder: number }>({ sortItem: 'material' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof BomData = sort.sortItem;

  const sortedBom: BomData[]  = bomData.sort((a, b) => {
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
    { id: 'material', lable: 'Material', minWidth: 300, borderRight: true },
    { id: 'qty', lable: 'Qty', width: 'auto', borderRight: true },
    { id: 'reuseable', lable: 'Reusable', width: 'auto', borderRight: true },
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
          <TableCell
            key='edit'
            align= 'justify'
            style={{ width: '60px' }}
            sx={{ backgroundColor: '#1976d2', color: 'white' }}
          >
            <div style={{ margin: '10px' }} >
              <IconButton onClick={addNewItem} style={{ height: '16px', width: '16px', color:'white' }}>
                <AddIcon />
              </IconButton>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof BomData) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const addNewItem = () => {
    const newBom = bomData.concat(blankItem);
    setBomData(newBom);
  };

  const editBomItem = (index: number) => {
    const newBom = bomData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          itemEditable: true,
        };
      }
      return item;
    });
    setBomData(newBom);
  };

  const removeBomItem = (index: number) => {
    const newBom = bomData.filter(bomData => bomData.bomIndex !== index);
    const updatedBom = newBom.map((item) => {
      if (!item.material) {
        return undefined;
      } else {
        const bomItem: ConsumingMaterial = {
          material: item.material,
          qty: item.qty,
          reusable: item.reusable,
        };
        return bomItem;
      }
    }).filter((item) => item !== undefined) as ConsumingMaterial[];
    updateBOM(updatedBom);
  };

  const handleMaterialChange = (newvalue: Material, index: number) => {
    console.log('Material Changed !', newvalue, ' index : ', index);
    const updatedBom = bomData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          material: newvalue,
        };
      }
      return item;
    });
    setBomData(updatedBom);
  };

  const handleChange = (newValue: number, index: number ) => {
    console.log('Change Event !', newValue, index);
    const newBom : BomData[] = bomData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          qty: newValue,
        };
      }
      return item;
    });
    setBomData(newBom);
  };

  const handleReusableChange = (newValue: Reusable, index: number) => {
    console.log('Reusable Change Event !', newValue, index);
    const newBom : BomData[] = bomData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          reusable: newValue,
        };
      }
      return item;
    });
    setBomData(newBom);
  };

  const handleUpdateBOM = () => {
    const updatedBom = bomData.map((item) => {
      if (!item.material) {
        setNotification({ message: 'Please choose a Material !', type: 'error', time: 8 });
        return undefined;
      } else {
        const bomItem: ConsumingMaterial = {
          material: item.material,
          qty: item.qty,
          reusable: item.reusable,
        };
        return bomItem;
      }
    }).filter((item) => item !== undefined) as ConsumingMaterial[];
    console.log('Updated BOM !', updatedBom);
    updateBOM(updatedBom);
  };

  return(
    <Paper>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof BomData)}
          />
          <TableBody>
            { sortedBom.map((bom, index) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                    {bom.itemEditable ?
                      <Autocomplete
                        id='materilas'
                        sx={{ margin: 1, width: '100%' }}
                        size='small'
                        aria-required
                        options={materials}
                        isOptionEqualToValue={(option: Material, value: Material) => option.id === value.id}
                        value={bom.material ? bom.material : null}
                        onChange={(_event, newValue) => newValue && handleMaterialChange(newValue, index)}
                        getOptionLabel={(option: { itemShortName: string; }) => option.itemShortName}
                        renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                          <TextField
                            {...params}
                            placeholder='Add Material'
                            size='small'
                            sx={{ width: '98%', margin: '2' }}
                            required />
                        )} /> :
                      bom.material?.itemShortName}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {bom.itemEditable ?
                      <TextField
                        name='qty'
                        sx={{ width: '98%' }}
                        value={bom.qty}
                        onChange={(event) => handleChange(parseInt(event.target.value), index)}
                        margin='dense'
                        variant='outlined'
                        size='small'
                        required /> :
                      bom.qty}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {bom.itemEditable ?
                      <ToggleButtonGroup
                        color="primary"
                        value={bom.reusable}
                        exclusive
                        onChange={(_event, target) => handleReusableChange(target, index)}
                        aria-label="Platform"
                      >
                        <ToggleButton value='NO'>No</ToggleButton>
                        <ToggleButton value='YES'>Yes</ToggleButton>
                        <ToggleButton value='IQC'>IQC</ToggleButton>
                      </ToggleButtonGroup>
                      :
                      bom.reusable}
                  </TableCell>
                  <TableCell align='justify'>
                    <Stack direction={'row'} alignContent={'space-between'}>
                      <IconButton onClick={() => editBomItem(bom.bomIndex)}
                        title='Edit'
                        style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => removeBomItem(bom.bomIndex)}
                        title='Delete'
                        style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <IconButton onClick={handleUpdateBOM}
                        title='Save'
                        style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}>
                        <CheckCircleOutlineIcon />
                      </IconButton>
                    </Stack>
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

export default RecipeBOM;