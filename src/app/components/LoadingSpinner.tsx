const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
