const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center py-6 text-gold">
    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
