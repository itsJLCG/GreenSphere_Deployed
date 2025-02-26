import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Badge, Tooltip } from '@mui/material';
import axios from 'axios';
import Rating from '@mui/material/Rating'; // Import Rating from MUI
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'; // Import PieChart components
import { Menu as MenuIcon, Dashboard as DashboardIcon, Person as PersonIcon, Feedback as FeedbackIcon, EmojiEvents as RatingIcon, SolarPower as SolarPanel, AttachMoney as CostIcon, Co2 as CarbonIcon, Notifications as NotificationsIcon, Settings as SettingsIcon, ExitToApp as LogoutIcon, Warning as AlarmSmoke, MonetizationOn as HandCoins, WindPower, Water, LocalFlorist, Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';
import Logout from '../Logout'; // Import the Logout component
import greensphereLogo from '../../assets/images/greenspherelogo.png'; // Import the logo
import {  
  Doughnut 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';
import { Bar as ChartBar, Line as ChartLine, Pie as ChartPie, Doughnut as ChartDoughnut } from 'react-chartjs-2';
import { 
  SpaceDashboard, 
  Groups, 
  StarRate, 
  Comment, 
  EnergySavingsLeaf, 
  PriceCheck, 
  Co2,
  Logout as LogoutIconNew
} from '@mui/icons-material';

// Register Chart.js components properly
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

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
    { text: 'Dashboard', icon: <SpaceDashboard sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'dashboard' },
    { text: 'Users', icon: <Groups sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'users' },
    { text: 'Feedback Ratings', icon: <StarRate sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'feedbackRatings' },
    { text: 'Feedbacks', icon: <Comment sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'feedbacks' },
    { text: 'Top Renewable Sources', icon: <EnergySavingsLeaf sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'renewableSources' },
    { text: 'Cost Analysis', icon: <PriceCheck sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'costAnalysis' },
    { text: 'Carbon Payback Analysis', icon: <Co2 sx={{ color: '#7b8b57', fontSize: 24, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }} />, section: 'carbonPayback' },
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
              backgroundColor: activeSection === item.section ? '#515c3a' : 'transparent',
              '&:hover': {
                backgroundColor: '#515c3a',
                cursor: 'pointer',
              },
              color: '#EAEAEA',
              transition: 'all 0.3s ease',
              borderRadius: '0 20px 20px 0',
              marginRight: '10px',
              marginBottom: '4px',
              padding: '10px 16px',
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: activeSection === item.section ? '#FFFFFF' : 'inherit',
                minWidth: '40px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: '#EAEAEA',
                '& .MuiTypography-root': {
                  fontWeight: activeSection === item.section ? 'bold' : 'normal',
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Logout />
      </List>
    </Box>
  );

  // Enhanced Dashboard Graphs

  // UserGraph Component
  const UserGraph = ({ users }) => {
    const adminCount = users.filter(user => user.role === 'admin').length;
    const userCount = users.filter(user => user.role === 'user').length;
    
    const data = {
      labels: ['Admin', 'User'],
      datasets: [
        {
          label: 'User Count',
          data: [adminCount, userCount],
          backgroundColor: ['#8884d8', '#82ca9d'],
          borderColor: ['#8884d8', '#82ca9d'],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          displayColors: true,
        },
        legend: {
          position: 'bottom',
        },
      },
    };
    
    return (
      <div style={{ height: 250 }}>
        <ChartBar data={data} options={options} />
      </div>
    );
  };

  // FeedbackGraph Component
  const FeedbackGraph = ({ feedbacks }) => {
    // Group feedbacks by month
    const monthlyFeedbacks = {};
    feedbacks.forEach(feedback => {
      const month = new Date(feedback.createdAt).toLocaleString('default', { month: 'short' });
      monthlyFeedbacks[month] = (monthlyFeedbacks[month] || 0) + 1;
    });
    
    const data = {
      labels: Object.keys(monthlyFeedbacks),
      datasets: [
        {
          label: 'Feedback Count',
          data: Object.values(monthlyFeedbacks),
          backgroundColor: '#ff6384',
          borderColor: '#ff6384',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
        },
        legend: {
          position: 'bottom',
        },
      },
    };
    
    return (
      <div style={{ height: 250 }}>
        <ChartBar data={data} options={options} />
      </div>
    );
  };

  // Replace the RatingGraph component with this new RecentFeedbackGraph component
  const RecentFeedbackGraph = ({ feedbacks }) => {
    // Get the 10 most recent feedbacks
    const recentFeedbacks = [...feedbacks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .reverse(); // Reverse to show chronological order
    
    const data = {
      labels: recentFeedbacks.map(feedback => {
        const date = new Date(feedback.createdAt);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Recent Ratings',
          data: recentFeedbacks.map(feedback => feedback.rating),
          backgroundColor: '#4caf50',
          borderColor: '#4caf50',
          borderWidth: 2,
          pointBackgroundColor: recentFeedbacks.map(feedback => {
            // Color points based on rating
            if (feedback.rating <= 2) return '#ff5252'; // Red for low ratings
            if (feedback.rating <= 3) return '#ffb74d'; // Orange for medium ratings
            return '#66bb6a'; // Green for high ratings
          }),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: false,
          tension: 0.1
        }
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          callbacks: {
            title: function(context) {
              const index = context[0].dataIndex;
              const feedback = recentFeedbacks[index];
              const date = new Date(feedback.createdAt);
              return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            },
            label: function(context) {
              const index = context.dataIndex;
              const feedback = recentFeedbacks[index];
              return [
                `Rating: ${feedback.rating} stars`,
                `Comment: ${feedback.comment ? (feedback.comment.length > 30 ? feedback.comment.substring(0, 30) + '...' : feedback.comment) : 'No comment'}`
              ];
            }
          }
        },
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return value + (value === 1 ? ' Star' : ' Stars');
            }
          },
          grid: {
            color: '#f0f0f0'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
    
    return (
      <div style={{ height: 250 }}>
        <ChartLine data={data} options={options} />
      </div>
    );
  };

  // ActiveUserGraph Component
  const ActiveUserGraph = ({ users }) => {
    const activeUsers = users.filter(user => user.role === 'user').length;
    const totalUsers = users.length;
    const percentage = (activeUsers / totalUsers * 100).toFixed(1);
    
    const data = {
      labels: ['Active Users', 'Total Users'],
      datasets: [
        {
          label: 'User Count',
          data: [activeUsers, totalUsers],
          backgroundColor: ['#42a5f5', '#ff0072'],
          borderColor: ['#42a5f5', '#ff0072'],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const datasetLabel = context.dataset.label || '';
              const label = context.label || '';
              const calculatedPercentage = label === 'Active Users' ? percentage : '100';
              return `${datasetLabel}: ${value} (${calculatedPercentage}%)`;
            }
          }
        },
        legend: {
          position: 'bottom',
        },
      },
    };
    
    return (
      <div style={{ height: 250 }}>
        <ChartBar data={data} options={options} />
      </div>
    );
  };

  // Enhanced Dashboard Overview Cards and Graphs
  const DashboardOverview = ({ users, feedbacks }) => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} sx={{ 
          padding: "2rem", 
          borderRadius: "12px", 
          backgroundColor: "#fff",
          boxShadow: 3,
          position: "relative"
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ color: '#5c6bc0', mr: 1, fontSize: 28 }} />
            <Typography color="textSecondary" gutterBottom>Total Users</Typography>
          </Box>
          <Typography variant="h4">{users.length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} sx={{ 
          padding: "2rem", 
          borderRadius: "12px", 
          backgroundColor: "#fff",
          boxShadow: 3,
          position: "relative"
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FeedbackIcon sx={{ color: '#66bb6a', mr: 1, fontSize: 28 }} />
            <Typography color="textSecondary" gutterBottom>Total Feedbacks</Typography>
          </Box>
          <Typography variant="h4">{feedbacks.length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} sx={{ 
          padding: "2rem", 
          borderRadius: "12px", 
          backgroundColor: "#fff",
          boxShadow: 3,
          position: "relative"
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <RatingIcon sx={{ color: '#ffca28', mr: 1, fontSize: 28 }} />
            <Typography color="textSecondary" gutterBottom>Average Rating</Typography>
          </Box>
          <Typography variant="h4">
            {(feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length || 0).toFixed(1)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} sx={{ 
          padding: "2rem", 
          borderRadius: "12px", 
          backgroundColor: "#fff",
          boxShadow: 3,
          position: "relative"
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ color: '#42a5f5', mr: 1, fontSize: 28 }} />
            <Typography color="textSecondary" gutterBottom>Active Users</Typography>
          </Box>
          <Typography variant="h4">
            {users.filter(user => user.role === 'user').length}
          </Typography>
        </Paper>
      </Grid>

      {/* Graphs Section */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              position: "relative"
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>Total Users Graph</Typography>
              <UserGraph users={users} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              position: "relative"
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>Total Feedbacks Graph</Typography>
              <FeedbackGraph feedbacks={feedbacks} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              position: "relative"
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>Recent Feedback Trends</Typography>
              <RecentFeedbackGraph feedbacks={feedbacks} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              position: "relative"
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>Active Users Graph</Typography>
              <ActiveUserGraph users={users} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#10042c',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          minHeight: '90px', // Increased from 70px to 90px for more height
          py: 2, // Add vertical padding
          px: { xs: 2, sm: 3 } // Horizontal padding
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography 
                variant="h5" // Increased from h6 to h5
                noWrap 
                component="div"
                sx={{ 
                  fontWeight: 700, // Increased from 600 to 700
                  fontSize: '1.4rem', // Increased from 1.2rem
                  letterSpacing: '0.5px',
                  mb: 0.5 // Add margin bottom for spacing
                }}
              >
                Welcome, {adminName || 'Admin'}!
              </Typography>
              <Typography 
                variant="subtitle1" // Increased from subtitle2
                sx={{ 
                  opacity: 0.8,
                  display: { xs: 'none', sm: 'block' },
                  fontSize: '0.95rem' // Slightly larger font
                }}
              >
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
          </Box>
          
          {/* Right side - avatar with improved styling */}
          <Box>
            <Tooltip title="Account">
              <IconButton 
                edge="end" 
                color="inherit"
                aria-label="account of current user"
                aria-haspopup="true"
                sx={{
                  padding: '10px', // Increased from 8px
                  border: '2px solid rgba(123, 139, 87, 0.5)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(123, 139, 87, 0.2)',
                    borderColor: '#7b8b57'
                  }
                }}
              >
                <Avatar sx={{ 
                  width: 45, // Increased from 38
                  height: 45, // Increased from 38
                  bgcolor: '#7b8b57',
                  fontWeight: 'bold',
                  fontSize: '1.4rem' // Increased from 1.2rem
                }}>
                  {adminName ? adminName[0] : 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
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
          mt: 11, // Increased from 8 to accommodate taller AppBar
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        {activeSection === 'dashboard' && <DashboardOverview users={users} feedbacks={feedbacks} />}
        {activeSection === 'users' && (
          <Box sx={{ marginBottom: "2rem", marginTop: "2rem" }}>
            <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Users:
              </Typography>
              <TableContainer sx={{ 
                maxHeight: "500px", 
                overflow: "auto", 
                borderRadius: "8px",
                boxShadow: 2,
                '& .MuiTableCell-head': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                },
                '& .MuiTableRow-root:hover': {
                  backgroundColor: '#f9f9f9'
                }
              }}>
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
            <Grid item xs={12} md={12}>
              <Paper elevation={3} sx={{ 
                padding: "2rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff",
                boxShadow: 3,
                position: "relative"
              }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                  Feedback Ratings Distribution:
                </Typography>
                <Box sx={{ 
                  position: "relative",
                  zIndex: 2,
                  height: 350 
                }}>
                  <ChartDoughnut 
                    data={{
                      labels: feedbackChartData.map(item => item.rating),
                      datasets: [
                        {
                          data: feedbackChartData.map(item => item.value),
                          backgroundColor: [
                            "#ff5252", // Red for 1 Star
                            "#ffb74d", // Orange for 2 Star
                            "#ffeb3b", // Yellow for 3 Star
                            "#66bb6a", // Green for 4 Star
                            "#42a5f5"  // Blue for 5 Star
                          ],
                          borderColor: "#ffffff",
                          borderWidth: 2,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        tooltip: {
                          enabled: true,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          titleColor: '#333',
                          bodyColor: '#666',
                          borderColor: '#ddd',
                          borderWidth: 1,
                          cornerRadius: 8,
                          boxPadding: 6,
                          callbacks: {
                            label: function(context) {
                              const value = context.raw;
                              const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                              const percentage = ((value / total) * 100).toFixed(0);
                              return `${context.label}: ${value} feedbacks (${percentage}%)`;
                            }
                          }
                        },
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Enhanced Feedback Sentiment Bar Chart Section */}
            <Grid item xs={12} md={12}>
              <Paper elevation={3} sx={{ 
                padding: "2rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff",
                marginTop: "2rem",
                boxShadow: 3,
                position: "relative"
              }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                  Feedback Sentiment Distribution:
                </Typography>
                <Box sx={{ 
                  position: "relative",
                  zIndex: 2,
                  height: 350 
                }}>
                  <ChartBar
                    data={{
                      labels: sentimentData.map(item => item.sentiment),
                      datasets: [
                        {
                          label: 'Sentiment Count',
                          data: sentimentData.map(item => item.value),
                          backgroundColor: [
                            "#ef5350", // Negative
                            "#ff9800", // Slightly Negative
                            "#ffee58", // Neutral
                            "#81c784", // Slightly Positive
                            "#4fc3f7"  // Positive
                          ],
                          borderColor: [
                            "#ef5350",
                            "#ff9800",
                            "#ffee58",
                            "#81c784",
                            "#4fc3f7"
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        tooltip: {
                          enabled: true,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          titleColor: '#333',
                          bodyColor: '#666',
                          borderColor: '#ddd',
                          borderWidth: 1,
                          cornerRadius: 8,
                          boxPadding: 6,
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.raw} feedbacks`;
                            }
                          }
                        },
                        legend: {
                          position: 'bottom'
                        }
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: '#f0f0f0'
                          },
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeSection === 'feedbacks' && (
          <Box sx={{ marginBottom: "2rem" }}>
            <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Feedbacks:
              </Typography>

              <TableContainer sx={{ 
                maxHeight: "500px", 
                overflow: "auto", 
                borderRadius: "8px",
                boxShadow: 2,
                '& .MuiTableCell-head': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                },
                '& .MuiTableRow-root:hover': {
                  backgroundColor: '#f9f9f9'
                }
              }}>
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
              <Paper elevation={3} sx={{ 
                padding: "2rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff",
                boxShadow: 3,
                position: "relative"
              }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                  Total Used Renewable Energy:
                </Typography>
                <Box sx={{ 
                  position: "relative", 
                  zIndex: 2,
                  height: 350 
                }}>
                  <ChartLine
                    data={{
                      labels: renewableData.map(item => item.source),
                      datasets: [
                        {
                          label: 'Energy Consumption',
                          data: renewableData.map(item => item.totalUsed),
                          backgroundColor: 'rgba(38, 166, 154, 0.2)',
                          borderColor: '#26a69a',
                          borderWidth: 3,
                          pointBackgroundColor: '#fff',
                          pointBorderColor: '#26a69a',
                          pointBorderWidth: 2,
                          pointRadius: 6,
                          pointHoverRadius: 8,
                          fill: true,
                          tension: 0.1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        tooltip: {
                          enabled: true,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          titleColor: '#333',
                          bodyColor: '#666',
                          borderColor: '#ddd',
                          borderWidth: 1,
                          cornerRadius: 8,
                          boxPadding: 6,
                          callbacks: {
                            label: function(context) {
                              return `Energy Used: ${context.raw} kWh`;
                            }
                          }
                        },
                        legend: {
                          position: 'bottom'
                        }
                      },
                      scales: {
                        x: {
                          grid: {
                            color: '#f0f0f0'
                          }
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: '#f0f0f0'
                          },
                          ticks: {
                            callback: function(value) {
                              return `${value} kWh`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ 
                padding: "1.5rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff", 
                marginTop: "1rem",
                boxShadow: 3,
                position: "relative",
                height: "100px",
              }}>
                <ListItem>
                  <ListItemIcon>
                    <WindPower sx={{ color: '#42a5f5', fontSize: 38 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Wind Energy</Typography>} 
                    secondary={<Typography variant="body1" sx={{ color: '#616161', fontSize: '1.1rem' }}>{`${renewableData.find(item => item.source === 'Wind Energy')?.totalUsed || 0} kWh`}</Typography>} 
                  />
                </ListItem>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ 
                padding: "1.5rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff", 
                marginTop: "1rem",
                boxShadow: 3,
                position: "relative",
                height: "100px",
              }}>
                <ListItem>
                  <ListItemIcon>
                    <Water sx={{ color: '#29b6f6', fontSize: 38 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>HydroPower Energy</Typography>} 
                    secondary={<Typography variant="body1" sx={{ color: '#616161', fontSize: '1.1rem' }}>{`${renewableData.find(item => item.source === 'HydroPower Energy')?.totalUsed || 0} kWh`}</Typography>} 
                  />
                </ListItem>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ 
                padding: "1.5rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff", 
                marginTop: "1rem",
                boxShadow: 3,
                position: "relative",
                height: "100px",
              }}>
                <ListItem>
                  <ListItemIcon>
                    <SolarPanel sx={{ color: '#ffa726', fontSize: 38 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Solar Energy</Typography>} 
                    secondary={<Typography variant="body1" sx={{ color: '#616161', fontSize: '1.1rem' }}>{`${renewableData.find(item => item.source === 'Solar Energy')?.totalUsed || 0} kWh`}</Typography>} 
                  />
                </ListItem>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ 
                padding: "1.5rem", 
                borderRadius: "12px", 
                backgroundColor: "#fff", 
                marginTop: "1rem",
                boxShadow: 3,
                position: "relative",
                height: "100px",
              }}>
                <ListItem>
                  <ListItemIcon>
                    <LocalFlorist sx={{ color: '#66bb6a', fontSize: 38 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Geothermal Energy</Typography>} 
                    secondary={<Typography variant="body1" sx={{ color: '#616161', fontSize: '1.1rem' }}>{`${renewableData.find(item => item.source === 'Geothermal Energy')?.totalUsed || 0} kWh`}</Typography>} 
                  />
                </ListItem>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeSection === 'costAnalysis' && (
          <Box>
            {/* First Container: Cost Analysis Table */}
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              marginBottom: "2rem",
              position: "relative"
            }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Cost Analysis:
              </Typography>
              <TableContainer sx={{ 
                maxHeight: "400px", 
                overflow: "auto",
                boxShadow: 2,
                borderRadius: "8px",
                '& .MuiTableCell-head': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                },
                '& .MuiTableRow-root:hover': {
                  backgroundColor: '#f9f9f9'
                }
              }}>
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
                        <TableCell>₱{data.TotalProductCost.toLocaleString()}</TableCell>
                        <TableCell>₱{data.TotalInstallationCost.toLocaleString()}</TableCell>
                        <TableCell>₱{data.TotalMaintenanceCost.toLocaleString()}</TableCell>
                        <TableCell>₱{data.GrandTotal.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Second Container: Overall Cost Breakdown */}
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              position: "relative"
            }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Overall Cost Breakdown:
              </Typography>
              <Box sx={{ 
                position: "relative", 
                zIndex: 2,
                height: 350 
              }}>
                <ChartBar
                  data={{
                    labels: calculateOverallTotals(costAnalysisData).map(item => item.name),
                    datasets: [
                      {
                        label: 'Product Cost',
                        data: calculateOverallTotals(costAnalysisData).map(item => item.TotalProductCost),
                        backgroundColor: '#8884d8',
                        borderColor: '#8884d8',
                        borderWidth: 1
                      },
                      {
                        label: 'Installation Cost',
                        data: calculateOverallTotals(costAnalysisData).map(item => item.TotalInstallationCost),
                        backgroundColor: '#82ca9d',
                        borderColor: '#82ca9d',
                        borderWidth: 1
                      },
                      {
                        label: 'Maintenance Cost',
                        data: calculateOverallTotals(costAnalysisData).map(item => item.TotalMaintenanceCost),
                        backgroundColor: '#ffc658',
                        borderColor: '#ffc658',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        cornerRadius: 8,
                        boxPadding: 6,
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ₱${context.raw.toLocaleString()}`;
                          }
                        }
                      },
                      legend: {
                        position: 'bottom'
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: '#f0f0f0'
                        },
                        ticks: {
                          callback: function(value) {
                            return `₱${value.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Box>
        )}

        {activeSection === 'carbonPayback' && (
          <Box>
            {/* First Container: Carbon Payback Table */}
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              marginBottom: "2rem",
              position: "relative"
            }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
                Carbon Payback Period Analysis:
              </Typography>
              <TableContainer sx={{ 
                maxHeight: "400px", 
                overflow: "auto",
                boxShadow: 2,
                borderRadius: "8px",
                '& .MuiTableCell-head': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                },
                '& .MuiTableRow-root:hover': {
                  backgroundColor: '#f9f9f9'
                }
              }}>
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
            </Paper>

            {/* Second Container: Carbon Metrics Cards */}
            <Paper elevation={3} sx={{ 
              padding: "2rem", 
              borderRadius: "12px", 
              backgroundColor: "#fff",
              boxShadow: 3,
              position: "relative"
            }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1.5rem" }}>
                Carbon Metrics Overview:
              </Typography>
              <Grid container spacing={3} sx={{ pb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ 
                    padding: "2rem",
                    borderRadius: "12px", 
                    backgroundColor: "#fff",
                    height: "50%",
                    minHeight: "250px",
                    boxShadow: 3,
                    position: "relative"
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexDirection: 'column',
                      height: '100%' // Ensure content fills the paper
                    }}>
                      <Avatar sx={{ 
                        bgcolor: '#e3f2fd', 
                        width: 80, 
                        height: 80, 
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <HandCoins sx={{ fontSize: 40, color: '#2196f3' }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                        Total Carbon Payback Period
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, color: '#2196f3', fontWeight: 'medium', textAlign: 'center' }}>
                        {calculateOverallCarbonData(carbonPaybackData)[0].value}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: '#757575', textAlign: 'center' }}>
                        Years to offset carbon footprint
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ 
                    padding: "2rem",
                    borderRadius: "12px", 
                    backgroundColor: "#fff",
                    height: "50%",
                    minHeight: "250px",
                    boxShadow: 3,
                    position: "relative"
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexDirection: 'column',
                      height: '100%' // Ensure content fills the paper
                    }}>
                      <Avatar sx={{ 
                        bgcolor: '#fbe9e7', 
                        width: 80, 
                        height: 80, 
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <AlarmSmoke sx={{ fontSize: 40, color: '#ff5722' }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                        Total Carbon Emission
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, color: '#ff5722', fontWeight: 'medium', textAlign: 'center' }}>
                        {calculateOverallCarbonData(carbonPaybackData)[1].value}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: '#757575', textAlign: 'center' }}>
                        Metric tons of CO₂ equivalent
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
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

