'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface BookingPopupProps {
  open: boolean;
  onClose: () => void;
  flightData: {
    from: string;
    to: string;
    fromCity?: string;
    toCity?: string;
    departureDate?: string;
    returnDate?: string;
    price?: string;
    travelers?: number;
    class?: string;
    tripType?: string;
  } | null;
  phoneNumber?: string;
}

export default function BookingPopup({ open, onClose, flightData, phoneNumber = '+1 (855) 921-4888' }: BookingPopupProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Reset form when popup closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setErrors({});
        setIsSubmitting(false);
        setSubmitSuccess(false);
      }, 300);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    
    if (!customerName.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(customerPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!customerEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data for backend API
      const bookingData = {
        customerName,
        customerPhone,
        customerEmail,
        flightDetails: {
          from: flightData?.from,
          to: flightData?.to,
          fromCity: flightData?.fromCity,
          toCity: flightData?.toCity,
          departureDate: flightData?.departureDate,
          returnDate: flightData?.returnDate,
          price: flightData?.price,
          travelers: flightData?.travelers,
          class: flightData?.class,
          tripType: flightData?.tripType,
        },
        timestamp: new Date().toISOString(),
      };

      console.log('📋 Booking data being sent:', JSON.stringify(bookingData, null, 2));

      // Send to secure backend API (server-side will forward to CRM securely)
      console.log('📤 Sending to /api/bookings...');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to submit booking: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Booking submitted successfully:', JSON.stringify(result, null, 2));

      setSubmitSuccess(true);
      
      // Close popup after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Error submitting booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to submit booking: ${errorMessage}\n\nPlease try again or call us directly at ${phoneNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNow = () => {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
  };

  if (!flightData) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        pb: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            Complete Your Booking
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Fill in your details and we&apos;ll contact you shortly
            </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {submitSuccess ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ 
              fontSize: 64, 
              mb: 2,
              animation: 'scaleIn 0.5s ease-out',
              '@keyframes scaleIn': {
                from: { transform: 'scale(0)' },
                to: { transform: 'scale(1)' },
              },
            }}>
              ✅
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Booking Request Sent!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our team will contact you shortly to confirm your booking.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Flight Information */}
            <Box sx={{ 
              backgroundColor: '#f8f9fa', 
              borderRadius: 2, 
              p: 2.5, 
              mb: 3,
              border: '1px solid #e9ecef',
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
                Flight Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlightTakeoffIcon sx={{ color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        From
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {flightData.fromCity || flightData.from}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {flightData.from}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlightLandIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        To
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {flightData.toCity || flightData.to}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {flightData.to}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {flightData.departureDate && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ color: '#667eea', fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Departure
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {flightData.departureDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {flightData.returnDate && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ color: '#764ba2', fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Return
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {flightData.returnDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {flightData.price && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      backgroundColor: 'white',
                      p: 1.5,
                      borderRadius: 1,
                      mt: 1,
                    }}>
                      <AttachMoneyIcon sx={{ color: '#28a745', fontSize: 20 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Estimated Price
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#28a745' }}>
                          ${flightData.price}
                        </Typography>
                      </Box>
                      {flightData.travelers && (
                        <Typography variant="caption" color="text.secondary">
                          {flightData.travelers} {flightData.travelers === 1 ? 'Traveler' : 'Travelers'} • {flightData.class || 'Economy'}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Customer Information Form */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
                Your Contact Information
              </Typography>
              
              <TextField
                fullWidth
                label="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="John Doe"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="john.doe@example.com"
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Call to Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleCallNow}
                startIcon={<PhoneIcon />}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  },
                }}
              >
                Call Now
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                  },
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Request Callback'}
              </Button>
            </Box>

            {/* Contact Number */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Or call us directly at{' '}
                <Typography
                  component="a"
                  href={`tel:${phoneNumber.replace(/\D/g, '')}`}
                  variant="caption"
                  sx={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {phoneNumber}
                </Typography>
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

