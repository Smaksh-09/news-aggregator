import axios from 'axios';
import { getTranslationApiUrl } from '../config/apiConfig';

export const translateText = async (text: string, target: string) => {
  try {
    const baseUrl = getTranslationApiUrl();
    const response = await axios.get(`${baseUrl}`, {
      params: {
        source: 'auto',
        target: target,
        q: text
      }
    });

    if (!response.data.translatedText) {
      console.error('Translation response:', response.data);
      throw new Error('Invalid translation response');
    }

    return response.data.translatedText;
  } catch (error: any) {
    console.error("Error translating text:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return text;
  }
};
