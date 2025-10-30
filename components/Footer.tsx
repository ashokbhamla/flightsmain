'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { pathWithLocale } from '@/lib/routes';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import Grid from '@mui/material/Grid';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import SearchIcon from '@mui/icons-material/Search';

export default function Footer({ data, locale }: { data: any; locale: Locale }) {
  const t = getTranslations(locale);
  
  // Use translations with fallback to environment configuration
  const footer = {
    copyright: data?.copyright || t.footer.copyright,
    description1: data?.description1 || t.footer.description1,
    description2: data?.description2 || t.footer.description2,
    navigation: data?.navigation || {
      aboutUs: '/about-us',
      contactUs: '/contact-us',
      privacyPolicy: '/privacy-policy'
    }
  };
  
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      backgroundColor: '#1a1a1a',
      borderTop: '3px solid #10b981',
      marginTop: '4rem'
    }}>
      {/* Main Footer Content */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 6 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Grid container spacing={4}>
          {/* Company Info Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '0.5px'
                }}
              >
                flight
              </Typography>
              <SearchIcon sx={{
                color: '#10b981',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                ml: 0.5,
                fontWeight: 700
              }} />
            </Box>
                              <Typography
                    variant="body2"
                    sx={{
                      color: '#b0b0b0',
                      mb: 2,
                      lineHeight: 1.6
                    }}
                  >
                    {footer.description1}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#b0b0b0',
                      lineHeight: 1.6
                    }}
                  >
                    {footer.description2}
                  </Typography>
          </Grid>

          {/* About Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#ffffff',
                mb: 3,
                fontSize: '1.1rem'
              }}
            >
              {t.footer.about}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 1.5 } }}>
              <Link href={pathWithLocale(locale, '/about-us') as any} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.aboutUs}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/android-app')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.androidApp}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/ios-app')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.iosApp}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/blog')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.blog}
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Explore Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#ffffff',
                mb: 3,
                fontSize: '1.1rem'
              }}
            >
              {t.footer.explore}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 1.5 } }}>
              <Link href={pathWithLocale(locale, '/flights')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.flights}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/hotels')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.hotels}
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* More Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#ffffff',
                mb: 3,
                fontSize: '1.1rem'
              }}
            >
              {t.footer.more}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 1.5 } }}>
              <Link href={pathWithLocale(locale, '/contact-us')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.customerSupport}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/terms-and-conditions')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.termsConditions}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/privacy-policy')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.privacyPolicy}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/refund-policy')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  {t.footer.refundPolicy}
                </Typography>
              </Link>
              <Link href={pathWithLocale(locale, '/sitemap')} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                  color: '#b0b0b0', 
                  fontSize: { xs: '16px', md: '14px' },
                  py: { xs: 1, md: 0 },
                  '&:hover': { color: '#10b981' },
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  Sitemap
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Bottom */}
      <Box sx={{ 
        borderTop: '1px solid #333333',
        py: 3,
        backgroundColor: '#111111'
      }}>
        <Container maxWidth={false} sx={{ 
          px: { xs: 3, sm: 4, md: 6 },
          width: '100%',
          maxWidth: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', sm: 'center' },
            gap: 2
          }}>
                               <Typography
                     variant="body2"
                     sx={{
                       color: '#888888',
                       textAlign: { xs: 'center', sm: 'left' }
                     }}
                   >
                     {footer.copyright}
                   </Typography>
            
            {/* Disclaimer & TCPA Consent */}
            <Box sx={{ maxWidth: 900 }}>
              <Typography variant="caption" sx={{ color: '#9aa0a6', display: 'block', textAlign: { xs: 'center', sm: 'left' }, mb: 1.5 }}>
                <strong>Disclaimer & TCPA Consent</strong> — By providing your phone number, you consent to receive calls and text messages (including automated or pre-recorded messages) from AirlinesMap.com, its affiliates, and partners at the number provided. Message and data rates may apply. You can opt out anytime by replying “STOP” or calling (888) 319-6206.
              </Typography>
              <Typography variant="caption" sx={{ color: '#9aa0a6', display: 'block', textAlign: { xs: 'center', sm: 'left' } }}>
                AirlinesMap.com is an independent travel information platform and is not affiliated with any airline. Flight data, fares, and schedules are provided by third-party sources and may change without notice. AirlinesMap.com does not guarantee accuracy or availability and does not handle bookings directly. Use of this site signifies your agreement to these terms.
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center'
            }}>
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <Box 
                  component="a"
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: { xs: 48, md: 36 },
                    height: { xs: 48, md: 36 },
                    borderRadius: '50%',
                    backgroundColor: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: '#10b981',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      backgroundColor: '#059669',
                      transform: 'scale(0.95)'
                    }
                  }}
                >
                  <InstagramIcon sx={{ color: '#ffffff', fontSize: { xs: '1.5rem', md: '1.2rem' } }} />
                </Box>
              )}
              {process.env.NEXT_PUBLIC_TWITTER_URL && (
                <Box 
                  component="a"
                  href={process.env.NEXT_PUBLIC_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: { xs: 48, md: 36 },
                    height: { xs: 48, md: 36 },
                    borderRadius: '50%',
                    backgroundColor: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: '#10b981',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      backgroundColor: '#059669',
                      transform: 'scale(0.95)'
                    }
                  }}
                >
                  <TwitterIcon sx={{ color: '#ffffff', fontSize: { xs: '1.5rem', md: '1.2rem' } }} />
                </Box>
              )}
              {process.env.NEXT_PUBLIC_YOUTUBE_URL && (
                <Box 
                  component="a"
                  href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: { xs: 48, md: 36 },
                    height: { xs: 48, md: 36 },
                    borderRadius: '50%',
                    backgroundColor: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: '#10b981',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      backgroundColor: '#059669',
                      transform: 'scale(0.95)'
                    }
                  }}
                >
                  <YouTubeIcon sx={{ color: '#ffffff', fontSize: { xs: '1.5rem', md: '1.2rem' } }} />
                </Box>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                <Box 
                  component="a"
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: { xs: 48, md: 36 },
                    height: { xs: 48, md: 36 },
                    borderRadius: '50%',
                    backgroundColor: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: '#10b981',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      backgroundColor: '#059669',
                      transform: 'scale(0.95)'
                    }
                  }}
                >
                  <FacebookIcon sx={{ color: '#ffffff', fontSize: { xs: '1.5rem', md: '1.2rem' } }} />
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
