import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Badge } from '@mui/material';
import axios from 'axios';
import Rating from '@mui/material/Rating'; // Import Rating from MUI
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'; // Import PieChart components
import { Menu as MenuIcon, Dashboard as DashboardIcon, Person as PersonIcon, Feedback as FeedbackIcon, EmojiEvents as RatingIcon, SolarPower as SolarPanel, AttachMoney as CostIcon, Co2 as CarbonIcon, Notifications as NotificationsIcon, Settings as SettingsIcon, ExitToApp as LogoutIcon, Warning as AlarmSmoke, MonetizationOn as HandCoins, WindPower, Water, LocalFlorist } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';
import Logout from '../Logout'; // Import the Logout component
import greensphereLogo from '../../assets/images/greenspherelogo.png'; // Import the logo

const drawerWidth = 240;

const AdminHome = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [open, setOpen] = useState(false); // Modal open state
  const [selectedUserId, setSelectedUserId] = useState(null); // Store selected user's ID
  const [selectedRole, setSelectedRole] = useState(''); // Store selected role
  const [roles] = useState(['admin', 'user']); // Example roles: ['admin', 'user']
  const [feedbackChartData, setFeedbackChartData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]); // Store sentiment analysis data for bar chart
  const [costAnalysisData, setCostAnalysisData] = useState([]);
  const [carbonPaybackData, setCarbonPaybackData] = useState([]);
  const [energyUsageData, setEnergyUsageData] = useState([]);
  const [renewableData, setRenewableData] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Fetch feedback data and user data from the backend
  useEffect(() => {
    // Fetch feedbacks
    axios.get('http://localhost:3001/admin/feedback', { withCredentials: true })
      .then(response => {
        setFeedbacks(response.data);
        processFeedbackData(response.data); // Process feedback data for the Pie chart
        analyzeSentiment(response.data); // Analyze sentiment for the bar chart
      })
      .catch(error => {
        console.error("There was an error fetching feedback data!", error);
      });

    // Fetch users
    axios.get('http://localhost:3001/admin/users', { withCredentials: true })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching users data!", error);
      });

    // Fetch the admin's name
    axios.get('http://localhost:3001/user', { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setAdminName(response.data.user.name);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the admin's name!", error);
      });

    // Fetch cost analysis data
    axios.get('http://localhost:3001/admin/cost-analysis', { withCredentials: true })
      .then(response => {
        setCostAnalysisData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching cost analysis data!", error);
      });

    // Fetch carbon payback data
    fetchCarbonPaybackData();

    // Fetch renewable energy data
    fetchRenewableData();

    if (activeSection === 'carbonPayback') {
      axios.get('http://localhost:3001/admin/carbon-payback', { withCredentials: true })
        .then(response => {
          setCarbonPaybackData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching carbon payback data!", error);
        });
    }
  }, [activeSection]);

  const processFeedbackData = (feedbacks) => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(({ rating }) => {
      if (ratingCounts[rating] !== undefined) {
        ratingCounts[rating]++;
      }
    });

    const chartData = Object.keys(ratingCounts).map(key => ({
      rating: `${key} Star`,
      value: ratingCounts[key],
    }));

    setFeedbackChartData(chartData);
  };

  // Sentiment analysis based on rating
  const analyzeSentiment = (feedbacks) => {
    const sentimentCounts = { negative: 0, slightlyNegative: 0, neutral: 0, slightlyPositive: 0, positive: 0 };

    feedbacks.forEach(({ rating }) => {
      if (rating === 1) {
        sentimentCounts.negative++;
      } else if (rating === 2) {
        sentimentCounts.slightlyNegative++;
      } else if (rating === 3) {
        sentimentCounts.neutral++;
      } else if (rating === 4) {
        sentimentCounts.slightlyPositive++;
      } else if (rating === 5) {
        sentimentCounts.positive++;
      }
    });

    const sentimentChartData = [
      { sentiment: 'Negative', value: sentimentCounts.negative },
      { sentiment: 'Slightly Negative', value: sentimentCounts.slightlyNegative },
      { sentiment: 'Neutral', value: sentimentCounts.neutral },
      { sentiment: 'Slightly Positive', value: sentimentCounts.slightlyPositive },
      { sentiment: 'Positive', value: sentimentCounts.positive },
    ];

    setSentimentData(sentimentChartData);
  };

  const fetchCarbonPaybackData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/carbon-payback', { withCredentials: true });
      setCarbonPaybackData(response.data);
    } catch (error) {
      console.error("There was an error fetching carbon payback data!", error);
    }
  };

  const fetchRenewableData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/renewable-energy', { withCredentials: true });
      setRenewableData(response.data);
    } catch (error) {
      console.error("There was an error fetching renewable energy data!", error);
    }
  };

  // Open the edit modal
  const handleEditClick = (userId, currentRole) => {
    setSelectedUserId(userId);
    setSelectedRole(currentRole);
    setOpen(true); // Open the modal
  };

  // Close the edit modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle role change
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Save the updated role
  const handleSave = () => {
    // Send the updated role to the backend
    axios.put(`http://localhost:3001/admin/users/${selectedUserId}`, { role: selectedRole }, { withCredentials: true })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUserId ? { ...user, role: selectedRole } : user
          )
        );
        handleClose(); // Close the modal after saving
      })
      .catch((error) => {
        console.error("There was an error updating the role!", error);
      });
  };

  const calculateOverallTotals = (data) => {
    let totalProductCost = 0;
    let totalInstallationCost = 0;
    let totalMaintenanceCost = 0;

    data.forEach(item => {
      totalProductCost += item.TotalProductCost;
      totalInstallationCost += item.TotalInstallationCost;
      totalMaintenanceCost += item.TotalMaintenanceCost;
    });

    return [
      {
        name: "Total Costs",
        TotalProductCost: totalProductCost,
        TotalInstallationCost: totalInstallationCost,
        TotalMaintenanceCost: totalMaintenanceCost,
      }
    ];
  };

  const calculateOverallCarbonData = (data) => {
    let totalCarbonPaybackPeriod = 0;
    let totalCarbonEmission = 0;

    data.forEach(item => {
      totalCarbonPaybackPeriod += item.CarbonPaybackPeriod;
      totalCarbonEmission += item.TotalCarbonEmission;
    });

    return [
      { name: "Total Carbon Payback Period", value: totalCarbonPaybackPeriod },
      { name: "Total Carbon Emission", value: totalCarbonEmission },
    ];
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
    { text: 'Users', icon: <PersonIcon />, section: 'users' },
    { text: 'Feedback Ratings', icon: <RatingIcon />, section: 'feedbackRatings' },
    { text: 'Feedbacks', icon: <FeedbackIcon />, section: 'feedbacks' },
    { text: 'Top Renewable Sources', icon: <SolarPanel />, section: 'renewableSources' },
    { text: 'Cost Analysis', icon: <CostIcon />, section: 'costAnalysis' },
    { text: 'Carbon Payback Analysis', icon: <CarbonIcon />, section: 'carbonPayback' },
  ];

  const drawer = (
    <Box sx={{ backgroundColor: '#100c34', height: '100vh' }}>
      {/* Logo and Title in the Drawer */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={greensphereLogo}
          alt="GreenSphere Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
          GreenSphere
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => setActiveSection(item.section)}
            sx={{
              backgroundColor: activeSection === item.section ? '#7b8b57' : 'transparent', // Active state color
              '&:hover': {
                backgroundColor: '#7b8b57', // Hover color
                cursor: 'pointer', // Change cursor to pointer on hover
              },
              color: '#EAEAEA'
            }}
          >
            <ListItemIcon sx={{ color: '#EAEAEA' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: '#EAEAEA' }} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Logout />
      </List>
    </Box>
  );

  const DashboardOverview = ({ users, feedbacks }) => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={10} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
          <Typography color="textSecondary" gutterBottom>Total Users</Typography>
          <Typography variant="h4">{users.length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={10} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
          <Typography color="textSecondary" gutterBottom>Total Feedbacks</Typography>
          <Typography variant="h4">{feedbacks.length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={10} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
          <Typography color="textSecondary" gutterBottom>Average Rating</Typography>
          <Typography variant="h4">
            {(feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length || 0).toFixed(1)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={10} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
          <Typography color="textSecondary" gutterBottom>Active Users</Typography>
          <Typography variant="h4">
            {users.filter(user => user.role === 'user').length}
          </Typography>
        </Paper>
      </Grid>

      {/* Graphs Section */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={10} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h6" gutterBottom>Total Users Graph</Typography>
              <UserGraph users={users} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={10} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h6" gutterBottom>Total Feedbacks Graph</Typography>
              <FeedbackGraph feedbacks={feedbacks} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={10} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h6" gutterBottom>Average Rating Graph</Typography>
              <RatingGraph feedbacks={feedbacks} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={10} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h6" gutterBottom>Active Users Graph</Typography>
              <ActiveUserGraph users={users} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  // Graph Components
  const UserGraph = ({ users }) => {
    const data = [
      { name: 'Total Users', value: users.length },
      { name: 'Active Users', value: users.filter(user => user.role === 'user').length },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const FeedbackGraph = ({ feedbacks }) => {
    const data = [
      { name: 'Total Feedbacks', value: feedbacks.length },
      { name: 'Average Rating', value: (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length || 0).toFixed(1) },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const RatingGraph = ({ feedbacks }) => {
    const data = [
      { name: 'Average Rating', value: (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length || 0).toFixed(1) },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const ActiveUserGraph = ({ users }) => {
    const data = [
      { name: 'Active Users', value: users.filter(user => user.role === 'user').length },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    );
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#10042c'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Welcome, {adminName || 'Admin'}!
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        {activeSection === 'dashboard' && <DashboardOverview users={users} feedbacks={feedbacks} />}
        {activeSection === 'users' && (
          <Box sx={{ marginBottom: "2rem", marginTop: "2rem", maxHeight: "500px", overflow: "auto" }}>
            <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff", height: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Users:
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "auto", marginBottom: "2rem" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ marginRight: 2 }}>{user.name[0]}</Avatar>
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="secondary" onClick={() => handleEditClick(user._id, user.role)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

        )}

        {activeSection === 'feedbackRatings' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                  Feedback Ratings Distribution:
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feedbackChartData}
                      dataKey="value"
                      nameKey="rating"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {feedbackChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.rating === "1 Star" ? "#ff4d4d" : // Red for 1 Star
                              entry.rating === "2 Star" ? "#ffcc00" : // Yellow for 2 Star
                                entry.rating === "3 Star" ? "#ffb84d" : // Orange for 3 Star
                                  entry.rating === "4 Star" ? "#33cc33" : // Green for 4 Star
                                    "#3399ff" // Blue for 5 Star (default if no other match)
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend align="center" verticalAlign="top" layout="horizontal" />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Feedback Sentiment Bar Chart Section */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                  Feedback Sentiment Distribution:
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sentiment" />
                    <YAxis />
                    <Bar dataKey="value" fill="#8884d8" />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeSection === 'feedbacks' && (
          <Box sx={{ maxHeight: "600px", overflow: "auto", marginBottom: "2rem" }}>
            <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff", height: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Feedbacks:
              </Typography>

              <TableContainer component={Paper} sx={{ maxHeight: "500px", overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedbacks.map((feedback) => (
                      <TableRow key={feedback._id}>
                        <TableCell>{feedback.name}</TableCell>
                        <TableCell>
                          <Rating name="feedback-rating" value={feedback.rating} readOnly precision={0.5} />
                        </TableCell>
                        <TableCell>{feedback.comment}</TableCell>
                        <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {activeSection === 'renewableSources' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                  Total Used Renewable Energy:
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={renewableData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalUsed" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff", marginTop: "1rem" }}>
                <ListItem>
                  <ListItemIcon>
                    <WindPower /> {/* Icon for Wind Energy */}
                  </ListItemIcon>
                  <ListItemText primary="Wind Energy" secondary={`${renewableData.find(item => item.source === 'Wind Energy')?.totalUsed || 0} kWh`} />
                </ListItem>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff", marginTop: "1rem" }}>
                <ListItem>
                  <ListItemIcon>
                    <Water /> {/* Icon for HydroPower Energy */}
                  </ListItemIcon>
                  <ListItemText primary="HydroPower Energy" secondary={`${renewableData.find(item => item.source === 'HydroPower Energy')?.totalUsed || 0} kWh`} />
                </ListItem>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff", marginTop: "1rem" }}>
                <ListItem>
                  <ListItemIcon>
                    <SolarPanel /> {/* Icon for Solar Energy */}
                  </ListItemIcon>
                  <ListItemText primary="Solar Energy" secondary={`${renewableData.find(item => item.source === 'Solar Energy')?.totalUsed || 0} kWh`} />
                </ListItem>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: "1rem", borderRadius: "12px", backgroundColor: "#fff", marginTop: "1rem" }}>
                <ListItem>
                  <ListItemIcon>
                    <LocalFlorist /> {/* Icon for Geothermal Energy */}
                  </ListItemIcon>
                  <ListItemText primary="Geothermal Energy" secondary={`${renewableData.find(item => item.source === 'Geothermal Energy')?.totalUsed || 0} kWh`} />
                </ListItem>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeSection === 'costAnalysis' && (
          <Box>
            <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Cost Analysis:
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Total Product Cost</TableCell>
                      <TableCell>Total Installation Cost</TableCell>
                      <TableCell>Total Maintenance Cost</TableCell>
                      <TableCell>Grand Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {costAnalysisData.map((data) => (
                      <TableRow key={data._id}>
                        <TableCell>{data.user_id.email}</TableCell>
                        <TableCell>{data.TotalProductCost}</TableCell>
                        <TableCell>{data.TotalInstallationCost}</TableCell>
                        <TableCell>{data.TotalMaintenanceCost}</TableCell>
                        <TableCell>{data.GrandTotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>


              {/* Bar Graph for Overall Totals */}
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", marginTop: "2rem" }}>
                Overall Cost Breakdown:
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculateOverallTotals(costAnalysisData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="TotalProductCost" fill="#8884d8" />
                  <Bar dataKey="TotalInstallationCost" fill="#82ca9d" />
                  <Bar dataKey="TotalMaintenanceCost" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        )}

        {activeSection === 'carbonPayback' && (
          <Box>
            <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Carbon Payback Period Analysis:
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Carbon Payback Period</TableCell>
                      <TableCell>Total Carbon Emission</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carbonPaybackData.map((data) => (
                      <TableRow key={data._id}>
                        <TableCell>{data.user_id.email}</TableCell>
                        <TableCell>{data.CarbonPaybackPeriod}</TableCell>
                        <TableCell>{data.TotalCarbonEmission}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>


              {/* Icons and Totals Section */}
              <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <HandCoins size={48} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Total Carbon Payback Period
                  </Typography>
                  <Typography variant="body1">
                    {calculateOverallCarbonData(carbonPaybackData)[0].value}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <AlarmSmoke size={48} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Total Carbon Emission
                  </Typography>
                  <Typography variant="body1">
                    {calculateOverallCarbonData(carbonPaybackData)[1].value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Edit Role Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": {
              width: "500px",
              maxWidth: "80%",
              padding: "16px", // Add padding for better spacing
            },
          }}
        >
          <DialogTitle sx={{ wordWrap: "break-word" }}>Edit User Role</DialogTitle>
          <DialogContent sx={{ paddingBottom: "16px" }}>
            <FormControl fullWidth sx={{ marginTop: "16px" }}>
              <InputLabel id="role-select-label" sx={{ whiteSpace: "normal" }}>Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedRole}
                onChange={handleRoleChange}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancel</Button>
            <Button onClick={handleSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminHome;