import { Typography, Box, Container } from '@mui/material';
import { fetchPage } from '@/lib/api';
import { Metadata } from 'next';
import { localeFromParam } from '@/lib/i18n';
import { generateStaticPageCanonicalUrl, generateAlternateUrls } from '@/lib/canonical';
import { getPageTranslations, getLanguageId } from '@/lib/translations';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = localeFromParam(params.locale);
  const pageTranslations = getPageTranslations(locale, 'aboutUs');
  
  // Generate canonical URL and alternate URLs
  const canonicalUrl = generateStaticPageCanonicalUrl('about-us', locale);
  const alternateUrls = generateAlternateUrls('/about-us');
  
  try {
    const pageData = await fetchPage('about-us', locale === 'es' ? 2 : 1);
    
    return {
      title: pageData?.title || pageTranslations.title,
      description: pageData?.description || pageTranslations.description,
      keywords: pageData?.meta?.keywords?.join(', '),
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      openGraph: {
        title: pageData?.title || pageTranslations.title,
        description: pageData?.description || pageTranslations.description,
        url: canonicalUrl,
        type: 'website',
        siteName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'flightsearchs',
      },
      twitter: {
        card: 'summary',
        title: pageData?.title || pageTranslations.title,
        description: pageData?.description || pageTranslations.description,
      },
    };
  } catch (error) {
    console.error('Error fetching metadata for about-us:', error);
    return {
      title: pageTranslations.title,
      description: pageTranslations.description,
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
    };
  }
}

export default async function AboutUsPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const pageTranslations = getPageTranslations(locale, 'aboutUs');
  const pageData = await fetchPage('about-us', locale === 'es' ? 2 : 1);

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
          {pageData?.title || pageTranslations.heading}
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
          
          <Typography 
            variant="body1"
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#666',
              mb: 3
            }}
          >
            {pageData?.content?.body || pageData?.description || 'Learn more about our company and mission.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}