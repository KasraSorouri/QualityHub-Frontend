
import { Grid } from "@mui/material";
import NokDetectDashboard from './NOK_Detect_Dashboard';
import NokAnalysedDashboard from './NOK_Analysed_Dashboard';
import Top_N_NOK_Dashbord from "./Top_N_NOK_Dashbord";

const NokDashboard = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="flex-start" padding={2} height={"30%"}>
      <Grid item xs={12} sm={8} md={6} marginTop={0} height={"100%"} >
          <NokDetectDashboard />
      </Grid>
      <Grid item xs={12} sm={8} md={6}  marginTop={0} height={"100%"} >
          <NokAnalysedDashboard />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
          <Top_N_NOK_Dashbord />
      </Grid>
    </Grid>
  );
}

export default NokDashboard;