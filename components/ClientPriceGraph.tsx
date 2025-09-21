'use client';

import { useState, useEffect, memo } from 'react';
import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';

// Lazy load Recharts to reduce initial bundle size
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });

interface ClientPriceGraphProps {
  title: string;
  description: string;
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  yAxisLabel?: string;
  showPrices?: boolean;
  height?: number;
}

const ClientPriceGraph = memo(function ClientPriceGraph({ 
  title, 
  description, 
  data, 
  yAxisLabel = "Value",
  showPrices = true,
  height = 300 
}: ClientPriceGraphProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card sx={{ 
        borderRadius: 0, 
        border: '1px solid #e0e0e0',
        height: height,
      }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#1a1a1a', 
            mb: 1,
            fontSize: '1.1rem'
          }}>
            {title}
          </Typography>
          
          <Typography variant="body2" sx={{ 
            color: '#666666', 
            mb: 3, 
            fontSize: '0.9rem',
            lineHeight: 1.4
          }}
          dangerouslySetInnerHTML={{ __html: description }}
          />

          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Skeleton variant="rectangular" height="100%" width="100%" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Ensure data is properly formatted
  const validData = data.filter(item => item && typeof item === 'object' && item.name && typeof item.value === 'number');
  
  // Sort data by value to determine colors
  const sortedData = [...validData].sort((a, b) => a.value - b.value);
  
  const processedData = validData.map((item, index) => {
    const sortedIndex = sortedData.findIndex(d => d.name === item.name);
    let color = item.color;
    
    if (!color) {
      if (sortedIndex === 0) {
        color = '#10b981'; // Secondary color for lowest
      } else if (sortedIndex === 1) {
        color = '#1e3a8a'; // Primary color for 2nd lowest
      } else {
        color = '#e5e7eb'; // Gray for others
      }
    }
    
    return {
      name: String(item.name || 'Unknown'),
      value: Number(item.value) || 0,
      color,
      price: showPrices ? `$${item.value}` : item.value
    };
  });

  return (
    <Card sx={{ 
      borderRadius: 0, 
      border: '1px solid #e0e0e0',
      height: height,
      '&:hover': { 
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          color: '#1a1a1a', 
          mb: 1,
          fontSize: '1.1rem'
        }}>
          {title}
        </Typography>
        
        <Typography variant="body2" sx={{ 
          color: '#666666', 
          mb: 3, 
          fontSize: '0.9rem',
          lineHeight: 1.4
        }}
        dangerouslySetInnerHTML={{ __html: description }}
        />

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="1 1" stroke="#f5f5f5" />
              <XAxis 
                dataKey="name" 
                stroke="#999"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#999"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(value) => showPrices ? `$${value}` : value.toString()}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  padding: '8px'
                }}
                formatter={(value: any) => [showPrices ? `$${value}` : value, yAxisLabel]}
              />
              <Bar 
                dataKey="value" 
                fill="#1e3a8a"
                radius={[2, 2, 0, 0]}
              >
                {processedData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

export default ClientPriceGraph;
