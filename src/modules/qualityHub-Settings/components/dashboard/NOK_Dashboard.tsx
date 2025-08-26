
import { Grid } from "@mui/material";
import NokDetectDashboard from './NOK_Detect_Dashboard';
import NokAnalysedDashboard from './NOK_Analysed_Dashboard';
import Top_N_NOK_Dashbord from "./Top_N_NOK_Dashbord";

const NokDashboard = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" padding={2}>
      <Grid item xs={12} sm={8} md={6} margin={"auto"}>
          <NokDetectDashboard />
      </Grid>
      <Grid item xs={12} sm={8} md={6} margin={"auto"}>
          <NokAnalysedDashboard />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
          <Top_N_NOK_Dashbord />
      </Grid>
    </Grid>
  );
}

export default NokDashboard;