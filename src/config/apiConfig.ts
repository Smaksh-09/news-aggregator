export const getTranslationApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
   
    return 'http://localhost:5000';
  }
  return 'http://localhost:5000';
};
