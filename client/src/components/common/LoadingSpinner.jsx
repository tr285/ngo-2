const LoadingSpinner = ({ fullScreen = false }) => {
  const wrapperClass = fullScreen
    ? 'flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950'
    : 'flex items-center justify-center py-12';

  return (
    <div className={wrapperClass}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-900 dark:border-t-primary-400" />
    </div>
  );
};

export default LoadingSpinner;
