import { useQuery } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';
import { DetectedNokData } from './DashBoardDataType';



const   NokDetectDashboard = () => {

  const queryResult = useQuery('nokDashboard', dashboardServices.getNokDashboardData,
    { refetchOnWindowFocus: false, retry: 1 });

  const nokDashboardData = queryResult?.data || [] as DetectedNokData[];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
          <TableContainer component={Paper}>
            <h1>NOK Detect</h1>
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
      </Grid>
    </Grid>
  );
}

export default NokDetectDashboard;