import { Typography, Box, Container } from '@mui/material';
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

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Render the full HTML content from the API */}
        {pageData?.content?.heading ? (
          <Box 
            dangerouslySetInnerHTML={{ __html: pageData.content.heading }}
            sx={{ 
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
          </>
        )}
      </Container>
    </Box>
  );
}