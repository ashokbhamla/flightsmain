'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SearchError({ error, reset }: ErrorProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="error">
          Search Error
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error.message || 'An error occurred while loading the search results.'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={reset}
          sx={{ mr: 2 }}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.href = '/'}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
