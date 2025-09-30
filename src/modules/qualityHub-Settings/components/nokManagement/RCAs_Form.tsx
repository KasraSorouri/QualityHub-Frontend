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

import { NewRca, RCA, RcaCode } from '../../../../types/QualityHubTypes';
import rcaCodeServices from '../../services/rcaCodeServices';
import nokRcaServices from '../../services/nokRcaServices';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof RCA_Data;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RCAsProps = {
  nokId: number;
  formType: 'ADD' | 'EDIT' | 'VIEW';
  rcas: RCA[] | undefined;
  updateRCA: (rca: NewRca) => Promise<boolean>;
};

interface RCA_Data extends Omit<RCA, 'id' | 'nokId' | 'rcaCode'> {
  id: number | undefined;
  rcaIndex: number;
  rcaCode?: RcaCode;
  itemEditable?: boolean;
}

const RCAsForm = ({ nokId, rcas, updateRCA, formType }: RCAsProps) => {
  const setNotification = useNotificationSet();

  const blankItem: RCA_Data = {
    id: undefined,
    rcaIndex: rcas ? rcas.length : 0,

    rcaCode: undefined,
    whCauseId: '',
    whCauseName: '',
    description: '',
    improveSuggestion: '',
    itemEditable: true,
  };

  const [rcaData, setRcaData] = useState<RCA_Data[]>([blankItem]);
  const rcas_data: RCA[] = rcas ? rcas : [];

  useEffect(() => {
    setRcaData(
      rcas_data.map((item, index) => ({
        id: item.id,
        rcaIndex: index,
        rcaCode: item.rcaCode,
        whCauseId: item.whCauseId,
        whCauseName: item.whCauseName,
        description: item.description,
        improveSuggestion: item.improveSuggestion,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rcas]);

  console.log(' RCA form * RCA List -> ', rcas);

  // Get RCA Code List
  const rcaCodeResults = useQuery('rcaCode', rcaCodeServices.getRcaCode, { refetchOnWindowFocus: false });
  const rcaCodeList: RcaCode[] = rcaCodeResults.data || [];
  console.log(' RCA form * RCA Codes -> ', rcaCodeList);

  // Sort Items
  const [sort, setSort] = useState<{ sortItem: keyof RCA_Data; sortOrder: number }>({
    sortItem: 'rcaCode',
    sortOrder: 1,
  });
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof RCA_Data = sort.sortItem;

  const sortedRCAs: RCA_Data[] = rcaData.sort((a, b) => {
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
    { id: 'whCauseId', lable: 'Wh Cause ID', width: '10%', minWidth: '100px', borderRight: true },
    { id: 'whCauseName', lable: 'Wh Cause Name', width: '10%', minWidth: '100px', borderRight: true },
    { id: 'description', lable: 'Description', width: '25%', borderRight: true },
    { id: 'improvSuggestion', lable: 'Suggestion', width: '35%', borderRight: true },
  ];

  const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({ order, orderBy, onRequestSort }) => {
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align="center"
              style={{ width: column.width ? column.width : undefined, minWidth: column.minWidth }}
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                borderRight: column.borderRight ? '1px solid white' : undefined,
              }}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.lable}
                {orderBy === column.id ? (
                  <Box sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          {formType === 'ADD' ? (
            <TableCell
              key="edit"
              align="center"
              style={{ width: '60px' }}
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              <div style={{ margin: '10px' }}>
                <IconButton
                  title="Add New Material"
                  onClick={addNewItem}
                  style={{ height: '16px', width: '16px', color: 'white' }}
                >
                  {'Add'}
                  <AddIcon />
                </IconButton>
              </div>
            </TableCell>
          ) : null}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof RCA_Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
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

  const removeRcaItem = async (index: number) => {
    if (rcaData[index].id) {
      const result = await nokRcaServices.removeNokRca(rcaData[index].id);
      if (result) {
        const newRca = rcaData.filter((rcaData) => rcaData.rcaIndex !== index);
        setRcaData(newRca);
        setNotification({ message: 'RCA removed successfully!', type: 'info', time: 5 });
      } else {
        setNotification({ message: 'Error removing RCA!', type: 'error', time: 8 });
      }
    }
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

  const handleChange = (event: { target: { name: string; value: unknown } }, index: number) => {
    const { name, value } = event.target;
    const newRca: RCA_Data[] = rcaData.map((item, i) => {
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

  const handleUpdateRCA = async (index: number) => {
    if (!rcaData[index].rcaCode) {
      setNotification({ message: 'Please choose a RCA Code!', type: 'error', time: 8 });
      return undefined;
    } else {
      const newNokRca: NewRca = {
        rcaCodeId: rcaData[index].rcaCode.id,
        whCauseId: rcaData[index].whCauseId,
        whCauseName: rcaData[index].whCauseName,
        description: rcaData[index].description,
        improveSuggestion: rcaData[index].improveSuggestion,
        id: rcaData[index].id || undefined,
        nokId: nokId,
      };
      console.log('RCA form * Update RCA * index : ', index, ' -> ', newNokRca);

      const result = await updateRCA(newNokRca);
      if (result) {
        setRcaData(rcaData.map((item) => ({ ...item, itemEditable: false })));
      }
    }
  };

  return (
    <Paper sx={{ marginLeft: 2 }}>
      <TableContainer sx={{ maxHeight: '180px', overflow: 'auto' }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof RCA_Data)}
          />
          <TableBody>
            {sortedRCAs.map((rca, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ? (
                      <Autocomplete
                        id="rcaCode"
                        disableClearable
                        size="small"
                        disabled={formType === 'VIEW'}
                        aria-required
                        options={rcaCodeList}
                        isOptionEqualToValue={(option: RcaCode, value: RcaCode) => option.id === value.id}
                        value={rca.rcaCode ? rca.rcaCode : undefined}
                        onChange={(_event, newValue) =>
                          newValue && handleAutoCompeletChange('rcaCode', newValue, index)
                        }
                        getOptionLabel={(option: { rcaCode: string }) => option.rcaCode}
                        renderInput={(
                          params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                              OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                              'variant'
                            >,
                        ) => <TextField {...params} label="RCA Code" placeholder="RCA Code" size="small" required />}
                      />
                    ) : (
                      rca.rcaCode?.rcaCode
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ? (
                      <TextField
                        id="whCauseId"
                        name="whCauseId"
                        label="Wh Cause ID"
                        disabled={formType === 'VIEW'}
                        value={rca.whCauseId}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        size="small"
                        required
                      />
                    ) : (
                      rca.whCauseId
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ? (
                      <TextField
                        id="whCauseName"
                        name="whCauseName"
                        label="Wh Cause Name"
                        disabled={formType === 'VIEW'}
                        value={rca.whCauseName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        size="small"
                        required
                      />
                    ) : (
                      rca.whCauseName
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ? (
                      <TextField
                        id="description"
                        name="description"
                        label="Description"
                        disabled={formType === 'VIEW'}
                        value={rca.description}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        fullWidth
                        size="small"
                      />
                    ) : (
                      rca.description
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {rca.itemEditable ? (
                      <TextField
                        id="improveSuggestion"
                        name="improveSuggestion"
                        label="Suggestion"
                        disabled={formType === 'VIEW'}
                        value={rca.improveSuggestion}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
                        fullWidth
                        size="small"
                      />
                    ) : (
                      rca.improveSuggestion
                    )}
                  </TableCell>
                  {formType !== 'VIEW' ? (
                    <TableCell align="justify">
                      <Stack direction={'row'} alignContent={'space-between'}>
                        <IconButton
                          onClick={() => editRcaItem(rca.rcaIndex)}
                          title="Edit"
                          style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeRcaItem(rca.rcaIndex)}
                          title="Delete"
                          style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleUpdateRCA(rca.rcaIndex)}
                          title="Save"
                          style={{ height: '12px', width: '12px', margin: 5, color: '#1976d2d9' }}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  ) : null}
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
