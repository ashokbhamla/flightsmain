'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Paper, Typography, Grid, TextField, Button, Alert } from '@mui/material';
import { useState } from 'react';

export default function HotelQuotePage() {
  const params = useSearchParams();
  const router = useRouter();
  const hotelId = params.get('hid') || '';
  const name = params.get('name') || '';
  const price = params.get('price') || '';
  const currency = params.get('currency') || 'USD';
  const checkIn = params.get('checkIn') || '';
  const checkOut = params.get('checkOut') || '';
  const img = params.get('img') || '';
  const iata = params.get('iata') || '';

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setSubmitting(true);
    setErr(null);
    setOk(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          hotelDetails: {
            hotelId: Number(hotelId) || undefined,
            name,
            currency,
            price: price ? Number(price) : undefined,
            checkIn,
            checkOut,
            airport: iata,
            imageURL: img,
          },
          meta: { source: 'website', path: '/hotel-quote' },
        }),
      });
      const data = await res.json();
      if (res.ok) setOk('Quote submitted! Our team will contact you shortly.');
      else setErr(data?.error || 'Failed to submit');
    } catch (e) {
      setErr('Unexpected error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <Container sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Hotel Details</Typography>
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={name} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
              )}
              <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
              <Typography color="text.secondary">Airport: {iata} • Check-in {checkIn} • Check-out {checkOut}</Typography>
              {price && (
                <Typography sx={{ mt: 1, fontWeight: 900, color: 'success.main' }}>
                  {currency} {Number(price).toFixed(2)} / night
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Your Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField label="First name" fullWidth value={form.firstName} onChange={(e)=>setForm({ ...form, firstName: e.target.value })} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Last name" fullWidth value={form.lastName} onChange={(e)=>setForm({ ...form, lastName: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField label="Email" type="email" fullWidth value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField label="Phone" fullWidth value={form.phone} onChange={(e)=>setForm({ ...form, phone: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField label="Notes (optional)" fullWidth multiline minRows={3} value={form.notes} onChange={(e)=>setForm({ ...form, notes: e.target.value })} /></Grid>
              </Grid>
              <Button variant="contained" sx={{ mt: 2, fontWeight: 800 }} onClick={onSubmit} disabled={submitting}>Submit Quote</Button>
              {ok && <Alert sx={{ mt: 2 }} severity="success">{ok}</Alert>}
              {err && <Alert sx={{ mt: 2 }} severity="error">{err}</Alert>}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


