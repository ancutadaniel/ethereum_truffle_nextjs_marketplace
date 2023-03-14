import { useState } from 'react';
import { Button } from '@components/ui/common';

const filter = [
  { value: 'all', label: 'All' },
  { value: 'purchased', label: 'Purchased' },
  { value: 'activated', label: 'Activated' },
  { value: 'deactivated', label: 'Deactivated' },
];

export default function CourseFilter({ onSearch, onFilter }) {
  const [search, setSearch] = useState('');

  const handleOnSearch = (e) => {
    e.preventDefault();
    onSearch(search);
    setSearch('');
  };

  return (
    <div className='flex flex-col md:flex-row items-center my-4'>
      <div className='flex mr-2 relative rounded-md'>
        <input
          type='text'
          name='courseHash'
          id='courseHash'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-60 sm:w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md mr-2'
          placeholder='0x2341ab...'
        />
        <Button
          onClick={handleOnSearch}
          className={`mr-2 text-sm xs:text-base `}
        >
          Search
        </Button>
      </div>
      <div className='relative text-gray-700'>
        <select
          className='w-72 h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline'
          placeholder='Regular input'
          onChange={(e) => onFilter(e.target.value)}
        >
          {filter.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
          <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
            <path
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
              fillRule='evenodd'
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
