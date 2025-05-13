import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
<<<<<<< HEAD
    window.location.href = 'https://crm-1-30zn.onrender.com/api/auth/google';
=======
    window.location.href = 'http://localhost:5000/api/auth/google';
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
  };

  // Handle OAuth callback
  React.useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      login(token);
      navigate('/');
    }
  }, [login, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Welcome to XenoCRM
          </Typography>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 