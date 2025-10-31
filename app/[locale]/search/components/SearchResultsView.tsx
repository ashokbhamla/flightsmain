'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Divider,
  Slider,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

export interface SearchFlightItem {
  from: string;
  to: string;
  price?: string;
  airline?: string;
  airlineCode?: string;
  departureDate?: string;
  returnDate?: string;
  duration?: string;
  stops?: number;
  source?: string;
  deepLink?: string;
  fromCity?: string;
  toCity?: string;
  // Extended fields used in UI
  departTime?: string;
  arriveTime?: string;
  totalLayover?: string;
  cabinBagKg?: number;
  holdBagKg?: number;
  segments?: Array<{
    from: string;
    to: string;
    fromCity?: string;
    toCity?: string;
    dep?: string;
    arr?: string;
    airlineCode?: string;
    flightNo?: number;
    returnIdx?: number;
  }>;
}

interface Props {
  flights: SearchFlightItem[];
  onBook?: (flight: SearchFlightItem) => void;
  context?: {
    from?: string; to?: string; date?: string; returnDate?: string; adults?: number; children?: number; infants?: number; curr?: string; cabin?: string;
  };
  locale?: string;
}

function parsePrice(p?: string): number {
  if (!p) return 0;
  return parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
}

function parseDurationToMinutes(d?: string): number {
  if (!d) return 0;
  const match = d.match(/(\d+)h\s*(\d+)?m?/);
  if (match) {
    const h = parseInt(match[1] || '0');
    const m = parseInt(match[2] || '0');
    return h * 60 + m;
  }
  return 0;
}

import { getAirlineLogoUrl } from '@/lib/cdn';

// Use provided logo route (prefer https): https://img.wway.io/pics/root/iata@png?exar=1&rs=fit:width:height
const airlineLogoUrl = (iata?: string, width = 40, height = 40) => {
  if (!iata) return '';
  return `https://img.wway.io/pics/root/${iata.toUpperCase()}@png?exar=1&rs=fit:${width}:${height}`;
};

