import React, { useEffect, useState } from 'react';

import { visuallyHidden } from '@mui/utils';
import {
  Box,
  Button,
  Collapse,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';

import MaterialStatusUpdateForm from './IqcStatusUpdateForm';
import iqcServices from '../../services/iqcServices';

import { IQCListData, MaterialStatus, Reusable } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof IQCListData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

interface IqcStatusFormProp {
  materialId: number | undefined;
  showForm: boolean;
}

const IqcManagement = () => {
  const [listType, setListType] = useState<string>('pending');
  const [iqcList, setIqcList] = useState<IQCListData[] | never[]>([]);
  const [iqcStatusForm, setIqcStatusForm] = useState<IqcStatusFormProp>({ materialId: undefined, showForm: false });

  useEffect(() => {
    const getIqcs = async () => {
      const iqcs = listType === 'all' ? await iqcServices.getAllIqcs() : await iqcServices.getPendingIqcs();
      console.log('IqcManagement * Iqcs -> ', iqcs);
      setIqcList(iqcs);
    };
    getIqcs();
  }, [listType]);

  // Sort Items
  const [sort, setSort] = useState<{ sortItem: keyof IQCListData; sortOrder: number }>({
    sortItem: 'id',
    sortOrder: 1,
  });
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof IQCListData = sort.sortItem;

  const sortedList: IQCListData[] = iqcList.sort((a, b) => {
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

  // Table Header
  const columnHeader = [
    { id: 'product', lable: 'Product', width: '7%', minWidth: 10, borderRight: true },
    { id: 'productSN', lable: 'Serial No', width: '7%', minWidth: 10, borderRight: true },
    { id: 'material', lable: 'Material', width: '20%', minWidth: 10, borderRight: true },
    { id: 'nokDescription', lable: 'NOK Desciption', width: '20%', minWidth: 10, borderRight: true },
    { id: 'nokDate', lable: 'NOK Date', width: '10%', minWidth: 10, borderRight: true },
    { id: 'dismantledQty', lable: 'Qty', width: '5%', minWidth: 7, borderRight: true },
    { id: 'reusable', lable: 'Reusable', width: '10%', minWidth: 7, borderRight: true },
    { id: 'materialStatus', lable: 'Status', width: '10%', minWidth: 10, borderRight: true },
    { id: 'updateStatus', lable: ' Update Status', width: '8%', minWidth: 10, borderRight: false },
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
                width: column.width ? column.width : undefined,
                minWidth: column.minWidth,
                padding: '1px',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRight: column.borderRight ? '1px solid white' : undefined,
                whiteSpace: 'none',
              }}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
                sx={{ padding: 0, margin: 0, display: 'contents', alignItems: 'center' }}
              >
                {column.lable}
                {orderBy === column.id ? (
                  <Box sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof IQCListData) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
  };

  const handleChangeStatus = (materialId: number) => {
    setIqcStatusForm({ materialId, showForm: !iqcStatusForm.showForm });
  };

  return (
    <Paper sx={{ pointerEvents: 'all' }}>
      <Grid container justifyContent={'space-between'} flexDirection={'row'} marginLeft={1} width={'98%'}>
        <Typography variant="h3" margin={1}>
          IQC Management
        </Typography>
        <Grid item marginTop={2} marginRight={3}>
          <Button variant="contained" color="primary" sx={{ marginLeft: 1 }} onClick={() => setListType('all')}>
            All Material
          </Button>
          <Button variant="contained" color="primary" sx={{ marginLeft: 1 }} onClick={() => setListType('pending')}>
            Pending Iqcs
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        bgcolor={'#1976d2d9'}
        color={'white'}
        justifyContent={'space-between'}
        flexDirection={'row'}
        marginLeft={1}
        width={'99%'}
      >
        <Typography margin={1}>Iqcs Dismantle</Typography>
        <Typography margin={1}>{iqcList.length} Iqcs</Typography>
      </Grid>
      <TableContainer sx={{ maxHeight: '300px', overflow: 'auto', marginLeft: 1, width: '99%' }}>
        <Table stickyHeader aria-label="sticky table" size="small" sx={{ tableLayout: 'auto' }}>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof IQCListData)}
          />
          <TableBody>
            {sortedList.map((material) => {
              //const labelId = `enhanced-table-checkbox-${material.id}`;
              return (
                <React.Fragment key={material.id}>
                  <TableRow>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      {material.nokDetect.product.productName}
                    </TableCell>
                    <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                      {material.nokDetect.productSN}
                    </TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      {material.material.itemShortName}
                    </TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      {material.nokDetect.description}
                    </TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      {new Date(material.nokDetect.detectTime).toLocaleString('fi-FI', {
                        year: 'numeric',
                        month: '2-digit',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      {material.actualDismantledQty}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderRight: '1px solid gray',
                        backgroundColor:
                          material.reusable === Reusable.YES
                            ? '#A8F285'
                            : material.reusable === Reusable.IQC
                              ? '#FFFFAB'
                              : '#F2A8A8',
                      }}
                    >
                      {material.reusable}
                    </TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      <TextField
                        name="status"
                        sx={{
                          '& .MuiInputBase-input': {
                            maxHeight: '15px',
                            padding: '5px',
                            textAlign: 'center',
                            width: '100px',
                          },
                          backgroundColor:
                            material.materialStatus === MaterialStatus.OK
                              ? '#A8F285'
                              : material.materialStatus === MaterialStatus.IQC
                                ? '#FFFFAB'
                                : '#f93a00',
                          overflow: 'hidden',
                          marginLeft: '-10px',
                        }}
                        value={material.materialStatus}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                      <Button
                        onClick={() => handleChangeStatus(material.id)}
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        {iqcStatusForm.showForm && iqcStatusForm.materialId === material.id
                          ? 'Cancel'
                          : 'Update Status'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={material.id}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                      <Collapse
                        in={iqcStatusForm.showForm && iqcStatusForm.materialId === material.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <MaterialStatusUpdateForm
                            materialId={material.id}
                            onSubmit={() => setIqcStatusForm({ materialId: undefined, showForm: false })}
                          />
                        </Box>
                      </Collapse>
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

export default IqcManagement;
