import FlightCards from '@/app/[locale]/search/components/FlightCards';

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const from = (searchParams.from as string) || undefined;
  const to = (searchParams.to as string) || undefined;
  const date = (searchParams.date as string) || undefined;
  const returnDate = (searchParams.returnDate as string) || undefined;
  const adults = searchParams.adults ? parseInt(searchParams.adults as string) : undefined;
  const childPax = searchParams.children ? parseInt(searchParams.children as string) : undefined;
  const curr = (searchParams.curr as string) || undefined;
  const cabin = (searchParams.cabin as string) || undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <FlightCards
            from={from}
            to={to}
            date={date}
            returnDate={returnDate}
            adults={adults}
            childPax={childPax}
            curr={curr}
            cabin={cabin}
          />
        </div>
      </main>
    </div>
  );
}


