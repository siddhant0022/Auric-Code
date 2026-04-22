const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-black-700 bg-black-800 p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

export default Card;
