import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { getTranslationApiUrl } from '@/config/apiConfig';

export async function OPTIONS() {
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
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Translation error:', {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status
    });
    
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: axiosError.response?.data || axiosError.message
      },
      { 
        status: axiosError.response?.status || 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}
