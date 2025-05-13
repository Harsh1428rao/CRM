import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    orderNumber: '',
    amount: '',
    status: 'pending',
    items: [{ name: '', quantity: '', price: '' }]
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get('https://crm-1-30zn.onrender.com/api/orders', {
=======
      const response = await axios.get('http://localhost:5000/api/orders', {
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get('https://crm-1-30zn.onrender.com/api/customers', {
=======
      const response = await axios.get('http://localhost:5000/api/customers', {
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleOpenDialog = (order = null) => {
    if (order) {
      setFormData({
        customerId: order.customerId,
        orderNumber: order.orderNumber,
        amount: order.amount,
        status: order.status,
        items: order.items
      });
      setSelectedOrder(order);
    } else {
      setFormData({
        customerId: '',
        orderNumber: '',
        amount: '',
        status: 'pending',
        items: [{ name: '', quantity: '', price: '' }]
      });
      setSelectedOrder(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: '', price: '' }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    try {
      const orderData = {
        ...formData,
        amount: parseFloat(formData.amount),
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };

      if (selectedOrder) {
        await axios.patch(
<<<<<<< HEAD
          `https://crm-1-30zn.onrender.com/api/orders/${selectedOrder._id}`,
=======
          `http://localhost:5000/api/orders/${selectedOrder._id}`,
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        await axios.post(
<<<<<<< HEAD
          'https://crm-1-30zn.onrender.com/api/orders',
=======
          'http://localhost:5000/api/orders',
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }

      fetchOrders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
<<<<<<< HEAD
        await axios.delete(`https://crm-1-30zn.onrender.com/api/orders/${orderId}`, {
=======
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Orders</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  {customers.find(c => c._id === order.customerId)?.name}
                </TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {order.items.map((item, index) => (
                    <Chip
                      key={index}
                      label={`${item.name} (${item.quantity})`}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(order)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(order._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedOrder ? 'Edit Order' : 'Add Order'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Customer</InputLabel>
            <Select
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
              label="Customer"
            >
              {customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Order Number"
            value={formData.orderNumber}
            onChange={(e) =>
              setFormData({ ...formData, orderNumber: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Items
          </Typography>
          {formData.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, 'name', e.target.value)
                }
                sx={{ flex: 2 }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, 'quantity', e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <TextField
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, 'price', e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                onClick={() => handleRemoveItem(index)}
                disabled={formData.items.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddItem} sx={{ mt: 1 }}>
            Add Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedOrder ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderList; 