export default function SearchResultsView({ flights, onBook, context, locale }: Props) {
  const [stopsFilter, setStopsFilter] = useState<'any' | 'direct' | 'one'>('any');
  const [airlines, setAirlines] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [durationMax, setDurationMax] = useState<number | undefined>(undefined);
  const [tab, setTab] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [selected, setSelected] = useState<SearchFlightItem | null>(null);

  const allAirlines = useMemo(() => {
    return Array.from(new Set(flights.map(f => f.airline).filter(Boolean) as string[])).sort();
  }, [flights]);

  const stats = useMemo(() => {
    const prices = flights.map(f => parsePrice(f.price)).filter(n => n > 0);
    const durations = flights.map(f => parseDurationToMinutes(f.duration)).filter(n => n > 0);
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      minDuration: durations.length ? Math.min(...durations) : 0,
      maxDuration: durations.length ? Math.max(...durations) : 0,
      directCount: flights.filter(f => (f.stops ?? 0) === 0).length,
    };
  }, [flights]);

  const filtered = useMemo(() => {
    let list = [...flights];
    if (stopsFilter === 'direct') list = list.filter(f => (f.stops ?? 0) === 0);
    if (stopsFilter === 'one') list = list.filter(f => (f.stops ?? 0) <= 1);
    if (airlines.length) list = list.filter(f => f.airline && airlines.includes(f.airline));
    if (priceMax) list = list.filter(f => parsePrice(f.price) <= priceMax!);
    if (durationMax) list = list.filter(f => parseDurationToMinutes(f.duration) <= durationMax!);

    if (tab === 'cheapest') {
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (tab === 'fastest') {
      list.sort((a, b) => parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration));
    } else {
      // best: simple combined score
      list.sort((a, b) => {
        const sa = parsePrice(a.price) + parseDurationToMinutes(a.duration) / 2;
        const sb = parsePrice(b.price) + parseDurationToMinutes(b.duration) / 2;
        return sa - sb;
      });
    }
    return list;
  }, [flights, stopsFilter, airlines, priceMax, durationMax, tab]);

  const summaryText = useMemo(() => {
    const start = stats.minPrice ? stats.minPrice.toLocaleString() : '—';
    return `You have ${stats.directCount} direct flights available starting from $${start}.`;
  }, [stats]);

  return (
    <Grid container spacing={3}>
      {/* Left filters */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Filters</Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Stops</Typography>
          <RadioGroup value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value as any)}>
            <FormControlLabel value="any" control={<Radio size="small" />} label="Any" />
            <FormControlLabel value="direct" control={<Radio size="small" />} label={`Direct only (${stats.directCount})`} />
            <FormControlLabel value="one" control={<Radio size="small" />} label="1 stop max" />
          </RadioGroup>

          {allAirlines.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Airlines</Typography>
              {allAirlines.map(a => (
                <FormControlLabel
                  key={a}
                  control={
                    <Checkbox
                      size="small"
                      checked={airlines.includes(a)}
                      onChange={(e) => {
                        setAirlines(prev => e.target.checked ? [...prev, a] : prev.filter(x => x !== a));
                      }}
                    />
                  }
                  label={a}
                />
              ))}
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Maximum travel time</Typography>
          <Slider
            size="small"
            min={stats.minDuration}
            max={stats.maxDuration || 600}
            value={durationMax ?? (stats.maxDuration || 600)}
            onChange={(_, v) => setDurationMax(v as number)}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${Math.floor((v as number)/60)}h ${(v as number)%60}m`}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Price (max)</Typography>
          <Slider
            size="small"
            min={stats.minPrice}
            max={stats.maxPrice || 2000}
            value={priceMax ?? (stats.maxPrice || 2000)}
            onChange={(_, v) => setPriceMax(v as number)}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v}`}
          />
        </Paper>
      </Grid>

      {/* Right content */}
      <Grid item xs={12} md={9}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>Search summary</Typography>
          <Typography variant="body1">{summaryText}</Typography>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="sort tabs">
            <Tab value="best" label="Best" />
            <Tab value="cheapest" label="Cheapest" />
            <Tab value="fastest" label="Fastest" />
          </Tabs>
        </Box>

        {filtered.map((f, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {f.airlineCode && (
                    <img
                      src={airlineLogoUrl(f.airlineCode, 40, 40)}
                      alt={f.airlineCode}
                      style={{ height: 20 }}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = '1';
                          img.src = getAirlineLogoUrl(f.airlineCode as string);
                        } else {
                          img.style.display = 'none';
                        }
                      }}
                    />
                  )}
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {f.from} ({f.fromCity || ''}) → {f.to} ({f.toCity || ''})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                  {f.departTime && f.arriveTime && (
                    <Chip size="small" color="primary" variant="outlined" label={`${f.departTime} → ${f.arriveTime}`} />
                  )}
                  {f.stops === 0 && <Chip size="small" color="success" label="Direct" />} 
                  {f.duration && <Chip size="small" variant="outlined" label={f.duration} />}
                  {f.airline && <Chip size="small" variant="outlined" label={f.airline} />}
                  {f.source && <Chip size="small" variant="outlined" label={f.source} />}
                  {typeof f.stops === 'number' && f.stops > 0 && (
                    <Chip size="small" variant="outlined" label={`${f.stops} stop${f.stops > 1 ? 's' : ''}`} />
                  )}
                  {f.totalLayover && (
                    <Chip size="small" variant="outlined" label={`Layover ${f.totalLayover}`} />
                  )}
                  {(typeof f.cabinBagKg === 'number' || typeof f.holdBagKg === 'number') && (
                    <Chip size="small" variant="outlined" label={`Bags: cabin ${f.cabinBagKg ?? 0}kg, checked ${f.holdBagKg ?? 0}kg`} />
                  )}
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  sx={{ fontSize: '1.4rem', fontWeight: 800, cursor: 'pointer', color: '#1e3a8a' }}
                  onClick={() => {
                    try {
                      const payload = { flight: f, context };
                      const enc = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(JSON.stringify(payload)))) : '';
                      const loc = locale || (typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'en') : 'en');
                      const url = `/${loc}/booking?f=${encodeURIComponent(enc)}`;
                      if (typeof window !== 'undefined') window.location.href = url;
                    } catch {}
                  }}
                >
                  {f.price?.replace('$', 'USD ')}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => setSelected(f)}
                >
                  View details
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}

        {/* Details Dialog */}
        <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
          <DialogTitle>
            {selected ? `Your flight to ${selected.toCity || selected.to}` : ''}
          </DialogTitle>
          <DialogContent dividers>
            {selected && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Flight to {selected.toCity || selected.to}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {(selected.stops ?? 0) === 0 ? 'Direct' : `${selected.stops} stop${(selected.stops ?? 0) > 1 ? 's' : ''}`} · {selected.duration}
                </Typography>
                {(selected.segments || []).filter(s => (s.returnIdx ?? 0) === 0).map((s, i, arr) => (
                  <Box key={`out-${i}`} sx={{ mb: 1.5 }}>
                    <Typography variant="body2">{s.dep ? new Date(s.dep).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{s.from} · {s.fromCity || ''}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{s.arr ? new Date(s.arr).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{s.to} · {s.toCity || ''}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.airlineCode || ''} {s.flightNo || ''}</Typography>
                    {i < arr.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}

                {(selected.segments || []).some(s => (s.returnIdx ?? 0) === 1) && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Return flight</Typography>
                    {(selected.segments || []).filter(s => (s.returnIdx ?? 0) === 1).map((s, i, arr) => (
                      <Box key={`ret-${i}`} sx={{ mb: 1.5 }}>
                        <Typography variant="body2">{s.dep ? new Date(s.dep).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{s.from} · {s.fromCity || ''}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>{s.arr ? new Date(s.arr).toLocaleString([], { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{s.to} · {s.toCity || ''}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.airlineCode || ''} {s.flightNo || ''}</Typography>
                        {i < arr.length - 1 && <Divider sx={{ my: 1 }} />}
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box sx={{ flexGrow: 1, pl: 2 }}>
              <Typography sx={{ fontWeight: 800 }}>{selected?.price?.replace('$', 'USD ')}</Typography>
            </Box>
            <Button onClick={() => setSelected(null)}>Close</Button>
            {selected?.deepLink && (
              <Button variant="contained" onClick={() => window.open(selected.deepLink as string, '_blank')}>Continue</Button>
            )}
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}


