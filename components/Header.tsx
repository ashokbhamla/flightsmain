'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { pathWithLocale } from '@/lib/routes';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Header({ locale }: { locale: Locale }) {
  const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState<null | HTMLElement>(null);
  const t = getTranslations(locale);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (newLocale: Locale) => {
    // Update URL to new locale
    const currentPath = window.location.pathname;
    
    // Remove any existing locale prefix (en, es, ru, fr)
    let pathWithoutLocale = currentPath;
    for (const locale of ['en', 'es', 'ru', 'fr']) {
      if (pathWithoutLocale.startsWith(`/${locale}/`)) {
        pathWithoutLocale = pathWithoutLocale.substring(3); // Remove /xx/
        break;
      } else if (pathWithoutLocale === `/${locale}`) {
        pathWithoutLocale = '/';
        break;
      }
    }
    
    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = `/${pathWithoutLocale}`;
    }
    
    // For English, don't add locale prefix
    if (newLocale === 'en') {
      window.location.href = pathWithoutLocale;
    } else {
      // For other locales, add the locale prefix
      window.location.href = `/${newLocale}${pathWithoutLocale}`;
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', country: 'US' },
    { code: 'es', name: 'Español', flag: '🇪🇸', country: 'ES' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', country: 'RU' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', country: 'FR' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '100%',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: { xs: 1.5, sm: 3, md: 6 },
        py: { xs: 1, md: 0 },
        minHeight: { xs: '64px', md: '56px' }
      }}>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 0,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            mr: 3,
            letterSpacing: '0.5px',
            position: 'relative'
          }}
        >
          <Link href={pathWithLocale(locale, '/')} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                color: '#1e3a8a',
                fontWeight: 700
              }}>
                flight
              </Box>
              <SearchIcon sx={{
                color: '#10b981',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                ml: 0.5,
                fontWeight: 700
              }} />
            </Box>
          </Link>
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            LinkComponent={Link}
            href={pathWithLocale(locale, '/airlines')}
            startIcon={<FlightTakeoffIcon />}
            sx={{
              color: '#1e3a8a',
              px: { xs: 2, md: 1.5 },
              py: { xs: 1.5, md: 0.5 },
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '16px', md: '0.85rem' },
              minHeight: { xs: '48px', md: 'auto' },
              backgroundColor: 'transparent',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                boxShadow: 'none',
                transform: 'none'
              },
              '&:active': {
                backgroundColor: 'rgba(30, 58, 138, 0.2)',
                transform: 'scale(0.98)'
              },
              '&:focus': {
                boxShadow: 'none'
              }
            }}
          >
            {t.header.airlines}
          </Button>
          <Button
            LinkComponent={Link}
            href={pathWithLocale(locale, '/hotels')}
            startIcon={<HotelIcon />}
            sx={{
              color: '#1e3a8a',
              px: { xs: 2, md: 1.5 },
              py: { xs: 1.5, md: 0.5 },
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '16px', md: '0.85rem' },
              minHeight: { xs: '48px', md: 'auto' },
              backgroundColor: 'transparent',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                boxShadow: 'none',
                transform: 'none'
              },
              '&:active': {
                backgroundColor: 'rgba(30, 58, 138, 0.2)',
                transform: 'scale(0.98)'
              },
              '&:focus': {
                boxShadow: 'none'
              }
            }}
          >
            {t.header.hotels}
          </Button>
        </Box>

        {/* Right Side Elements */}
        <Box sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          ml: 'auto'
        }}>
          {/* Language Selector */}
          <Box 
            onClick={handleLanguageMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#60a5fa',
              px: { xs: 2, md: 1.5 },
              py: { xs: 1, md: 0.5 },
              minHeight: { xs: '48px', md: 'auto' },
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#3b82f6'
              },
              '&:active': {
                backgroundColor: '#2563eb',
                transform: 'scale(0.98)'
              }
            }}
          >
            <Box sx={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '6px',
              fontSize: '12px'
            }}>
              {currentLanguage.flag}
            </Box>
            <Typography sx={{
              color: '#ffffff',
              fontSize: { xs: '16px', md: '0.85rem' },
              fontWeight: 500,
              marginRight: '4px'
            }}>
              {currentLanguage.name}
            </Typography>
            <ExpandMoreIcon sx={{
              color: '#ffffff',
              fontSize: { xs: '20px', md: '1rem' }
            }} />
          </Box>

          <Button
            LinkComponent={Link}
            href={pathWithLocale(locale, '/login')}
            startIcon={<AccountCircleIcon />}
            sx={{
              color: '#1e3a8a',
              px: { xs: 2, md: 1.5 },
              py: { xs: 1.5, md: 0.5 },
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '16px', md: '0.85rem' },
              minHeight: { xs: '48px', md: 'auto' },
              backgroundColor: 'transparent',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                boxShadow: 'none',
                transform: 'none'
              },
              '&:active': {
                backgroundColor: 'rgba(30, 58, 138, 0.2)',
                transform: 'scale(0.98)'
              },
              '&:focus': {
                boxShadow: 'none'
              }
            }}
          >
            {t.header.login}
          </Button>
        </Box>
      </Toolbar>

      {/* Language Selector Menu */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            minWidth: { xs: 180, md: 200 },
            '& .MuiMenuItem-root': {
              px: { xs: 3, md: 2 },
              py: { xs: 2, md: 1.5 },
              minHeight: { xs: '48px', md: 'auto' },
              fontSize: { xs: '16px', md: '14px' },
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.08)',
              },
              '&:active': {
                backgroundColor: 'rgba(30, 58, 138, 0.16)',
                transform: 'scale(0.98)'
              }
            }
          }
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => {
              handleLanguageChange(language.code as Locale);
              handleLanguageMenuClose();
            }}
            selected={language.code === locale}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, md: 1.5 },
              py: { xs: 2, md: 1.5 },
              px: { xs: 3, md: 2 },
              minHeight: { xs: '48px', md: 'auto' },
              fontSize: { xs: '16px', md: '14px' },
              transition: 'all 0.2s ease-in-out',
              '&.Mui-selected': {
                backgroundColor: 'rgba(30, 58, 138, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(30, 58, 138, 0.16)',
                }
              }
            }}
          >
            <Typography sx={{ fontSize: '1.2rem' }}>
              {language.flag}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ 
                fontWeight: language.code === locale ? 600 : 400,
                fontSize: '0.9rem',
                color: language.code === locale ? '#1e3a8a' : '#333'
              }}>
                {language.name}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {language.country}
              </Typography>
            </Box>
            {language.code === locale && (
              <Box sx={{ 
                ml: 'auto',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#1e3a8a'
              }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
