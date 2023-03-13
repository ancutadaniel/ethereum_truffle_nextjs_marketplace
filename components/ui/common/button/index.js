const SIZE = {
  sm: 'p-2 text-sm xs:px-4',
  md: 'p-3 text-base xs:px-8 ',
  lg: 'p-3 text-lg xs:px-8',
};

export default function Button({
  children,
  className,
  hover = true,
  size = 'md',
  variant = 'primary',
  ...props
}) {
  let variants = {
    primary: `text-white bg-indigo-600 ${hover ? 'hover:bg-indigo-700' : ''}`,
    secondary: `text-indigo-600 bg-indigo-100 ${
      hover ? 'hover:bg-indigo-200' : ''
    }`,
    danger: `text-white bg-red-600 ${hover ? 'hover:bg-red-700' : ''}`,
    white: `text-black bg-white ${hover ? 'hover:bg-gray-100' : ''}`,
    success: `text-white bg-green-600  ${hover ? 'hover:bg-green-700' : ''}`,
  };

  const sizeClass = SIZE[size];

  return (
    <button
      className={`border rounded-xl 
      font-medium cursor-pointer
      disabled:opacity-20 disabled:cursor-not-allowed
      ${className} ${variants[variant]} ${sizeClass}}`}
      {...props}
    >
      {children}
    </button>
  );
}
