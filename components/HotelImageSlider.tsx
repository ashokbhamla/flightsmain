'use client';

import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';

export default function HotelImageSlider({ images, alt, height = 220 }: { images: string[]; alt: string; height?: number }) {
  const valid = Array.isArray(images) ? images.filter(Boolean) : [];
  const [idx, setIdx] = useState(0);
  if (!valid.length) return null;

  const next = () => setIdx((p) => (p + 1) % valid.length);
  const prev = () => setIdx((p) => (p - 1 + valid.length) % valid.length);

  return (
    <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={valid[idx]} alt={alt} style={{ width: '100%', height, objectFit: 'cover', display: 'block' }} />
      {valid.length > 1 && (
        <>
          <IconButton size="small" onClick={prev} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={next} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}>
            <ChevronRightIcon />
          </IconButton>
          <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {valid.map((_, i) => (
              <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === idx ? '#fff' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}


