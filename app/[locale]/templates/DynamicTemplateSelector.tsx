import { Locale } from '@/lib/i18n';
import FlightTemplate from './FlightTemplate';
import AirportTemplate from './AirportTemplate';
import HotelTemplate from './HotelTemplate';
import AirlineTemplate from './AirlineTemplate';

interface DynamicTemplateSelectorProps {
  locale: Locale;
  templateType: 'flight' | 'airport' | 'hotel' | 'airline';
  pageData: any;
  params: any;
  onAction?: (searchData: any) => void;
}

export default function DynamicTemplateSelector({ 
  locale, 
  templateType, 
  pageData, 
  params,
  onAction 
}: DynamicTemplateSelectorProps) {
  
  // Flight templates
  if (templateType === 'flight') {
    return (
      <FlightTemplate 
        locale={locale}
        pageData={pageData}
        params={params}
        onAction={onAction}
      />
    );
  }

  // Airport templates
  if (templateType === 'airport') {
    return (
      <AirportTemplate 
        locale={locale}
        pageData={pageData}
        params={params}
        onAction={onAction}
      />
    );
  }

  // Hotel templates
  if (templateType === 'hotel') {
    return (
      <HotelTemplate 
        locale={locale}
        pageData={pageData}
        params={params}
        onAction={onAction}
      />
    );
  }

  // Airline templates
  if (templateType === 'airline') {
    return (
      <AirlineTemplate 
        locale={locale}
        pageData={pageData}
        params={params}
        onAction={onAction}
      />
    );
  }

  return null; // Or a fallback component
}
