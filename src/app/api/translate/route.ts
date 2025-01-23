import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getTranslationApiUrl } from '@/config/apiConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const translationApiUrl = getTranslationApiUrl();
    const response = await axios.get(translationApiUrl, {
      params: {
        source: 'auto',
        target: body.target,
        q: body.q
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
