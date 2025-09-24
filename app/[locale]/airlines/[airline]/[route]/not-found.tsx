import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Airline Route Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The airline route you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/"
          sx={{ mr: 2 }}
        >
          Go home
        </Button>
        <Button
          variant="outlined"
          component={Link}
          href="/airlines"
        >
          Browse airlines
        </Button>
      </Box>
    </Container>
  );
}
