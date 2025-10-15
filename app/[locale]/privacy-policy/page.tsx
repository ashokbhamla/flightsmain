import { Typography, Box, Container } from '@mui/material';
import { fetchPage } from '@/lib/api';
import { Metadata } from 'next';
import { localeFromParam } from '@/lib/i18n';
import { generateStaticPageCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateStaticPageCanonicalUrl('privacy-policy', locale);
  const alternateUrls = generateAlternateUrls('/privacy-policy');
  
  try {
    const pageData = await fetchPage('privacy-policy', locale === 'es' ? 2 : 1);
    
    return {
      title: pageData?.title || 'Privacy Policy',
      description: pageData?.description || 'Privacy Policy information.',
      keywords: pageData?.meta?.keywords?.join(', '),
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: pageData?.title || 'Privacy Policy',
        description: pageData?.description || 'Privacy Policy information.',
        url: canonicalUrl,
        type: 'website',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      },
      twitter: {
        card: 'summary',
        title: pageData?.title || 'Privacy Policy',
        description: pageData?.description || 'Privacy Policy information.',
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for privacy-policy:', error);
    return {
      title: 'Privacy Policy',
      description: 'Privacy Policy information.',
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

export default async function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  const pageData = await fetchPage('privacy-policy', params.locale === 'es' ? 2 : 1);

  return (
    <Box sx={{ width: '100%' }}>
      <Container 
        maxWidth="lg"
        sx={{ 
          py: 6
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
          {pageData?.title || 'Privacy Policy'}
        </Typography>
        
        <Box sx={{ 
          maxWidth: '900px',
          mx: 'auto'
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
              __html: pageData?.content?.body || pageData?.description || 'Please review our privacy policy to understand how we handle your data.' 
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}