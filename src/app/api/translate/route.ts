import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getTranslationApiUrl } from '@/config/apiConfig';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const translationApiUrl = getTranslationApiUrl();
    
    const response = await axios.get(translationApiUrl, {
      params: {
        source: 'auto',
        target: body.target,
        q: body.q
      },
      headers: {
        'Accept': 'application/json',
        'Origin': request.headers.get('origin') || 'http://localhost:3000'
      }
    });
    
    console.log('Translation response:', response.data); // Add logging
    
    return NextResponse.json(response.data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: any) {
    console.error('Translation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: error.response?.data || error.message
      },
      { 
        status: error.response?.status || 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}
