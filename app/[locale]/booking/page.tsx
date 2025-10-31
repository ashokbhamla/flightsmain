'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Grid,
  Button,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

interface Segment {
  from: string; to: string; fromCity?: string; toCity?: string; dep?: string; arr?: string; airlineCode?: string; flightNo?: number; returnIdx?: number;
}
interface FlightPayload {
  from: string; to: string; price?: string; airline?: string; airlineCode?: string;
  departTime?: string; arriveTime?: string; duration?: string; stops?: number; totalLayover?: string;
  fromCity?: string; toCity?: string; deepLink?: string; segments?: Segment[];
}
interface ContextPayload { from?: string; to?: string; date?: string; returnDate?: string; adults?: number; children?: number; infants?: number; curr?: string; cabin?: string; }

export default function BookingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [payment, setPayment] = useState<'pay_now' | 'pay_later'>('pay_now');
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const decoded = useMemo(() => {
    const f = params.get('f');
    if (!f) return null;
    try {
      const json = JSON.parse(decodeURIComponent(escape(typeof window !== 'undefined' ? atob(f) : Buffer.from(f, 'base64').toString('binary'))));
      return json as { flight: FlightPayload; context?: ContextPayload };
    } catch {}
    return null;
  }, [params]);

  const flight = decoded?.flight;
  const ctx = decoded?.context;

  const handleSubmit = async () => {
    if (!flight) return;
    setSubmitting(true);
    try {
      // 1) Send lead to CRM via secure API
      try {
        const classMap: any = { M: 'Economy', W: 'Premium Economy', C: 'Business', F: 'First' };
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: `${contact.firstName || 'Customer'} ${contact.lastName || ''}`.trim(),
            customerEmail: contact.email || 'unknown@example.com',
            customerPhone: contact.phone || '',
            flightDetails: {
              from: flight.from,
              to: flight.to,
              departureDate: ctx?.date,
              returnDate: ctx?.returnDate,
              travelers: travelers.length || 1,
              fromCity: flight.fromCity,
              toCity: flight.toCity,
              price: parseFloat((flight.price || '').replace(/[^0-9.]/g, '')) || undefined,
              class: classMap[(ctx?.cabin || 'M').toUpperCase()] || 'Economy',
            },
          })
        });
      } catch (e) {
        console.warn('CRM submit failed (non-blocking):', e);
      }

      // 2) Create local booking reference (stub) and navigate to ticket
      const res = await fetch('/api/bookings/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flight, context: ctx, contact }),
      });
      const data = await res.json();
      if (res.ok) {
        setReference(data.reference);
        const enc = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(JSON.stringify({ flight, context: ctx })))) : '';
        const loc = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'en') : 'en';
        const ticketUrl = `/${loc}/ticket?ref=${encodeURIComponent(data.reference)}&f=${encodeURIComponent(enc)}`;
        if (payment === 'pay_now' && flight.deepLink) window.open(flight.deepLink, '_blank');
        // Navigate to ticket page
        router.push(ticketUrl);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!flight) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Invalid or missing flight payload.</Typography>
      </Box>
    );
  }

  const outbound = (flight.segments || []).filter(s => (s.returnIdx ?? 0) === 0);
  const inbound = (flight.segments || []).filter(s => (s.returnIdx ?? 0) === 1);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Your flight to {flight.toCity || flight.to}
      </Typography>
      {/* Itinerary & Fare Summary */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Flight to {flight.toCity || flight.to}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>{(flight.stops ?? 0) === 0 ? 'Direct' : `${flight.stops} stop${(flight.stops??0)>1?'s':''}`} · {flight.duration}</Typography>
        {outbound.map((s, i) => (
          <Box key={`o-${i}`} sx={{ mb: 1.5 }}>
            <Typography variant="body2">{s.dep ? new Date(s.dep).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{new Date(s.dep||'').toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} {s.from} <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>{s.fromCity || ''}</Typography></Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{s.arr ? new Date(s.arr).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.arr ? new Date(s.arr).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''} {s.to} <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>{s.toCity || ''}</Typography></Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.airlineCode || ''} {s.flightNo || ''}</Typography>
            {i < outbound.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}

        {inbound.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Return flight</Typography>
            {inbound.map((s, i) => (
              <Box key={`r-${i}`} sx={{ mb: 1.5 }}>
                <Typography variant="body2">{s.dep ? new Date(s.dep).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{new Date(s.dep||'').toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} {s.from} <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>{s.fromCity || ''}</Typography></Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{s.arr ? new Date(s.arr).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.arr ? new Date(s.arr).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''} {s.to} <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>{s.toCity || ''}</Typography></Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.airlineCode || ''} {s.flightNo || ''}</Typography>
                {i < inbound.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </>
        )}
      </Paper>
      {/* Traveler details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Traveler details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="First name" fullWidth value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last name" fullWidth value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" type="email" fullWidth value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" fullWidth value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Payment</Typography>
        <RadioGroup row value={payment} onChange={(e) => setPayment(e.target.value as any)}>
          <FormControlLabel value="pay_now" control={<Radio />} label="Pay now" />
          <FormControlLabel value="pay_later" control={<Radio />} label="Pay later" />
        </RadioGroup>
        {/* Card details */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}><TextField label="Card number" fullWidth placeholder="4111 1111 1111 1111" /></Grid>
          <Grid item xs={6} sm={3}><TextField label="Expiry (MM/YY)" fullWidth placeholder="12/29" /></Grid>
          <Grid item xs={6} sm={3}><TextField label="CVV" fullWidth placeholder="123" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Card holder name" fullWidth /></Grid>
        </Grid>
      </Paper>
        </Grid>

        {/* Fare summary side card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: 'sticky', top: 16 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Total Price (USD)</Typography>
            {(() => {
              const total = parseFloat((flight.price||'').replace(/[^0-9.]/g,'')) || 0;
              const base = Math.round(total * 0.8);
              const taxes = total - base;
              return (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>${total.toLocaleString('en-US')}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Base Fare</Typography>
                    <Typography>${base.toLocaleString('en-US')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Taxes</Typography>
                    <Typography>${taxes.toLocaleString('en-US')}</Typography>
                  </Box>
                </>
              );
            })()}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Apply coupon or gift card</Typography>
            <TextField fullWidth size="small" placeholder="Coupon/Gift card" />
            <Button variant="text" sx={{ mt: 1 }}>Apply</Button>
            <Divider sx={{ my: 2 }} />
            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={submitting}>
              {reference ? 'Proceed to Ticket' : 'Pay now'}
            </Button>
            {reference && (
              <Chip sx={{ mt: 1 }} color="success" label={`Reference: ${reference}`} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}


