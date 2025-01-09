import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CryptoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cryptoData = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCrypto(cryptoData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!crypto) {
    return <Typography>Cryptocurrency not found</Typography>;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to List
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <img 
                src={crypto.image.large} 
                alt={crypto.name}
                style={{ width: '64px', marginRight: '16px' }}
              />
              <Typography variant="h4">
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </Typography>
            </Box>
            <Typography variant="h5" gutterBottom>
              ${crypto.market_data.current_price.usd.toLocaleString()}
            </Typography>
            <Typography color={crypto.market_data.price_change_percentage_24h > 0 ? 'green' : 'red'}>
              24h Change: {crypto.market_data.price_change_percentage_24h.toFixed(2)}%
            </Typography>
            <Box mt={2}>
              <Typography variant="h6">Market Stats</Typography>
              <Typography>Market Cap: ${crypto.market_data.market_cap.usd.toLocaleString()}</Typography>
              <Typography>24h Volume: ${crypto.market_data.total_volume.usd.toLocaleString()}</Typography>
              <Typography>Circulating Supply: {crypto.market_data.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">About {crypto.name}</Typography>
            <Typography 
              dangerouslySetInnerHTML={{ __html: crypto.description.en }}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CryptoDetail; 