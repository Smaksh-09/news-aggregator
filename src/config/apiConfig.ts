export const getTranslationApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api/translate';
  }
  return 'http://localhost:5000/translate';
};
