import React from 'react';
import { useEffect, useState } from 'react';

import { Box, Button, Collapse, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import ClaimStatusUpdateForm from './ClaimStatusUpdateForm';
import claimServices from '../../services/claimServices';

import { ClaimListData, ClaimStatus, Reusable } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof ClaimListData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

interface ClaimStatusFormProp {
  materialId : number | undefined;
  showForm: boolean;
}

const ClaimManagement = () => {
  const [ listType, setListType ] = useState<string>('pending');
  const [ claimList, setClaimList ] = useState<ClaimListData[] | never[] >([]);
  const [ claimStatusForm, setClaimStatusForm ] = useState<ClaimStatusFormProp>({ materialId: undefined, showForm: false });

  useEffect(() => {
    const getClaims = async () => {
      const claims = listType === 'all' ?
        await claimServices.getAllClaims() :
        await claimServices.getPendingClaims();
      console.log('ClaimManagement * Claims -> ', claims);
      setClaimList(claims);
    };
    getClaims();
  }, [listType]);

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof ClaimListData; sortOrder: number }>({ sortItem: 'id' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof ClaimListData = sort.sortItem;

  const sortedList: ClaimListData[]  = claimList.sort((a, b) => {
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
    { id: 'nokCost', lable: 'NOK Cost', width: '7%', minWidth: 7 , borderRight: true },
    { id: 'claimStatus', lable: 'Status', width: '10%', minWidth: 10, borderRight: true },
    { id: 'updateStatus', lable: ' Update Status', width: '8%', minWidth: 10, borderRight: false },
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
              sx={{
                width: column.width ? column.width : undefined,
                minWidth: column.minWidth,
                padding: '1px',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRight: column.borderRight ? '1px solid white' : undefined,
                whiteSpace: 'none'
              }}
              sortDirection={orderBy === column.id ? order : false }
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc' }
                onClick={createSortHandler(column.id)}
                sx={{ padding: 0, margin: 0, display: 'contents', alignItems: 'center' }}
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

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof ClaimListData) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  const handleChangeStatus = (materialId: number) => {
    setClaimStatusForm({ materialId, showForm: !(claimStatusForm.showForm) });
  };

  return (
    <Paper sx={{ pointerEvents:'all' }} >
      <Grid container justifyContent={'space-between'} flexDirection={'row'} marginLeft={1} width={'98%'}>
        <Typography variant='h3' margin={1}>Claim Management</Typography>
        <Grid item marginTop={2} marginRight={3}>
          <Button variant='contained' color='primary' sx={{ marginLeft: 1 }} onClick={() => setListType('all')}>
            All Claims
          </Button>
          <Button variant='contained' color='primary' sx={{ marginLeft: 1 }} onClick={() => setListType('pending')}>
            Pending Claims
          </Button>
        </Grid>
      </Grid>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} marginLeft={1} width={'99%'}>
        <Typography margin={1}>Claims Dismantle</Typography>
        <Typography margin={1}>{claimList.length} Claims</Typography>
      </Grid>
      <TableContainer  sx={{ maxHeight: '300px', overflow: 'auto' ,marginLeft: 1, width:'99%' }} >
        <Table stickyHeader aria-label='sticky table' size='small' sx={{ tableLayout:'auto' }} >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof ClaimListData)} />
          <TableBody>
            {sortedList.map((material) => {
              //const labelId = `enhanced-table-checkbox-${material.id}`;
              return (
                <React.Fragment key={material.id}>
                  <TableRow>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      {material.nokDetect.product.productName}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }}>
                      {material.nokDetect.productSN}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      {material.material.itemShortName}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      {material.nokDetect.description}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray', background: material.material.traceable ? '#FCFEA0' : '#A0F1FE' }}>
                      {new Date(material.nokDetect.detectTime).toLocaleString('fi-FI',{ year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      {material.actualDismantledQty}
                    </TableCell>
                    <TableCell align='center' sx={{
                      borderRight: '1px solid gray',
                      backgroundColor: material.material.reusable === Reusable.YES ? '#A8F285' : material.material.reusable === Reusable.IQC ? '#FFFFAB' : '#F2A8A8'
                    }}>
                      {material.unitPrice}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      <TextField
                        name='status'
                        sx={{
                          '& .MuiInputBase-input': { maxHeight: '15px', padding: '5px', textAlign: 'center', width: '100px' },
                          backgroundColor: material.claimStatus === ClaimStatus.ACCEPTED ? '#A8F285' :
                            material.claimStatus === ClaimStatus.DENIED ? '#f93a00' :
                              material.claimStatus === ClaimStatus.PENDING ? '#FFFFAB' : '#FFFFAB',
                          overflow: 'hidden',
                          marginLeft: '-10px'
                        }}
                        value={material.claimStatus}
                        //onChange={(event) => handleStatus(event.target.value as MaterialStatus, material.index2)}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }}>
                      <Button onClick={() => handleChangeStatus(material.id)} size='small' variant='contained' color='primary' >
                        {claimStatusForm.showForm && claimStatusForm.materialId === material.id ? 'Cancel' : 'Update Status'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={material.id}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                      <Collapse in={claimStatusForm.showForm && claimStatusForm.materialId === material.id} timeout='auto' unmountOnExit>
                        <Box margin={1}>
                          <ClaimStatusUpdateForm materialId={material.id} onSubmit={() => setClaimStatusForm({ materialId: undefined, showForm: false })} />
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

export default ClaimManagement;