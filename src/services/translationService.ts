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
    return response.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};
