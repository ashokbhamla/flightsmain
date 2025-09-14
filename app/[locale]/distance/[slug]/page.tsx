import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { localeFromParam } from '@/lib/i18n';
import SchemaOrg from '@/components/SchemaOrg';
import { breadcrumbSchema } from '@/lib/schema';
import { sampleData, spanishData } from '@/lib/sampleData';

export default async function Distance({ params }: { params: { locale: string, slug: string } }) {
  const locale = localeFromParam(params.locale);
  const data = locale === 'es' ? spanishData : sampleData;
  const distanceData = data.distance[params.slug as keyof typeof data.distance] || { 
    title: `Distance ${params.slug}`, 
    content: `<p>Distance information for ${params.slug}</p>` 
  };

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
          variant="h2" 
          gutterBottom 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 'bold',
            textAlign: { xs: 'center', sm: 'left' },
            mb: 3
          }}
        >
          {distanceData.title ?? `Distance ${params.slug}`}
        </Typography>
        <Box sx={{ 
          maxWidth: { xs: '100%', sm: '80%', md: '70%' },
          mx: { xs: 'auto', sm: 0 }
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: distanceData.content ?? '' }} 
            style={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          />
        </Box>
      </Container>
      <SchemaOrg data={breadcrumbSchema([
        { name: 'Home', url: locale === 'es' ? '/es' : '/' },
        { name: 'Distance', url: (locale === 'es' ? '/es' : '') + '/distance' },
        { name: params.slug.toUpperCase(), url: (locale === 'es' ? '/es' : '') + `/distance/${params.slug}` },
      ])} />
    </Box>
  );
}
