'use client';

import { useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Airline route error:', error);
  }, [error]);

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We encountered an error while loading the airline information. Please try again.
        </Typography>
        <Button
          variant="contained"
          onClick={reset}
          sx={{ mr: 2 }}
        >
          Try again
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.href = '/'}
        >
          Go home
        </Button>
      </Box>
    </Container>
  );
}
