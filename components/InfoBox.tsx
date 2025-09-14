'use client';

import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface InfoBoxProps {
  box: {
    id?: number;
    title: string;
    price?: string;
    month?: string;
    airline?: string;
    description: string;
    type: 'round-trip' | 'one-way' | 'popular' | 'cheapest';
    buttonText?: string;
    buttonColor?: string;
  };
  onAction?: (boxId: number) => void;
}

export default function InfoBox({ box, onAction }: InfoBoxProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'round-trip':
        return '#10b981';
      case 'one-way':
        return '#1e3a8a';
      case 'popular':
        return '#f59e0b';
      case 'cheapest':
        return '#10b981';
      default:
        return '#666';
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'round-trip':
      case 'one-way':
        return 'Search Deals';
      case 'popular':
        return 'View Popular';
      case 'cheapest':
        return 'Find Deals';
      default:
        return 'Learn More';
    }
  };

  return (
    <Card sx={{ 
      height: '200px',
      borderRadius: 0,
      backgroundColor: '#f8f9fa',
      border: '1px solid #e0e0e0',
      position: 'relative',
      '&:hover': { 
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 600, 
            color: '#333', 
            flex: 1, 
            fontSize: '0.9rem' 
          }}>
            {box.title}
          </Typography>
          <InfoIcon sx={{ color: '#666', fontSize: '1rem' }} />
        </Box>
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: getTypeColor(box.type), 
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.8rem' }
          }}
        >
          {box.price || box.month}
        </Typography>
        
        {box.airline && (
          <Typography variant="body2" sx={{ 
            color: '#666', 
            mb: 1, 
            fontWeight: 500, 
            fontSize: '0.8rem' 
          }}>
            {box.airline}
          </Typography>
        )}
        
        <Typography variant="body2" sx={{ 
          color: '#666', 
          mb: 'auto', 
          lineHeight: 1.4, 
          fontSize: '0.75rem' 
        }}>
          {box.description}
        </Typography>
        
        <Button
          variant="contained"
          fullWidth
          size="small"
          onClick={() => onAction?.(box.id || 0)}
          sx={{ 
            mt: 1,
            backgroundColor: box.buttonColor || getTypeColor(box.type),
            color: 'white',
            fontWeight: 600,
            borderRadius: 0,
            py: 0.5,
            '&:hover': { 
              backgroundColor: box.buttonColor || getTypeColor(box.type),
              opacity: 0.9
            }
          }}
        >
          {box.buttonText || getActionText(box.type)}
        </Button>
      </CardContent>
    </Card>
  );
}
