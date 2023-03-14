import Image from 'next/image';

const STATE_COLORS = {
  PURCHASED: 'text-indigo-500 bg-indigo-200',
  ACTIVATED: 'text-green-500 bg-green-200',
  DEACTIVATED: 'text-red-500 bg-red-200',
};

export default function OwnedCard({ children, course }) {
  const stateColor = STATE_COLORS[course?.state];

  return (
    <div className='bg-white border shadow overflow-hidden sm:rounded-lg mb-3'>
      <div className='block sm:flex'>
        <div className='flex-1'>
          <div className='h-45 sm:h-full next-image-wrapper'>
            <Image
              className='object-cover'
              src={course?.coverImage}
              alt={course?.title}
              width={300}
              height={300}
            />
          </div>
        </div>
        <div className='flex-4'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              <span>{course?.title}</span>
              <span
                className={`ml-2 p-2 rounded-full text-xs ${stateColor} ${stateColor}`}
              >
                {course?.state}
              </span>
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              {course?.price}ETH
            </p>
          </div>

          <div className='border-t border-gray-200'>
            <dl>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-9 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Course ID</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {course?.ownedCourseId}
                </dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-9 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Proof</dt>
                <dd className='w-full break-words mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-8'>
                  {course?.proof}
                </dd>
              </div>
              <div className='bg-white px-4 py-5 sm:px-6'>{children}</div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
