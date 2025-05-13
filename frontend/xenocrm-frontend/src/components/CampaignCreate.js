import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Sample segments data
const sampleSegments = [
  { _id: '1', name: 'High-Value Customers', customerCount: 150 },
  { _id: '2', name: 'New Customers', customerCount: 75 },
  { _id: '3', name: 'Inactive Customers', customerCount: 200 },
  { _id: '4', name: 'Premium Members', customerCount: 50 },
  { _id: '5', name: 'Regular Buyers', customerCount: 300 }
];

const CampaignCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [segments, setSegments] = useState([]);
  const [formData, setFormData] = useState({
    name: 'Summer Sale 2024',
    description: 'Special summer promotion for our loyal customers',
    targetSegment: '',
    message: 'Dear valued customer,\n\nWe are excited to announce our exclusive summer sale! Get up to 50% off on selected items.\n\nUse code: SUMMER2024\n\nBest regards,\nYour Team'
  });
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [aiLoading, setAILoading] = useState(false);

  // Debug log for user data
  useEffect(() => {
    console.log('Current user in CampaignCreate:', user);
  }, [user]);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://crm-1-30zn.onrender.com/api/segments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.length > 0) {
        setSegments(response.data);
        if (response.data[0]?._id) {
          setFormData(prev => ({
            ...prev,
            targetSegment: response.data[0]._id
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching segments:', error);
      setError('Failed to load segments. Please create segments first.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== Campaign Creation Attempt ===');
    console.log('Current user:', user);
    
    if (!user?._id) {
      console.error('No user ID available:', user);
      setError('User information not available. Please try logging in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // First, test the auth using the /api/auth/me endpoint
      try {
        const authTestResponse = await axios.get('https://crm-1-30zn.onrender.com/api/auth/me', {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Auth test response:', authTestResponse.data);
        
        // Verify the user ID matches
        if (authTestResponse.data._id !== user._id) {
          console.error('User ID mismatch:', {
            frontend: user._id,
            backend: authTestResponse.data._id
          });
          setError('User authentication mismatch. Please try logging in again.');
          return;
        }
      } catch (authError) {
        console.error('Auth test failed:', authError);
        setError('Authentication failed. Please try logging in again.');
        return;
      }
      
      // Include createdBy in the campaign data
      const campaignData = {
        name: formData.name,
        description: formData.description,
        targetSegment: formData.targetSegment,
        message: formData.message,
        status: 'pending',
        createdBy: user._id, // Explicitly include createdBy
        stats: {
          delivered: 0,
          failed: 0
        }
      };

      console.log('Sending campaign data:', campaignData);

      // Log the complete request
      console.log('Campaign creation request:', {
        url: 'http://localhost:5000/api/campaigns',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: campaignData
      });

      const response = await axios.post('https://crm-1-30zn.onrender.com/api/campaigns', campaignData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Campaign creation response:', response.data);

      if (response.data) {
        navigate('/campaigns');
      }
    } catch (error) {
      console.error('=== Campaign Creation Error ===');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Error response:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Log the complete error response
      if (error.response?.data) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      let errorMessage = 'Failed to create campaign. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
        if (error.response.data.details) {
          errorMessage += '\nDetails: ' + JSON.stringify(error.response.data.details, null, 2);
        }
      } else if (error.response?.data?.details) {
        errorMessage += Object.entries(error.response.data.details)
          .map(([field, isMissing]) => `${field}: ${isMissing ? 'required' : 'invalid'}`)
          .join(', ');
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestions = async () => {
    setAILoading(true);
    setAISuggestions([]);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://crm-1-30zn.onrender.com/api/campaigns/suggest-messages',
        {
          description: formData.description,
          segment: segments.find(s => s._id === formData.targetSegment)?.name || ''
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAISuggestions(response.data);
    } catch (error) {
      console.error('AI suggestion error:', error);
      if (error.response) {
        alert('AI suggestion error: ' + JSON.stringify(error.response.data, null, 2));
      } else {
        alert('AI suggestion error: ' + error.message);
      }
    }
    setAILoading(false);
  };

  if (!segments.length) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Create New Campaign
            </Typography>
            <Alert severity="warning">
              No segments available. Please create segments first before creating a campaign.
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/segments')}
              >
                Go to Segments
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create New Campaign
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Campaign Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              helperText="Enter a descriptive name for your campaign"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
              helperText="Describe the purpose and goals of your campaign"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Target Segment</InputLabel>
              <Select
                name="targetSegment"
                value={formData.targetSegment}
                onChange={handleChange}
                required
                label="Target Segment"
              >
                {segments.map((segment) => (
                  <MenuItem key={segment._id} value={segment._id}>
                    {segment.name} ({segment.customerCount || 0} customers)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={6}
              required
              margin="normal"
              helperText="Enter the message that will be sent to your target segment"
            />

            <Button
              onClick={handleAISuggestions}
              variant="outlined"
              sx={{ mt: 2, mb: 1 }}
              disabled={aiLoading}
            >
              {aiLoading ? 'Loading AI Suggestions...' : 'Suggest Messages with AI'}
            </Button>

            {aiSuggestions.length > 0 && (
              <div>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>AI Suggestions:</Typography>
                {aiSuggestions.map((msg, idx) => (
                  <Paper
                    key={idx}
                    sx={{ p: 1, my: 1, cursor: 'pointer', background: '#f5f5f5' }}
                    onClick={() => setFormData({ ...formData, message: msg })}
                  >
                    {msg}
                  </Paper>
                ))}
              </div>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || !formData.targetSegment}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Campaign'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/campaigns')}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CampaignCreate; 