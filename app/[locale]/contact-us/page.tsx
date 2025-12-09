import { Typography, Box, Container, Paper, Button, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { fetchPage } from '@/lib/api';
import { Metadata } from 'next';
import { localeFromParam } from '@/lib/i18n';
import { generateStaticPageCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateStaticPageCanonicalUrl('contact-us', locale);
  const alternateUrls = generateAlternateUrls('/contact-us');
  
  try {
    const pageData = await fetchPage('contact-us', locale === 'es' ? 2 : 1);
    
    return {
      title: pageData?.title || 'Contact Us',
      description: pageData?.description || 'Contact us for any inquiries or support.',
      keywords: pageData?.meta?.keywords?.join(', '),
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: pageData?.title || 'Contact Us',
        description: pageData?.description || 'Contact us for any inquiries or support.',
        url: canonicalUrl,
        type: 'website',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      },
      twitter: {
        card: 'summary',
        title: pageData?.title || 'Contact Us',
        description: pageData?.description || 'Contact us for any inquiries or support.',
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for contact-us:', error);
    return {
      title: 'Contact Us',
      description: 'Contact us for any inquiries or support.',
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

export default async function ContactUsPage({ params }: { params: { locale: string } }) {
  const pageData = await fetchPage('contact-us', params.locale === 'es' ? 2 : 1);

  // Clean up escaped newlines and other escape sequences
  const cleanHtml = (html: string) => {
    return html
      .replace(/\\n/g, '\n')  // Replace escaped newlines with actual newlines
      .replace(/\\t/g, '\t')  // Replace escaped tabs
      .replace(/\\"/g, '"')   // Replace escaped quotes
      .replace(/\\'/g, "'");  // Replace escaped single quotes
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Container 
        maxWidth="lg"
        sx={{ py: 6 }}
      >
        {/* Render the full HTML content from the API */}
        {pageData?.content?.heading ? (
          <Box 
            dangerouslySetInnerHTML={{ __html: cleanHtml(pageData.content.heading) }}
            sx={{ 
              maxWidth: '900px',
              mx: 'auto',
              '& h1': {
                margin: 0,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2rem' },
                lineHeight: 1.05
              },
              '& section': {
                fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                color: '#0b1220',
                background: '#ffffff',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 8px 30px rgba(2,6,23,0.08)'
              },
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              },
              '& input, & textarea, & select': {
                width: '100%',
                boxSizing: 'border-box'
              }
            }}
          />
        ) : (
          <>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                textAlign: 'left',
                mb: 4,
                color: '#1a1a1a'
              }}
            >
              {pageData?.title || 'Contact Us'}
            </Typography>
            
            <Box sx={{ 
              maxWidth: { xs: '100%', sm: '80%', md: '70%' },
              mx: { xs: 'auto', sm: 0 }
            }}>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#666',
                  mb: 3
                }}
              >
                {pageData?.content?.body || pageData?.meta?.description || 'Contact us for any inquiries or support.'}
              </Typography>
            </Box>

            {/* Contact Information Section */}
            <Box sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px'
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Customer Support
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                      Available 24/7 for your travel needs
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      href="tel:+18883511711"
                      startIcon={<PhoneIcon />}
                      sx={{
                        fontWeight: 700,
                        px: 3,
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Call (888) 351-1711
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                      <strong>Phone:</strong> <a href="tel:+18883511711" style={{ color: '#10b981', textDecoration: 'none' }}>+1-888-351-1711</a>
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px'
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Email Support
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                      Send us an email anytime
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      <strong>Email:</strong>{' '}
                      <a 
                        href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@airlinesmap.com'}`}
                        style={{ color: '#10b981', textDecoration: 'none' }}
                      >
                        {process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@airlinesmap.com'}
                      </a>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}