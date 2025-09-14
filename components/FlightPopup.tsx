'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Link,
  Fade,
  Slide,
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Flight as FlightIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { envConfig } from '@/lib/envConfig';

interface FlightPopupProps {
  open: boolean;
  onClose: () => void;
  flightData?: {
    from: string;
    to: string;
    fromCity: string;
    toCity: string;
    departureDate: string;
    returnDate?: string;
    price: string;
    originalPrice?: string;
    travelers: number;
    class: string;
    tripType: string;
  };
}

export default function FlightPopup({
  open,
  onClose,
  flightData,
}: FlightPopupProps) {
  const phoneNumber = envConfig.popup.phoneNumber;
  const promoCode = envConfig.popup.promoCode;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open]);

  if (!flightData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={false}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: { xs: 'none', sm: '0 20px 60px rgba(0,0,0,0.3)' },
          overflow: 'auto',
          position: 'relative',
          maxWidth: { xs: '100vw', sm: '500px' },
          maxHeight: { xs: '100vh', sm: '700px' },
          width: { xs: '100%', sm: 'auto' },
          height: { xs: '100%', sm: 'auto' },
          margin: { xs: 0, sm: 'auto' },
          display: 'flex',
          flexDirection: 'column',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
        }
      }}
    >
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header Banner */}
        <Box
          sx={{
            background: '#1e3a8a', // Dark blue only
            border: 'none',
            p: { xs: 1.5, sm: 2 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(96, 165, 250, 0.1)',
              zIndex: 1,
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, position: 'relative', zIndex: 2 }}>
            <Avatar
              sx={{
                width: { xs: 40, sm: 50 },
                height: { xs: 40, sm: 50 },
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
            </Avatar>
            <Box sx={{ 
              flex: 1, 
              minWidth: 0, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 2,
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: '600',
                  color: '#fff', // White text for maximum visibility
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  mb: { xs: 0.5, sm: 0.5 },
                  lineHeight: 1.2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'none',
                  textAlign: 'center',
                }}
              >
                Get A Free Quote
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  lineHeight: 1.3,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                }}
              >
                We provide 30% off on phone over booking
              </Typography>
            </Box>
          </Box>
          
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              zIndex: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: 'rgba(96, 165, 250, 0.3)' }} />

        {/* Main Content */}
        <Box sx={{ 
          p: 3, 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', // Light blue to green gradient
        }}>
          <Fade in={showContent} timeout={500}>
            <Box>

              {/* Flight Details */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                  flexWrap: 'wrap',
                  gap: 1.5,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 20px rgba(96, 165, 250, 0.2)',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                }}
              >
                {/* From */}
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
                    {flightData.departureDate}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {flightData.from}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {flightData.fromCity}
                  </Typography>
                </Box>

                {/* Flight Path */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, px: 2 }}>
                  <Box sx={{ 
                    flex: 1, 
                    height: 3, 
                    background: 'linear-gradient(90deg, #10b981 0%, #60a5fa 100%)',
                    borderRadius: 2,
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        right: -10,
                        top: -7,
                        background: 'linear-gradient(135deg, #10b981 0%, #60a5fa 100%)',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      }}
                    >
                      <FlightIcon sx={{ fontSize: 12, color: 'white' }} />
                    </Box>
                  </Box>
                </Box>

                {/* To */}
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
                    {flightData.returnDate || flightData.departureDate}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {flightData.to}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {flightData.toCity}
                  </Typography>
                </Box>
              </Box>

              {/* Trip Details */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  label={flightData.class}
                  sx={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #60a5fa 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  }}
                />
                <Chip
                  label={flightData.tripType}
                  sx={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #60a5fa 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  p: 1,
                  borderRadius: 2,
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}>
                  <PersonIcon sx={{ fontSize: 16, color: '#667eea' }} />
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                    {flightData.travelers}
                  </Typography>
                </Box>
              </Box>

              {/* Pricing */}
              <Box sx={{ 
                textAlign: 'center', 
                mb: 2,
                p: 3,
                borderRadius: 3,
                background: '#10b981', // Green background for fare section
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  zIndex: 1,
                }
              }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                    {flightData.originalPrice && flightData.originalPrice !== flightData.price && (
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          textDecoration: 'line-through',
                          fontSize: '1.2rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        ${flightData.originalPrice}
                      </Typography>
                    )}
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      ${flightData.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', ml: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      Total, per person
                    </Typography>
                  </Box>

                </Box>
              </Box>

              {/* Call to Action Button */}
              <Slide direction="up" in={showContent} timeout={800}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component="a"
                    href={`tel:${phoneNumber}`}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      bgcolor: '#f44336',
                      color: 'white',
                      py: 1.5,
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(244, 67, 54, 0.4)',
                      textDecoration: 'none',
                      '&:hover': {
                        bgcolor: '#d32f2f',
                        boxShadow: '0 6px 25px rgba(244, 67, 54, 0.6)',
                        transform: 'translateY(-2px)',
                        textDecoration: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={<PhoneIcon />}
                  >
                    {phoneNumber}
                  </Button>
                  
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: '#999',
                      mt: 1.5,
                      lineHeight: 1.3,
                      maxWidth: 400,
                      mx: 'auto',
                      fontSize: '0.75rem',
                    }}
                  >
                    By providing my contact details and clicking on the phone number I agree to be contacted for travel information via phone, text messages and email. No purchase necessary. We respect your{' '}
                    <Link href="/privacy-policy" sx={{ color: '#1976d2', textDecoration: 'underline' }}>
                      privacy
                    </Link>
                    .
                  </Typography>
                </Box>
              </Slide>
            </Box>
          </Fade>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
