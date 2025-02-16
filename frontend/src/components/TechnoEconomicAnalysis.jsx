import React from "react";
import { Card, CardContent, Typography, Grid, Box, Container } from "@mui/material";

const PRICES = {
  solarPanels: { productCost: 500, installation: 200, maintenance: 50 },
  solarWaterHeating: { productCost: 1000, installation: 300, maintenance: 100 },
  smallWindTurbines: { productCost: 1500, installation: 500, maintenance: 200 },
  verticalAxisWindTurbines: { productCost: 2000, installation: 800, maintenance: 300 },
  microHydroPowerSystem: { productCost: 5000, installation: 2000, maintenance: 500 },
  picoHydroPower: { productCost: 3000, installation: 1000, maintenance: 300 },
};

const TechnoEconomicAnalysis = ({
  solarPanels,
  solarWaterHeating,
  smallWindTurbines,
  verticalAxisWindTurbines,
  microHydroPowerSystem,
  picoHydroPower,
}) => {
  const calculateTotalCost = (source, count) => {
    const { productCost, installation, maintenance } = PRICES[source];
    return {
      totalProductCost: productCost * count,
      totalInstallationCost: installation * count,
      totalMaintenanceCost: maintenance * count,
      totalCost: productCost * count + installation * count + maintenance * count,
    };
  };

  const data = {
    "Solar Panels": calculateTotalCost("solarPanels", solarPanels.length),
    "Solar Water Heating": calculateTotalCost("solarWaterHeating", solarWaterHeating.length),
    "Small Wind Turbines": calculateTotalCost("smallWindTurbines", smallWindTurbines.length),
    "Vertical Axis Wind Turbines": calculateTotalCost("verticalAxisWindTurbines", verticalAxisWindTurbines.length),
    "Micro Hydro Power System": calculateTotalCost("microHydroPowerSystem", microHydroPowerSystem.length),
    "Pico Hydro Power": calculateTotalCost("picoHydroPower", picoHydroPower.length),
  };

  const totalProductCost = Object.values(data).reduce((sum, item) => sum + item.totalProductCost, 0);
  const totalInstallationCost = Object.values(data).reduce((sum, item) => sum + item.totalInstallationCost, 0);
  const totalMaintenanceCost = Object.values(data).reduce((sum, item) => sum + item.totalMaintenanceCost, 0);
  const totalCost = totalProductCost + totalInstallationCost + totalMaintenanceCost;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ backgroundColor: "#213547", color: "white", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
          Techno-Economic Analysis
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 3, borderBottom: "2px solid #64748b", pb: 1 }}>
          Cost Breakdown
        </Typography>

        <Grid 
  container 
  spacing={3} 
  sx={{ width: "100%", justifyContent: "center", flexWrap: "wrap" }}
>
  {Object.entries(data).map(([key, cost]) => (
    <Grid item xs={12} sm={6} md={4} key={key}>
      <Card 
        sx={{ 
          backgroundColor: "#334155", 
          color: "white", 
          p: 2, 
          borderRadius: 2, 
          boxShadow: 3,
          minWidth: 250,
          textAlign: "center"
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {key}
          </Typography>
          <Typography>Product Cost: ${cost.totalProductCost}</Typography>
          <Typography>Installation: ${cost.totalInstallationCost}</Typography>
          <Typography>Maintenance: ${cost.totalMaintenanceCost}</Typography>
          <Typography sx={{ fontWeight: "bold", color: "#facc15", mt: 1 }}>
            Total: ${cost.totalCost}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 5, borderTop: "2px solid #64748b", pt: 2 }}>
          Total Costs
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Total Product Cost: ${totalProductCost}</Typography>
          <Typography variant="h6">Total Installation Cost: ${totalInstallationCost}</Typography>
          <Typography variant="h6">Total Maintenance Cost: ${totalMaintenanceCost}</Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#facc15", mt: 2 }}>
            Grand Total: ${totalCost}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TechnoEconomicAnalysis;
