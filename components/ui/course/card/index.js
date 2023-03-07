import Image from 'next/image';
import Link from 'next/link';

export default function Card({ course, children, canPurchase }) {
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
      <div className='flex h-full'>
        <div className='flex-1 h-full next-image-wrapper'>
          <Image
            className={`object-cover ${
              canPurchase
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
          <div className='uppercase tracking-wide text-indigo-500 font-semibold'>
            {course.type}
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
