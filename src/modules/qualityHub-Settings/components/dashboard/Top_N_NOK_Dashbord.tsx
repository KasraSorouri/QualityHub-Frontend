import { useQuery } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';

const Top_N_NOK_Dashbord = () => {
  // Define the number of top NOK products to display
  const topN = 10; 

  const queryResult = useQuery('top_N_Nok', () => dashboardServices.getTop_N_NokData(topN),
    { refetchOnWindowFocus: true, retry: 1 });
 
  const dashboardData = queryResult.data;
  console.log('* TOP NOK * dashboardData', dashboardData);
  
  if (queryResult.isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
          <TableContainer component={Paper}>
            <h1>Top {topN} NOK</h1>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align='center'>NOK Code</TableCell>
                  <TableCell align='center'>NOK Count</TableCell>
                  {
                    dashboardData && dashboardData.shifts.map((shift, index) => (
                      <TableCell key={index} align='center'>{shift}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData && dashboardData.TopNok.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell align='center'>{data.nokCode}</TableCell>
                    <TableCell align='center'>{data.count}</TableCell>
                    {
                      dashboardData.shifts.map((shift, shiftIndex) => (
                        <TableCell key={shiftIndex} align='center'>
                          {data.shifts[shift] || 0}
                        </TableCell>
                      ))
                    }

                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Top_N_NOK_Dashbord;