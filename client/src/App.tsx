import React from 'react';
import { Button, Container, Typography, Box, CssBaseline } from '@mui/material';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 4, 
          borderRadius: 2,
          boxShadow: 3,
          mt: 8
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Movie Explorer App
          </Typography>
          <Typography variant="body1" gutterBottom>
            We're getting things ready for you...
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Click Me
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
