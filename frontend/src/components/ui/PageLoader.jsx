const PageLoader = () => (
  <div className="flex flex-col items-center justify-center p-6 gap-3">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand"></div>
    <p className="text-sm text-gray-500">Loading...</p>
  </div>
);

export default PageLoader;
