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

import { Station } from '../../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Station;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type StationListProps = {
  stations: Station[];
  displayStationForm: ({ show, formType }: { show: boolean; formType: 'ADD' | 'EDIT' }) => void;
  selectStation: (StationData: Station | null) => void;
};

const StationList = ({ stations, displayStationForm, selectStation }: StationListProps) => {
  // Sort Items
  const [sort, setSort] = useState<{ sortItem: keyof Station; sortOrder: number }>({
    sortItem: 'stationName',
    sortOrder: 1,
  });
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof Station = sort.sortItem;

  const sortedStations: Station[] = stations.sort((a, b) => {
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
    { id: 'stationName', lable: 'Station Name', minWidth: 10, borderRight: true },
    { id: 'stationCode', lable: 'Station Code', minWidth: 10, borderRight: true },
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
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Station) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
  };

  const showEditStation = (id: number | string) => {
    const stationGrpData: Station = stations.filter((u) => u.id === id)[0];
    selectStation(stationGrpData);
    displayStationForm({ show: true, formType: 'EDIT' });
  };

  const addNewStation = () => {
    selectStation(null);
    displayStationForm({ show: true, formType: 'ADD' });
  };

  return (
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
        <Typography margin={1}>STATION LIST</Typography>
        <Typography margin={1}>{stations.length} stations</Typography>
        <div style={{ margin: '10px' }}>
          <IconButton onClick={addNewStation} style={{ height: '16px', width: '16px', color: 'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Station)}
          />
          <TableBody>
            {sortedStations.map((station) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={station.id}>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {station.stationName}
                  </TableCell>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {station.stationCode}
                  </TableCell>
                  <TableCell align="center">
                    <Box justifyContent={'space-between'}>
                      <Checkbox checked={station.active} style={{ height: '16px', width: '16px' }} />
                      <IconButton
                        onClick={() => showEditStation(station.id)}
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

export default StationList;
