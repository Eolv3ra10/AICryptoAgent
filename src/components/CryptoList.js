import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Pagination,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CryptoList = () => {
  const navigate = useNavigate();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false
            }
          }
        );
        setCryptos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        if (error.response?.status === 429) {
          // Rate limit exceeded
          setTimeout(fetchData, 60000); // Retry after 1 minute
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCryptos = cryptos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(cryptos.length / itemsPerPage);

  return (
    <Box>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Top 100 Cryptocurrencies
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">24h Change</TableCell>
              <TableCell align="right">Market Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCryptos.map((crypto) => (
              <TableRow 
                key={crypto.id}
                onClick={() => navigate(`/crypto/${crypto.id}`)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{crypto.market_cap_rank}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src={crypto.image} 
                      alt={crypto.name} 
                      style={{ width: '20px', marginRight: '10px' }}
                    />
                    {crypto.name}
                  </Box>
                </TableCell>
                <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                <TableCell align="right">
                  ${crypto.current_price.toLocaleString()}
                </TableCell>
                <TableCell 
                  align="right"
                  style={{ 
                    color: crypto.price_change_percentage_24h > 0 ? 'green' : 'red' 
                  }}
                >
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell align="right">
                  ${crypto.market_cap.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default CryptoList; 