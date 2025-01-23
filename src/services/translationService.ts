import axios from 'axios';
import { getTranslationApiUrl } from '../config/apiConfig';

export const translateText = async (text: string, target: string) => {
  try {
    const response = await axios.post(getTranslationApiUrl(), {
      q: text,
      source: "en",
      target: target,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};
