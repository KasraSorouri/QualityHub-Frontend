import React from 'react';

import { Grid, Paper } from "@mui/material";
import NokDetectDashboard from './NoK_Detect_Dashboard';

const NokDashboard = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" padding={2}>
      <Grid item xs={12} sm={8} md={6} margin={"auto"}>
          <NokDetectDashboard />
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
          <h1>NOK Dashboard</h1>
          <p>Here you can manage your NOK settings and view relevant information.</p>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default NokDashboard;