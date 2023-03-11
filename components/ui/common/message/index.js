import { useState } from 'react';

const TYPES = {
  success: 'text-green-600 bg-green-100',
  warning: 'text-yellow-600 bg-yellow-100',
  danger: 'text-red-600 bg-red-100',
};

const SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
};

export default function Message({
  children,
  type = 'success',
  className,
  size = 'md',
}) {
  const [isDisplayed, setIsDisplayed] = useState(true);

  if (!isDisplayed) {
    return null;
  }

  const messageType = TYPES[type];
  const messageSize = SIZES[size];

  return (
    <div className={`${messageType} rounded-xl mt-2 ${className}`}>
      <div className={`max-w-7xl mx-auto py-1 px-2`}>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='w-0 flex-1 flex items-center'>
            <div className={`ml-3 ${messageSize} ${messageType}`}>
              <span className='md:inline'>{children}</span>
            </div>
          </div>
          <div className='order-2 flex-shrink-0 sm:order-3 sm:ml-3'>
            <button
              onClick={() => setIsDisplayed(false)}
              type='button'
              className='-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 sm:-mr-2'
            >
              <span className='sr-only'>Dismiss</span>
              <svg
                className={`h-6 w-6 ${messageType}`}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
