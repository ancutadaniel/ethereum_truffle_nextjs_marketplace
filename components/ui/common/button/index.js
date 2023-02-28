export default function Button({
  children,
  className,
  hover = true,
  variant = 'primary',
  ...props
}) {
  let variants = {
    primary: `text-white bg-indigo-600 ${hover ? 'hover:bg-indigo-700' : ''}`,
    secondary: `text-indigo-600 bg-indigo-100 ${
      hover ? 'hover:bg-indigo-200' : ''
    }`,
    danger: `text-white bg-red-600 ${hover ? 'hover:bg-red-700' : ''}`,
  };

  return (
    <button
      className={`px-8 py-3 border rounded-xl text-base font-medium cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${className} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
