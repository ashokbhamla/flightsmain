import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('country_code') || 'US';
    const country = searchParams.get('country') || 'United States';
    const locale = searchParams.get('locale') || 'en';
    const domainId = searchParams.get('domain_id') || '1';

    // Mock data for homepage cards
    const mockData = {
      popular_routes: [
        {
          departure_city: 'New York',
          arrival_city: 'Los Angeles',
          average_fare: '$299',
          image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&fm=webp'
        },
        {
          departure_city: 'Miami',
          arrival_city: 'Cancun',
          average_fare: '$199',
          image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&fm=webp'
        },
        {
          departure_city: 'Chicago',
          arrival_city: 'Las Vegas',
          average_fare: '$249',
          image_url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&fm=webp'
        }
      ],
      customer_reviews: [
        {
          id: 1,
          name: 'Sarah Johnson',
          location: 'New York, NY',
          rating: 5,
          comment: 'Amazing experience! Found the best deals on flights and hotels. Highly recommended!',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&fm=webp'
        },
        {
          id: 2,
          name: 'Michael Chen',
          location: 'Los Angeles, CA',
          rating: 5,
          comment: 'Great platform with excellent customer service. Booked my entire vacation here.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&fm=webp'
        },
        {
          id: 3,
          name: 'Emily Davis',
          location: 'Chicago, IL',
          rating: 4,
          comment: 'User-friendly interface and competitive prices. Will definitely use again!',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&fm=webp'
        }
      ],
      hotels: [
        {
          hotel_name: 'Grand Hotel New York',
          city: 'Manhattan, NY',
          star_rating: 4.8,
          image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&fm=webp'
        },
        {
          hotel_name: 'Luxury Resort Miami',
          city: 'Miami Beach, FL',
          star_rating: 4.9,
          image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&fm=webp'
        },
        {
          hotel_name: 'Boutique Hotel Chicago',
          city: 'Downtown Chicago, IL',
          star_rating: 4.6,
          image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&fm=webp'
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error in homepage-cards API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage cards' },
      { status: 500 }
    );
  }
}
