import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoDetail from './components/CryptoDetail';
import CryptoAIAssistant from './components/CryptoAIAssistant';
import { createTheme, ThemeProvider, Typography, Box, Grid } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    background: {
      default: '#f0f0f0',
    },
  },
});

function ErrorFallback({error}) {
  return (
    <Box p={3} textAlign="center">
      <Typography color="error" variant="h6">Something went wrong:</Typography>
      <Typography>{error.message}</Typography>
    </Box>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: '#f0f0f0'
          }}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 3, 
              backgroundColor: '#000000',
              color: 'white'
            }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="h2" component="h1" fontWeight="bold">
                  CryptoAI Assistant
                </Typography>
              </Link>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Routes>
                    <Route path="/" element={<CryptoList />} />
                    <Route path="/crypto/:id" element={<CryptoDetail />} />
                  </Routes>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CryptoAIAssistant />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

export default App;
