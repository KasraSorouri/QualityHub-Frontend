import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';
import { DetectedNokData } from './DashBoardDataType';

import WidgetsIcon from '@mui/icons-material/Widgets';
import Filter_NOK_Detect from './Filter_NOK_Detect';

const   NokDetectDashboard = () => {

  const queryClient = useQueryClient();

  const [showFilter, setShowFilter] = useState(false);

  const queryResult = useQuery('nokDashboard', () => dashboardServices.getNokDashboardData(),
    { refetchOnWindowFocus: false, retry: 1 });

  const nokDashboardData = queryResult?.data || [] as DetectedNokData[];

  const setfilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilter = (apply:boolean) => {
    if (apply) {
      queryClient.invalidateQueries('nokDashboard');
    }
  };

  return (
    <Paper elevation={0} style={{ padding: '2px', textAlign: 'center' }}>
      <TableContainer component={Paper}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs >
            <h2>Detected NOK</h2>
          </Grid>
          <Grid item margin={1}>
            <WidgetsIcon fontSize="small" onClick={setfilter} />
            { showFilter && <Filter_NOK_Detect applyFilter={applyFilter} closeFilter={() => setShowFilter(false)}/> }
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Pendding</TableCell>
              <TableCell>Analysed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nokDashboardData.map((row, index) => (
              <TableRow key={index}>
                <TableCell align='left'>{row.productName}</TableCell>
                <TableCell align='center'>{row.pending ?? 0}</TableCell>
                <TableCell align='center'>{row.analysed ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NokDetectDashboard;