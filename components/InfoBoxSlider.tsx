'use client';

import { useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoBox from './InfoBox';

interface InfoBoxData {
  id?: number;
  title: string;
  price?: string;
  month?: string;
  airline?: string;
  description: string;
  type: 'round-trip' | 'one-way' | 'popular' | 'cheapest';
  buttonText?: string;
  buttonColor?: string;
}

interface InfoBoxSliderProps {
  infoBoxes: InfoBoxData[];
  title?: string;
  onAction?: (boxId: number) => void;
}

export default function InfoBoxSlider({ infoBoxes, title, onAction }: InfoBoxSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % infoBoxes.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + infoBoxes.length) % infoBoxes.length);
  };

  return (
    <Box>
      {title && (
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'left', 
            mb: 4, 
            color: '#333',
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.5rem' }
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ position: 'relative', maxWidth: '1200px', mx: 'auto' }}>
        <Grid container spacing={2}>
          {infoBoxes.map((box, index) => (
            <Grid item xs={12} sm={6} md={3} key={box.id}>
              <InfoBox box={box} onAction={onAction} />
            </Grid>
          ))}
        </Grid>
        
        {/* Slider Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
          <IconButton 
            onClick={handlePrevSlide}
            sx={{ 
              backgroundColor: '#f0f0f0',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton 
            onClick={handleNextSlide}
            sx={{ 
              backgroundColor: '#f0f0f0',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
