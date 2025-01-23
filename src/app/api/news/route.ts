    import { NextRequest, NextResponse } from 'next/server';


    const API_KEY = process.env.NEWS_API_KEY;
    const BASE_URL = 'https://newsdata.io/api/1';

    export const dynamic = 'force-dynamic';
    export const revalidate = 0;

    export async function GET(request: NextRequest) {
    
      console.log('API Key available:', !!API_KEY);

      if (!API_KEY) {
        return NextResponse.json(
          { error: 'API key is not configured' },
          { status: 500 }
        );
      }

      const searchParams = request.nextUrl.searchParams;
      const category = searchParams.get('category') || 'world';
      
      
      const API_URL = `${BASE_URL}/news?apikey=${API_KEY}&category=${category}&language=en&country=us`;

      
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

      
        console.log('API Response Status:', newsResponse.status);
        console.log('API Response:', data.status, data.message || 'No error message');

        
        if (data.status === 'error' && data.message?.toLowerCase().includes('api key')) {
          console.error('API Key Error:', data.message);
          return NextResponse.json(
            { error: 'Invalid API key', details: 'Please check your API key configuration' },
            { status: 401 }
          );
        }

      
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

      } /* eslint-disable @typescript-eslint/no-explicit-any */
      catch (error: any) { 
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
    /* eslint-enable @typescript-eslint/no-explicit-any */
