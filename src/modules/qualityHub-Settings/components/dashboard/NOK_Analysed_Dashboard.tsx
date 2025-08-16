import { useQuery } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';

const NokAnalysedDashboard = () => {

  const queryResult = useQuery('nokAnalysedDashboard', dashboardServices.getNokAnanysedData,
    { refetchOnWindowFocus: true, retry: 1 });
 
  const dashboardData = queryResult.data;
  if (queryResult.isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
          <TableContainer component={Paper}>
            <h1>Anaysed NOK</h1>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  {
                    dashboardData && dashboardData.shifts.map((shift, index) => (
                      <TableCell key={index} align='center'>{shift}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData?.productsNok.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align='left'>{row.productName}</TableCell>
                    {
                      dashboardData.shifts.map((shift, shiftIndex) => (
                        <TableCell key={shiftIndex} align='center'>
                          {row.shifts[shift] || 0}
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

export default NokAnalysedDashboard;