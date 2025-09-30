import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';
import Filter_Top_NOK from './Filter_Top_NOK';

import WidgetsIcon from '@mui/icons-material/Widgets';

const Top_N_NOK_Dashbord = () => {
  const queryClient = useQueryClient();

  const [showFilter, setShowFilter] = useState(false);

  const queryResult = useQuery('top_N_Nok', () => dashboardServices.getTop_N_NokData(), {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const filterData = window.sessionStorage.getItem('TopNokFilter')
    ? JSON.parse(window.sessionStorage.getItem('TopNokFilter')!)
    : null;
  const topN = filterData?.topN || 10;

  const dashboardData = queryResult.data;
  console.log('* TOP NOK * dashboardData', dashboardData);

  if (queryResult.isLoading) {
    return <div>Loading...</div>;
  }

  const setfilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilter = (apply: boolean) => {
    console.log('apply filter', apply);
    if (apply) {
      queryClient.invalidateQueries('top_N_Nok');
    }
  };

  return (
    <Paper elevation={0} style={{ padding: '2px', textAlign: 'center' }}>
      <TableContainer component={Paper}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <h2>Top {topN} NOK</h2>
          </Grid>
          <Grid item margin={1}>
            <WidgetsIcon fontSize="small" onClick={setfilter} />
            {showFilter && <Filter_Top_NOK applyFilter={applyFilter} closeFilter={() => setShowFilter(false)} />}
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">NOK Code</TableCell>
              <TableCell align="center">NOK Count</TableCell>
              {dashboardData &&
                dashboardData.shifts.map((shift, index) => (
                  <TableCell key={index} align="center">
                    {shift}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardData &&
              dashboardData.TopNok.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.productName}</TableCell>
                  <TableCell align="center">{data.nokCode}</TableCell>
                  <TableCell align="center">{data.count}</TableCell>
                  {dashboardData.shifts.map((shift, shiftIndex) => (
                    <TableCell key={shiftIndex} align="center">
                      {data.shifts[shift] || 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Top_N_NOK_Dashbord;
