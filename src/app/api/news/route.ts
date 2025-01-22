import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'pub_6625263de3e6f074bb7554b51ac7efb7e5592';
const BASE_URL = 'https://newsdata.io/api/1';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'top';

  try {
    const newsResponse = await fetch(`${BASE_URL}/news?apikey=${API_KEY}&country=us&language=en&category=${category}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }
    });

    if (!newsResponse.ok) {
      throw new Error(`NewsData API error: ${newsResponse.status}`);
    }

    const data = await newsResponse.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch news',
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
