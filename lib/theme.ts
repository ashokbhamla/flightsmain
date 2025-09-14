import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e3a8a' },
    secondary: { main: '#10b981' },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666'
    },
    success: { main: '#10b981' },
    info: { main: '#10b981' }
  },
  shape: { 
    borderRadius: 12 
  },
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6
    }
  },
  components: {
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'none',
          '@media (max-width: 600px)': {
            borderRadius: '12px'
          },
          '&:hover': {
            boxShadow: 'none',
            transform: 'none'
          },
          '&:focus': {
            boxShadow: 'none'
          },
          '&:active': {
            boxShadow: 'none',
            transform: 'none'
          }
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: '100%',
          '@media (max-width: 600px)': {
            paddingLeft: '0px',
            paddingRight: '0px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '@media (max-width: 600px)': {
            borderRadius: '12px'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '@media (max-width: 600px)': {
            borderRadius: '12px'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '@media (max-width: 600px)': {
              borderRadius: '12px'
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '@media (max-width: 600px)': {
            borderRadius: '12px'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '@media (max-width: 600px)': {
            borderRadius: '12px'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: '100%'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 'auto !important',
          '@media (min-width: 600px)': {
            minHeight: '55px !important'
          },
          '@media (orientation: landscape)': {
            minHeight: '55px !important'
          }
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});

export default theme;
