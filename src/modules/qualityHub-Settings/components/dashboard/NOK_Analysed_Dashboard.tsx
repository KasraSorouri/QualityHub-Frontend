import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dashboardServices from '../../services/dashboardServices';
import Filter_Analysed_NOK from './Filter_Analysed_NOK';

import WidgetsIcon from '@mui/icons-material/Widgets';


const NokAnalysedDashboard = () => {

  const queryClient = useQueryClient();

  const [showFilter, setShowFilter] = useState(false);
  

  const queryResult = useQuery('nokAnalysedDashboard', dashboardServices.getNokAnanysedData,
    { refetchOnWindowFocus: true, retry: 1 });
 
  const dashboardData = queryResult.data;
    console.log('* Analysed NOK * dashboardData', dashboardData);

  if (queryResult.isLoading) {
    return <div>Loading...</div>;
  }

  const setfilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilter = (apply:boolean) => {
    console.log('apply filter', apply);
    
    if (apply) {
      queryClient.invalidateQueries('nokAnalysedDashboard');
    }
  };
  
  return (
    <Paper elevation={0} style={{ padding: '2px', textAlign: 'center' }}>
      <TableContainer component={Paper}>            
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs >
            <h2>Anaysed NOK</h2>
            </Grid>
            <Grid item margin={1}>
            <WidgetsIcon fontSize="small" onClick={setfilter} />
            { showFilter && <Filter_Analysed_NOK applyFilter={applyFilter} closeFilter={() => setShowFilter(false)}/> }
          </Grid>
        </Grid>
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
  );
}

export default NokAnalysedDashboard;