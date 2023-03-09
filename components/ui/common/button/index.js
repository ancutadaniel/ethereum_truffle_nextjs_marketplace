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
    white: `text-indigo-600 bg-white ${hover ? 'hover:bg-gray-100' : ''}`,
    green: `text-white bg-green-600 ${hover ? 'hover:bg-green-700' : ''}`,
  };

  return (
    <button
      className={`p-2 xs:px-8 xs:py-3 border rounded-xl text-base font-medium cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${className} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
