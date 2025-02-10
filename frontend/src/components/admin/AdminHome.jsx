import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import Rating from '@mui/material/Rating'; // Import Rating from MUI
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import PieChart components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend, ResponsiveContainer as BarResponsiveContainer } from 'recharts'; // Import BarChart components

const AdminHome = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [open, setOpen] = useState(false); // Modal open state
  const [selectedUserId, setSelectedUserId] = useState(null); // Store selected user's ID
  const [selectedRole, setSelectedRole] = useState(''); // Store selected role
  const [roles] = useState(['admin', 'user']); // Example roles: ['admin', 'user']
  const [feedbackChartData, setFeedbackChartData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]); // Store sentiment analysis data for bar chart

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
  }, []);

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

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      {/* Welcome Admin Message */}
      <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff", marginBottom: "2rem" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
          Welcome, Admin {adminName || 'Admin'}!
        </Typography>
      </Paper>

      {/* Feedback Pie Chart Section (Above Feedbacks Table) */}
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
            <BarResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sentiment" />
                <YAxis />
                <BarLegend />
                <Bar dataKey="value" fill="#8884d8" />
                <BarTooltip />
              </BarChart>
            </BarResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Users Section */}
      <Box sx={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
            Users:
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: "2rem" }}>
            <Table>
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
                      {/* Edit button */}
                      <Button variant="contained" color="secondary" onClick={() => handleEditClick(user._id, user.role)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

     {/* Feedback Section (Table Below Pie Chart) */}
     <Box>
        <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#fff" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
            Feedbacks:
          </Typography>

          <TableContainer component={Paper}>
            <Table>
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
                      <Rating
                        name="feedback-rating"
                        value={feedback.rating}
                        readOnly
                        precision={0.5}
                      />
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
  );
};

export default AdminHome;
