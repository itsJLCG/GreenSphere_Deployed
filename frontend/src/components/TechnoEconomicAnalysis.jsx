import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from "recharts"; // For bar chart
import { PieChart, Pie, Cell } from "recharts"; // For pie chart
import exportToPDF from "./ExportToPDF";

const PRICES = {
  solarPanels: {
    type: 'Solar Energy',
    productCost: 500,
    installation: 200,
    maintenance: 50,
    carbonEmissions: 35,
    energyProduction: 500, // kWh per year per unit
    electricityCost: 0.15 // Cost per kWh in your region
  },
  solarWaterHeating: {
    type: 'Solar Energy',
    productCost: 1000,
    installation: 300,
    maintenance: 100,
    carbonEmissions: 25,
    energyProduction: 400,
    electricityCost: 0.15
  },
  smallWindTurbines: {
    type: 'Wind Energy',
    productCost: 1500,
    installation: 500,
    maintenance: 200,
    carbonEmissions: 20,
    energyProduction: 600,
    electricityCost: 0.12
  },
  verticalAxisWindTurbines: {
    type: 'Wind Energy',
    productCost: 2000,
    installation: 800,
    maintenance: 300,
    carbonEmissions: 10,
    energyProduction: 700,
    electricityCost: 0.12
  },
  microHydroPowerSystem: {
    type: 'HydroPower Energy',
    productCost: 5000,
    installation: 2000,
    maintenance: 500,
    carbonEmissions: 20,
    energyProduction: 3000,
    electricityCost: 0.10
  },
  picoHydroPower: {
    type: 'HydroPower Energy',
    productCost: 3000,
    installation: 1000,
    maintenance: 300,
    carbonEmissions: 12.5,
    energyProduction: 1500,
    electricityCost: 0.10
  },
  solarRoofTiles: {
    type: 'Solar Energy',
    productCost: 2000,
    installation: 800,
    maintenance: 300,
    carbonEmissions: 35,
    energyProduction: 550,
    electricityCost: 0.15
  },
  heatPump: {
    type: 'Geothermal Energy',
    productCost: 5000,
    installation: 2000,
    maintenance: 500,
    carbonEmissions: 25,
    energyProduction: 2500,
    electricityCost: 0.13
  },
  verticalFarming: {
    type: 'Urban Farming',
    productCost: 3000,
    installation: 1000,
    maintenance: 300,
    carbonEmissions: 50,
    energyProduction: 0,  // Not applicable
    electricityCost: 0 // Not applicable
  }
};
const calculateTotalCost = (source, count) => {
  const { productCost, installation, maintenance, carbonEmissions, energyProduction, electricityCost } = PRICES[source];
  const annualSavings = energyProduction * electricityCost * count;
  return {
    totalProductCost: productCost * count,
    totalInstallationCost: installation * count,
    totalMaintenanceCost: maintenance * count,
    totalCarbonEmissions: carbonEmissions * count,
    totalCost: productCost * count + installation * count + maintenance * count,
    annualSavings: annualSavings,
    paybackPeriod: (productCost * count + installation * count + maintenance * count) / annualSavings
  };
};

