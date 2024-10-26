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
  Stack,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { useNotificationSet } from '../../../../contexts/NotificationContext';

import { RCA, RcaCode } from '../../../../types/QualityHubTypes';
import rcaCodeServices from '../../services/rcaCodeServices';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof RCA_Data;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RCAsProps = {
  formType: 'ADD' | 'EDIT' | 'VIEW';
  rcas: RCA[] | undefined;
  updateRCA: (rca: RCA[]) => void;
}

interface RCA_Data extends Omit<RCA, 'id' | 'nokId' | 'rcaCode'> {
  rcaIndex: number;
  rcaCode?: RcaCode;
  itemEditable?: boolean;
}

const RCAsForm = ({ rcas, updateRCA, formType } : RCAsProps) => {

  const setNotification = useNotificationSet();

  const blankItem : RCA_Data = {
    rcaIndex: rcas ?  rcas.length : 0,
    rcaCode: undefined,
    whCauseId: '',
    whCauseName: '',
    description: '',
    improvSuggestion: '',
    itemEditable: true,
  };

  const [ rcaData, setRcaData ] = useState<RCA_Data[]>([blankItem]);
  const rcas_data :  RCA[] = rcas ? rcas : [
    { id: 1, nokId: 1, rcaCode: { id: 1, rcaCode: 'RCA1', rcaDesc: 'RCA1', active: true }, description: 'RCA1', improvSuggestion: 'RCA1' }
  ];

  
  useEffect(() => {
    setRcaData(rcas_data.map((item, index) => ({
      rcaIndex: index,
      rcaCode: item.rcaCode,
      whCauseId: item.whCauseId,
      whCauseName: item.whCauseName,
      description: item.description,
      improvSuggestion: item.improvSuggestion,
    })));
  }, [rcas]);

  // Get RCA Code List
  const rcaCodeResults = useQuery('rcaCode', rcaCodeServices.getRcaCode, { refetchOnWindowFocus: false });
  const rcaCodeList: RcaCode[] = rcaCodeResults.data || [];


  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof RCA_Data; sortOrder: number }>({ sortItem: 'rcaCode' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof RCA_Data = sort.sortItem;

  const sortedRCAs: RCA_Data[]  = rcaData.sort((a, b) => {
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
    { id: 'rcaCode', lable: 'RCA Code', width: '10%', minWidth: '125px', borderRight: true },
    { id: 'whCauseId', lable: 'Wh Cause ID', width: '10%', minWidth: '100px' , borderRight: true },
    { id: 'whCauseName', lable: 'Wh Cause Name',width: '10%', minWidth: '100px', borderRight: true },
    { id: 'description', lable: 'Description', width: '25%', borderRight: true },
    { id: 'improvSuggestion', lable: 'Suggestion', width: '35%', borderRight: true },
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
          { formType === 'ADD' ?
            <TableCell
              key='edit'
              align= 'center'
              style={{ width: '60px' }}
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              <div style={{ margin: '10px' }} >
                <IconButton title='Add New Material' onClick={addNewItem} style={{ height: '16px', width: '16px', color:'white' }}>
                  {'Add'}
                  <AddIcon />
                </IconButton>
              </div>
            </TableCell> : null}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof RCA_Data) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const addNewItem = () => {
    const newRCA = rcaData.concat(blankItem);
    setRcaData(newRCA);
  };

  const editRcaItem = (index: number) => {
    const newBom = rcaData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          itemEditable: true,
        };
      }
      return item;
    });
    setRcaData(newBom);
  };

  const removeRcaItem = (index: number) => {
    const newRca = rcaData.filter(rcaData => rcaData.rcaIndex !== index);
    setRcaData(newRca);
    /*
    const updatedRca = rcaData.map((item) => {
      if (!item.rcaIndex) {
        return undefined;
      } else {
        const rcaItem: RCA = {
          material: item.material,
          qty: item.qty,
          reusable: item.reusable,
        };
        return bomItem;
      }
    }).filter((item) => item !== undefined) as RCA[];
    updateBOM(updatedBom);
    */
  };


  const handleAutoCompeletChange = (parameter: string, newValue: RcaCode, index: number) => {
    const updatedRca = rcaData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [`${parameter}`]: newValue,
        };
      }
      return item;
    });
    setRcaData(updatedRca);
  };


  const handleChange = (event: {target: { name: string, value: unknown}}, index: number) => {
    const { name, value } = event.target;
    const newRca : RCA_Data[] = rcaData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [name]: value,
        };
      }
      return item;
    });
    setRcaData(newRca);
  };

  const handleUpdateRCA = () => {
    const updatedRca = rcaData.map((item) => {
      if (!item.rcaCode) {
        setNotification({ message: 'Please choose a RCA Code!', type: 'error', time: 8 });
        return undefined;
      } else {
        const rcaItem: RCA = {
          rcaCode: item.rcaCode,
          whCauseId: item.whCauseId,
          whCauseName: item.whCauseName,
          description: item.description,
          improvSuggestion: item.improvSuggestion,
          id: 0,
          nokId: 0
        };
        return rcaItem;
      }
    }).filter((item) => item !== undefined) as RCA[];
    updateRCA(updatedRca);
    setRcaData(rcaData.map((item) => ({ ...item, itemEditable: false })));
  };
 
  // Log RCA DATA
  console.log(' *** RCA DATA * rcaData * sortedRCAs-> ', sortedRCAs);


  return(
    <Paper sx={{ marginLeft: 2 }}>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof RCA_Data)}
          />
          <TableBody>
            { sortedRCAs.map((rca, index) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ?
                      <Autocomplete
                        id='rcaCode'
                        disableClearable
                        size='small'
                        disabled={formType === 'VIEW'}
                        aria-required
                        options={rcaCodeList}
                        isOptionEqualToValue={
                          (option: RcaCode, value: RcaCode) => option.id === value.id
                        }
                        value={rca.rcaCode ? rca.rcaCode : undefined}
                        onChange={(_event, newValue) => newValue && handleAutoCompeletChange('rcaCode',newValue, index)}
                        getOptionLabel={(option: { rcaCode: string; }) => option.rcaCode}
                        renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                          <TextField
                            {...params}
                            label='RCA Code'
                            placeholder='RCA Code'
                            size='small'
                            required
                          />
                        )}
                      /> :
                      rca.rcaCode?.rcaCode}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ?
                      <TextField
                        id="whCauseId"
                        name="whCauseId"
                        label="Wh Cause ID"
                        disabled={formType === 'VIEW'}
                        value={rca.whCauseId}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event,index)}
                        size='small'
                        required
                      /> :
                      rca.whCauseId}
                  </TableCell>
                  <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ?
                      <TextField
                        id="whCauseName"
                        name="whCauseName"
                        label="Wh Cause Name"
                        disabled={formType === 'VIEW'}
                        value={rca.whCauseName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        size='small'
                        required
                      /> :
                      rca.whCauseName}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ?
                      <TextField
                        id="description"
                        name="description"
                        label="Description"
                        disabled={formType === 'VIEW'}
                        value={rca.description}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        fullWidth
                        size='small'
                      /> :
                      rca.description}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ?
                      <TextField
                        id="improvSuggestion"
                        name="improvSuggestion"
                        label="Suggestion"
                        disabled={formType === 'VIEW'}
                        value={rca.improvSuggestion}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        fullWidth
                        size='small'
                      /> :
                      rca.improvSuggestion}
                  </TableCell>
                  { formType !== 'VIEW' ?
                    <TableCell align='justify'>
                      <Stack direction={'row'} alignContent={'space-between'}>
                        <IconButton onClick={() => editRcaItem(rca.rcaIndex)}
                          title='Edit'
                          style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => removeRcaItem(rca.rcaIndex)}
                          title='Delete'
                          style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <IconButton onClick={handleUpdateRCA}
                          title='Save'
                          style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}>
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    : null }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RCAsForm;