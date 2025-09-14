import { Typography, Box, Container } from '@mui/material';
import { fetchPage } from '@/lib/api';
import { Metadata } from 'next';
import { localeFromParam } from '@/lib/i18n';
import { generateStaticPageCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateStaticPageCanonicalUrl('refund-policy', locale);
  const alternateUrls = generateAlternateUrls('/refund-policy');
  
  try {
    const pageData = await fetchPage('refund-policy', locale === 'es' ? 2 : 1);
    
    return {
      title: pageData?.title || 'Refund Policy',
      description: pageData?.description || 'Refund Policy information.',
      keywords: pageData?.meta?.keywords?.join(', '),
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: pageData?.title || 'Refund Policy',
        description: pageData?.description || 'Refund Policy information.',
        url: canonicalUrl,
        type: 'website',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      },
      twitter: {
        card: 'summary',
        title: pageData?.title || 'Refund Policy',
        description: pageData?.description || 'Refund Policy information.',
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for refund-policy:', error);
    return {
      title: 'Refund Policy',
      description: 'Refund Policy information.',
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

export default async function RefundPolicyPage({ params }: { params: { locale: string } }) {
  const pageData = await fetchPage('refund-policy', params.locale === 'es' ? 2 : 1);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Container 
        sx={{ 
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 4, md: 6 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
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
          {pageData?.title || 'Refund Policy'}
        </Typography>
        
        <Box sx={{ 
          maxWidth: { xs: '100%', sm: '80%', md: '70%' },
          mx: { xs: 'auto', sm: 0 }
        }}>
          {pageData?.content?.heading && (
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '1.8rem',
                fontWeight: 600,
                mb: 3,
                color: '#1a1a1a'
              }}
            >
              {pageData.content.heading}
            </Typography>
          )}
          
          <Box 
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666',
              mb: 3,
              '& h1, & h2, & h3': {
                color: '#1a1a1a',
                fontWeight: 600,
                mb: 2,
                mt: 3
              },
              '& h1': {
                fontSize: '1.8rem',
                mb: 1
              },
              '& h2': {
                fontSize: '1.5rem',
                mt: 4
              },
              '& h3': {
                fontSize: '1.3rem',
                mt: 3
              },
              '& p': {
                mb: 2
              },
              '& ul': {
                mb: 2,
                pl: 3
              },
              '& li': {
                mb: 1
              },
              '& strong': {
                color: '#000',
                fontWeight: 600
              },
              '& .contact': {
                mt: 4,
                p: 3,
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }
            }}
            dangerouslySetInnerHTML={{ 
              __html: pageData?.content?.body || pageData?.description || 'Please review our refund policy for flight bookings.' 
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}