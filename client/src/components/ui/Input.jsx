const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-md border border-black-700 bg-black-900 px-3 py-2 text-sm text-white outline-none focus:border-gold ${className}`}
    {...props}
  />
);

export default Input;