const TechnoEconomicAnalysis = ({
  solarPanels = [],
  solarRoofTiles = [],
  heatPump = [],
  solarWaterHeating = [],
  smallWindTurbines = [],
  verticalAxisWindTurbines = [],
  microHydroPowerSystem = [],
  picoHydroPower = [],
  verticalFarming = [],
}) => {
  console.log("Received solarPanels:", solarPanels);
  console.log("Solar Panels Length:", solarPanels.length);
  console.log("Calculated Solar Panels Data:", calculateTotalCost("solarPanels", solarPanels.length));
  const [open, setOpen] = useState(false);
  const pdfRef = useRef();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const data = {
    "Solar Panels": calculateTotalCost("solarPanels", solarPanels.length),
    "Solar Water Heating": calculateTotalCost("solarWaterHeating", solarWaterHeating.length),
    "Solar Roof Tiles": calculateTotalCost("solarRoofTiles", solarRoofTiles.length),
    "Heat Pump": calculateTotalCost("heatPump", heatPump.length),
    "Small Wind Turbines": calculateTotalCost("smallWindTurbines", smallWindTurbines.length),
    "Vertical Axis Wind Turbines": calculateTotalCost("verticalAxisWindTurbines", verticalAxisWindTurbines.length),
    "Micro Hydro Power System": calculateTotalCost("microHydroPowerSystem", microHydroPowerSystem.length),
    "Pico Hydro Power": calculateTotalCost("picoHydroPower", picoHydroPower.length),
    "Vertical Farming": calculateTotalCost("verticalFarming", verticalFarming.length),
  };

  const totalProductCost = Object.values(data).reduce((sum, item) => sum + item.totalProductCost, 0);
  const totalInstallationCost = Object.values(data).reduce((sum, item) => sum + item.totalInstallationCost, 0);
  const totalMaintenanceCost = Object.values(data).reduce((sum, item) => sum + item.totalMaintenanceCost, 0);
  const totalCarbonEmissions = Object.values(data).reduce((sum, item) => sum + item.totalCarbonEmissions, 0);
  const totalCost = totalProductCost + totalInstallationCost + totalMaintenanceCost;

  // Carbon Payback Period Calculation (in years)
  const carbonPaybackPeriod = (totalCarbonEmissions / 1000).toFixed(2); // Example calculation

  // Dynamic Percentage Calculation for Energy Usage
  const totalEnergyUsage = Object.values(data).reduce((sum, item) => sum + item.totalCarbonEmissions, 0);

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase() // Lowercase the first word
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize following words
      )
      .join("");
  };

  const energyUsageByType = Object.entries(data).reduce((acc, [key, value]) => {
    const formattedKey = toCamelCase(key); // Convert to camelCase
    const priceData = PRICES[formattedKey]; // Find matching entry in PRICES

    if (!priceData) {
      console.warn(`Warning: Key "${formattedKey}" not found in PRICES.`);
      return acc; // Skip if key doesn't exist
    }

    const type = priceData.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += value.totalCarbonEmissions;
    return acc;
  }, {});


  // Convert the grouped data into an array for the line chart
  const lineChartData = Object.entries(energyUsageByType).map(([type, emissions]) => ({
    type,
    emissions,
  }));


  // Data for charts
  const barChartData = Object.entries(data).map(([key, cost]) => ({
    name: key,
    totalCost: cost.totalCost,
    savings: cost.totalCost * 0.2,
  }));

  const pieChartData = [
    { name: "Product Cost", value: totalProductCost },
    { name: "Installation Cost", value: totalInstallationCost },
    { name: "Maintenance Cost", value: totalMaintenanceCost },
  ];

  const carbonPaybackData = [
    { name: "Carbon Payback Period", value: carbonPaybackPeriod },
  ];

  const totalCarbonData = [
    { name: "Total Carbon Emissions", value: totalCarbonEmissions },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]; // Colors for charts

  const costBenefitRef = useRef();
  const savingsRef = useRef();
  const carbonRef = useRef();
  const costBreakdownRef = useRef();
  const energyUsageRef = useRef();
  const totalCostRef = useRef();

  const saveData = async () => {
    try {
      // Fetch logged-in user ID from the backend
      const userResponse = await fetch("http://localhost:3001/user", {
        method: "GET",
        credentials: "include", // Required to send cookies/session data
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch logged-in user.");
      }

      const userData = await userResponse.json();
      const user_id = userData.id; // Extract user ID

      console.log("✅ Logged-in User ID:", user_id);

      console.log("🛠 Debug: Total Product Cost:", totalProductCost);
      console.log("🛠 Debug: Total Installation Cost:", totalInstallationCost);
      console.log("🛠 Debug: Total Maintenance Cost:", totalMaintenanceCost);
      console.log("🛠 Debug: Carbon Payback Period:", carbonPaybackPeriod);
      console.log("🛠 Debug: Total Carbon Emissions:", totalCarbonEmissions);
      console.log("🛠 Debug: Energy Usage Data:", energyUsageByType);

      // Prepare data
      const costAnalysisData = {
        user_id,
        TotalProductCost: parseFloat(totalProductCost),
        TotalInstallationCost: parseFloat(totalInstallationCost),
        TotalMaintenanceCost: parseFloat(totalMaintenanceCost),
      };

      const carbonAnalysisData = {
        user_id,
        CarbonPaybackPeriod: parseFloat(carbonPaybackPeriod),
        TotalCarbonEmission: parseFloat(totalCarbonEmissions),
      };

      // Filter out zero-emission energy sources
      const energyUsageData = Object.entries(energyUsageByType)
        .filter(([type, emissions]) => emissions > 0)
        .map(([type, emissions]) => ({
          user_id,
          Type: type,
          Emissions: parseFloat(emissions),
        }));

      console.log("📩 Sending Cost Analysis:", costAnalysisData);
      console.log("📩 Sending Carbon Analysis:", carbonAnalysisData);
      console.log("📩 Sending Filtered Energy Usage:", energyUsageData);

      // Send requests
      const costResponse = await fetch("http://localhost:3001/api/cost-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costAnalysisData),
      });

      const carbonResponse = await fetch("http://localhost:3001/api/carbon-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carbonAnalysisData),
      });

      const costData = await costResponse.json();  // ✅ Read once
      const carbonData = await carbonResponse.json();  // ✅ Read once

      console.log("✅ Cost Analysis Response:", costData);
      console.log("✅ Carbon Analysis Response:", carbonData);

      // Send energy usage requests in parallel
      const energyUsageResponses = await Promise.all(
        energyUsageData.map((entry) =>
          fetch("http://localhost:3001/api/energy-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          }).then((res) => res.json()) // Read response once
        )
      );

      console.log("✅ Energy Usage Responses:", energyUsageResponses);

      alert("✅ Data saved successfully!");

    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert("Failed to save data.");
    }
  };


  return (
    <>
      {!open && (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#213547",
            color: "white",
            width: "300px",
            "&:hover": { backgroundColor: "#1a2d40" },
            top: -320,
            right: -450,
          }}
          onClick={handleOpen}
        >
          Open Techno-Economic Analysis
        </Button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          invisible: true,
        }}
        disableEscapeKeyDown
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <Fade in={open}>
          <Container
            maxWidth="lg"
            sx={{
              outline: "none",
              backgroundColor: "#1e293b",
              color: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              maxHeight: "90vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#64748b",
                borderRadius: "4px",
              },
            }}
          >


            <Box>
              <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                Techno-Economic Analysis
              </Typography>

              {/* Cost vs. Benefit Analysis */}
              <Box sx={{ mt: 3, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}
                >
                  Cost vs. Benefit Analysis
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  This section compares the total cost of each renewable energy source with the estimated annual savings. The payback period is calculated based on the annual savings.
                </Typography>
                <Box ref={costBenefitRef} sx={{ mt: 2, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "10px", borderBottom: "2px solid #64748b" }}>Source</th>
                        <th style={{ padding: "10px", borderBottom: "2px solid #64748b" }}>Total Cost</th>
                        <th style={{ padding: "10px", borderBottom: "2px solid #64748b" }}>Annual Savings</th>
                        <th style={{ padding: "10px", borderBottom: "2px solid #64748b" }}>Payback Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data).map(([key, cost]) => (
                        <tr key={key}>
                          <td style={{ padding: "10px", borderBottom: "1px solid #64748b" }}>{key}</td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #64748b" }}>₱{cost.totalCost}</td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #64748b" }}>₱{cost.annualSavings.toFixed(2)}</td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #64748b" }}>
                            {isNaN(cost.paybackPeriod) || cost.paybackPeriod === null
                              ? "0 year"
                              : `${cost.paybackPeriod.toFixed(2)} years`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>


              {/* Bar Chart for Cost vs. Savings */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Cost vs. Savings Comparison
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  The bar chart below shows the total cost and estimated annual savings for each renewable energy source.
                </Typography>
                <Box ref={savingsRef} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <BarChart width={800} height={300} data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="name" fill="#82ca9d" name="Renewable Source" />
                    <Bar dataKey="totalCost" fill="#8884d8" name="Total Cost" />
                    <Bar dataKey="savings" fill="#82ca9d" name="Estimated Annual Savings" />
                  </BarChart>
                </Box>
              </Box>

              {/* Carbon Payback Period Analysis */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Carbon Payback Period Analysis
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  The carbon payback period is the time it takes to offset the carbon emissions produced during the manufacturing, installation, and maintenance of the renewable energy systems.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Total Carbon Emissions: {totalCarbonEmissions} kg CO₂</Typography>
                  <Typography variant="h6">Carbon Payback Period: {carbonPaybackPeriod} years</Typography>
                </Box>
                <Box ref={carbonRef} sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 4 }}>
                  <BarChart width={300} height={300} data={carbonPaybackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#FF8042" name="Carbon Payback Period (years)" />
                  </BarChart>
                  <BarChart width={300} height={300} data={totalCarbonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#0088FE" name="Total Carbon Emissions (kg CO₂)" />
                  </BarChart>
                </Box>
              </Box>

              {/* Pie Chart for Cost Breakdown */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Cost Breakdown
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  The pie chart below shows the breakdown of total costs into product, installation, and maintenance costs.
                </Typography>
                <Box ref={costBreakdownRef} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <PieChart width={700} height={300}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Box>
              </Box>

              {/* Energy Usage Section */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Energy Usage by Source
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  This section shows the percentage of energy used by each renewable energy source based on the carbon emissions.
                </Typography>
                <Box ref={energyUsageRef} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <LineChart width={800} height={300} data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emissions" stroke="#8884d8" name="Carbon Emissions (kg CO₂)" />
                  </LineChart>
                </Box>
              </Box>

              {/* Total Costs Section */}
              <Box sx={{ mt: 5, p: 3, backgroundColor: "#334155", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", borderBottom: "2px solid #64748b", pb: 1 }}>
                  Total Costs
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  This section summarizes the total costs associated with the renewable energy systems.
                </Typography>
                <Box ref={totalCostRef} sx={{ mt: 2 }}>
                  <Typography variant="h6">Total Product Cost: ₱{totalProductCost}</Typography>
                  <Typography variant="h6">Total Installation Cost: ₱{totalInstallationCost}</Typography>
                  <Typography variant="h6">Total Maintenance Cost: ₱{totalMaintenanceCost}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#facc15", mt: 2 }}>
                    Grand Total: ₱{totalCost}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Export Button */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!data || Object.keys(data).length === 0) {
                    console.error("No data available for PDF export!");
                  } else {
                    exportToPDF(costBenefitRef, savingsRef, carbonRef, energyUsageRef, totalCostRef, costBreakdownRef, data);
                  }
                }}
                sx={{ mr: 2 }} // Adds right margin
              >
                Export to PDF
              </Button>


              <Button variant="contained" color="primary" onClick={saveData}>
                Save Data
              </Button>
            </Box>

          </Container>
        </Fade>
      </Modal>
    </>
  );
};

export default TechnoEconomicAnalysis;