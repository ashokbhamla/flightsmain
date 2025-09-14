import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
  size?: number
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 40,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const containerSx = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  }

  return (
    <Box sx={containerSx as any}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={size} />
        {message && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2, 
              color: 'text.secondary',
              fontWeight: 500 
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
