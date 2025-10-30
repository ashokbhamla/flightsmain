'use client';

import { useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Paper, Typography, Divider } from '@mui/material';

export default function TicketPage() {
  const params = useSearchParams();
  const refEl = useRef<HTMLDivElement>(null);

  const decoded = useMemo(() => {
    const f = params.get('f');
    if (!f) return null;
    try {
      const json = JSON.parse(decodeURIComponent(escape(typeof window !== 'undefined' ? atob(f) : Buffer.from(f, 'base64').toString('binary'))));
      return json as any;
    } catch {}
    return null;
  }, [params]);

  const reference = params.get('ref') || 'REF-XXXXXX';
  const flight = decoded?.flight;
  const ctx = decoded?.context;

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!flight) {
    return <Box sx={{ p: 4 }}>Invalid ticket payload</Box>;
  }

  const segments = flight.segments || [];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>E‑Ticket</Typography>
        <Button variant="contained" onClick={handleDownload}>Download / Print</Button>
      </Box>
      <Paper ref={refEl} sx={{ p: 2 }}>
        <Typography variant="h6">Booking reference: {reference}</Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2 }}>
          {flight.from} → {flight.to} · {ctx?.date}{ctx?.returnDate ? ` / ${ctx.returnDate}` : ''}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {segments.map((s: any, i: number) => (
          <Box key={i} sx={{ mb: 1.5 }}>
            <Typography variant="body2">{s.dep ? new Date(s.dep).toLocaleString() : ''}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{s.from} → {s.to}</Typography>
            <Typography variant="caption">{s.airlineCode || ''} {s.flightNo || ''}</Typography>
            {i < segments.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography>Total paid: {flight.price?.replace('$', 'USD ')}</Typography>
      </Paper>
    </Box>
  );
}


