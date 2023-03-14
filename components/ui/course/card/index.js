import Image from 'next/image';
import Link from 'next/link';
import { AnimateKeyframes } from 'react-simple-animate';

const TYPES = {
  success: 'text-green-600 bg-green-100',
  warning: 'text-yellow-600 bg-yellow-100',
  danger: 'text-red-600 bg-red-100',
};

export default function Card({ course, children, hasConnectedWallet, owned }) {
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
      <div className='flex h-full'>
        <div className='flex-1 h-full next-image-wrapper'>
          <Image
            className={`object-cover ${
              hasConnectedWallet
                ? 'cursor-pointer'
                : 'cursor-not-allowed filter grayscale'
            }`}
            width={300}
            height={300}
            src={course.coverImage}
            alt={course.title}
          />
        </div>
        <div className='flex-2 p-8 pb-4'>
          <div className='flex items-center'>
            <div className='flex uppercase tracking-wide text-indigo-500 font-semibold mr-1'>
              {course.type}
            </div>
            {owned?.state === 'DEACTIVATED' && (
              <div
                className={` ${TYPES['danger']} p-1 px-3 rounded-full text-xs `}
              >
                Deactivated
              </div>
            )}
            {owned?.state === 'ACTIVATED' && (
              <div
                className={` ${TYPES['success']} p-1 px-3 rounded-full text-xs `}
              >
                Activated
              </div>
            )}
            {owned?.state === 'PURCHASED' && (
              <AnimateKeyframes
                play
                duration={2}
                keyframes={['opacity: 0.2', 'opacity: 1']}
                iterationCount='infinite'
              >
                <div
                  className={` ${TYPES['warning']} p-1 px-3 rounded-full text-xs `}
                >
                  Pending
                </div>
              </AnimateKeyframes>
            )}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className='h-12 block mt-1 text-sm xs:text-lg leading-tight font-medium text-black hover:underline'
          >
            {course.title}
          </Link>
          <p className='mt-2 text-gray-500 text-xs sm:text-sm md:text-md'>
            {course.description.substring(0, 70)}...
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
