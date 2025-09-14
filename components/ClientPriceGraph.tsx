'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

export default function ClientPriceGraph({ 
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

  // Sort data by value to determine colors
  const sortedData = [...data].sort((a, b) => a.value - b.value);
  
  const processedData = data.map((item, index) => {
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
      ...item,
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
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#666666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#666666', fontSize: 12 }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [showPrices ? `$${value}` : value, yAxisLabel]}
              />
              <Bar 
                dataKey="value" 
                fill="#1e3a8a"
                radius={[0, 0, 4, 4]}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
