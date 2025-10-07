'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

interface BookNowOverlayProps {
  onBookNow: () => void;
}

export default function BookNowOverlay({ onBookNow }: BookNowOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        variant="contained"
        size="large"
        onClick={onBookNow}
        startIcon={<FlightTakeoffIcon />}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          fontSize: '1.1rem',
          padding: '14px 32px',
          borderRadius: '50px',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            },
            '50%': {
              boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
            },
          },
        }}
      >
        📞 Book Now - Call Us
      </Button>
      
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full text-xs flex items-center justify-center"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

