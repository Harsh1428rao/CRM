import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const SegmentBuilder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: {
      field: '',
      operator: '',
      value: ''
    }
  });

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' }
  ];

  const fields = [
    { value: 'name', label: 'Customer Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'city', label: 'City' },
    { value: 'country', label: 'Country' },
    { value: 'totalOrders', label: 'Total Orders' },
    { value: 'totalSpent', label: 'Total Spent' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('criteria.')) {
      const criteriaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          [criteriaField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      setError('User information not available. Please try logging in again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const segmentData = {
        name: formData.name,
        description: formData.description,
        criteria: formData.criteria,
        createdBy: user._id
      };

      const response = await axios.post('https://crm-1-30zn.onrender.com/api/segments', segmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setSuccess('Segment created successfully!');
        // Reset form
        setFormData({
          name: '',
          description: '',
          criteria: {
            field: '',
            operator: '',
            value: ''
          }
        });
      }
    } catch (error) {
      console.error('Error creating segment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create segment. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create New Segment
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Segment Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  helperText="Enter a descriptive name for your segment"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="Describe the purpose of this segment"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Segment Criteria
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Field</InputLabel>
                  <Select
                    name="criteria.field"
                    value={formData.criteria.field}
                    onChange={handleChange}
                    required
                    label="Field"
                  >
                    {fields.map((field) => (
                      <MenuItem key={field.value} value={field.value}>
                        {field.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    name="criteria.operator"
                    value={formData.criteria.operator}
                    onChange={handleChange}
                    required
                    label="Operator"
                  >
                    {operators.map((operator) => (
                      <MenuItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Value"
                  name="criteria.value"
                  value={formData.criteria.value}
                  onChange={handleChange}
                  required
                  helperText="Enter the value to match"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || !formData.name || !formData.criteria.field || !formData.criteria.operator || !formData.criteria.value}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Segment'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SegmentBuilder; 