const Button = ({ children, className = "", disabled = false, ...props }) => (
  <button
    className={`rounded-md bg-gold px-4 py-2 font-medium text-black transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default Button;
