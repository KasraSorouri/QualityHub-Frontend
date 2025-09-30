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
  Grid,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { ClassCode } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof ClassCode;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type ClassCodeListProps = {
  classCodes: ClassCode[];
  displayClassCodeForm: ({ show, formType }: { show: boolean; formType: 'ADD' | 'EDIT' }) => void;
  selectClassCode: (ClassCodeData: ClassCode | null) => void;
};

const ClassCodeList = ({ classCodes, displayClassCodeForm, selectClassCode }: ClassCodeListProps) => {
  // Sort Items
  const [sort, setSort] = useState<{ sortItem: keyof ClassCode; sortOrder: number }>({
    sortItem: 'className',
    sortOrder: 1,
  });
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof ClassCode = sort.sortItem;

  const sortedClassCodes: ClassCode[] = classCodes.sort((a, b) => {
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
    { id: 'className', lable: 'Class Name', width: '20%', borderRight: true },
    { id: 'classCode', lable: 'Code', width: '10%', borderRight: true },
    { id: 'classDesc', lable: 'Description', width: '60%', borderRight: true },
    { id: 'active', lable: 'Active', width: 3 },
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
              style={{ width: column.width ? column.width : undefined }}
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
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof ClassCode) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
  };

  const showEditClassCode = (id: number | string) => {
    const classCodeData: ClassCode = classCodes.filter((u) => u.id === id)[0];
    selectClassCode(classCodeData);
    displayClassCodeForm({ show: true, formType: 'EDIT' });
  };

  const addNewClassCode = () => {
    selectClassCode(null);
    displayClassCodeForm({ show: true, formType: 'ADD' });
  };

  return (
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
        <Typography margin={1}>DEFECT CLASSIFICATION CODES</Typography>
        <Typography margin={1}>{classCodes.length} Codes</Typography>
        <div style={{ margin: '10px' }}>
          <IconButton onClick={addNewClassCode} style={{ height: '16px', width: '16px', color: 'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof ClassCode)}
          />
          <TableBody>
            {sortedClassCodes.map((classCode) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={classCode.id}>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {classCode.className}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {classCode.classCode}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {classCode.classDesc}
                  </TableCell>
                  <TableCell align="center">
                    <Box justifyContent={'space-between'}>
                      <Checkbox checked={classCode.active} style={{ height: '16px', width: '16px' }} />
                      <IconButton
                        onClick={() => showEditClassCode(classCode.id)}
                        title="Edit"
                        style={{ height: '12px', width: '12px', marginLeft: 25, color: '#1976d2d9' }}
                      >
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

export default ClassCodeList;
