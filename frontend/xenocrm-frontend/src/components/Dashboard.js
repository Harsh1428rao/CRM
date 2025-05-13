import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Campaign as CampaignIcon,
  TrendingUp as TrendingUpIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {React.cloneElement(icon, { sx: { color, mr: 1 } })}
      <Typography variant="h6" component="div">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" component="div">
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCampaigns: 0,
    totalDelivered: 0,
    totalFailed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [customersRes, campaignsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/customers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const totalDelivered = campaignsRes.data.reduce(
        (sum, campaign) => sum + campaign.stats.delivered,
        0
      );
      const totalFailed = campaignsRes.data.reduce(
        (sum, campaign) => sum + campaign.stats.failed,
        0
      );

      setStats({
        totalCustomers: customersRes.data.length,
        totalCampaigns: campaignsRes.data.length,
        totalDelivered,
        totalFailed
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Campaigns"
            value={stats.totalCampaigns}
            icon={<CampaignIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Messages Delivered"
            value={stats.totalDelivered}
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Failed Deliveries"
            value={stats.totalFailed}
            icon={<ErrorIcon />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 