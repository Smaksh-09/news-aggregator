import { NextRequest, NextResponse } from 'next/server';

// Use this API key or create a new one at https://newsdata.io/register
const API_KEY = process.env.NEWS_API_KEY || 'pub_31204b2c8c46ed7b5bb6525452058cd730962';
const BASE_URL = 'https://newsdata.io/api/1';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Debug log to check if API key is available
  console.log('API Key available:', !!API_KEY);

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'world';
  
  // Simplified API URL with essential parameters
  const API_URL = `${BASE_URL}/news?apikey=${API_KEY}&category=${category}&language=en&country=us`;

  // Debug log for API URL (hiding the actual API key)
  console.log('Requesting URL:', API_URL.replace(API_KEY!, '[HIDDEN]'));

  try {
    const newsResponse = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    const data = await newsResponse.json();

    // Debug log for API response
    console.log('API Response Status:', newsResponse.status);
    console.log('API Response:', data.status, data.message || 'No error message');

    // Specific error handling for invalid API key
    if (data.status === 'error' && data.message?.toLowerCase().includes('api key')) {
      console.error('API Key Error:', data.message);
      return NextResponse.json(
        { error: 'Invalid API key', details: 'Please check your API key configuration' },
        { status: 401 }
      );
    }

    // Handle other API errors
    if (!newsResponse.ok) {
      throw new Error(`HTTP error! status: ${newsResponse.status}`);
    }

    if (data.status === 'error') {
      throw new Error(data.message || 'NewsData API error');
    }

    return NextResponse.json({
      status: 'success',
      results: data.results || []
    });

  } catch (error: any) {
    console.error('Full API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        details: error.message,
        apiKeyPresent: !!API_KEY
      },
      { status: 500 }
    );
  }
}
