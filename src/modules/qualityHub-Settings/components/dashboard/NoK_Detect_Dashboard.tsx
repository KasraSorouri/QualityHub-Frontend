import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { useQuery } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';
import { DetectedNokData, DetectedNokResponse } from './DashBoardDataType';


type InputItem = {
  product: string;
  nokStatus: string;
  count: number;
};

const   NokDetectDashboard = () => {

  const queryResult = useQuery('nokDashboard', dashboardServices.getNokDashboardData,
    { refetchOnWindowFocus: false, retry: 1 });

  const data = queryResult.data || [];

  const nokDashboardData: DetectedNokData[] = Object.values(
    (data as DetectedNokResponse[]).reduce((acc, { product, nokStatus, count }) => {
      if (!acc[product]) {
        acc[product] = { product };
      }
      acc[product][nokStatus] = Number(count) || 0;
      return acc;
    }, {} as Record<string, DetectedNokData>)
  );

  console.log('** NOK Detect Dashboard Data:', nokDashboardData);
  

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
                    <TableCell align='left'>{row.product}</TableCell>
                    <TableCell align='center'>{row.PENDING ?? 0}</TableCell>
                    <TableCell align='center'>{row.ANALYSED ?? 0}</TableCell>
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