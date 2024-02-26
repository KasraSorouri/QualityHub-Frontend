import {
  Grid,
  Paper
} from '@mui/material';

const RegNewNok = () => {
  return (
    <Paper elevation={5} sx={{ borderRadius: 1,
      backgroundColor: '#E5E7E9 ',
      width: '100%',
      height: '100%',
      minHeight: '70Vh',
      padding: 2,
      margin: 0,
      display: 'flex' }}>
      <Grid container>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <h2>New NOK</h2>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RegNewNok;