export const getTranslationApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
   
    return 'http://localhost:5000/?source=auto&target=el&q=yo';
  }
  return 'http://localhost:5000/translate';
};
