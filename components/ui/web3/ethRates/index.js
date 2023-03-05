import { useETHPrice, COURSE_PRICE } from '@/components/hooks/useETHPrice';
import { Loader } from '@components/ui/common';
import Image from 'next/image';

export default function EthRates() {
  const { ethPrice, pricePerCourse } = useETHPrice();

  return (
    <div className='flex flex-col xs:flex-row text-center  pt-4'>
      <div className='p-6 border drop-shadow rounded-md mr-2 hover:transform hover:translate-y-1 transition duration-300'>
        <div className='flex items-center justify-center'>
          {ethPrice.data ? (
            <>
              <Image src='/small-eth.webp' width={35} height={35} alt='ETH' />
              <span className='text-lg font-bold'>
                ETH = {ethPrice.data}$
              </span>{' '}
            </>
          ) : (
            <div className='w-full flex justify-center'>
              <Loader size='md' />
            </div>
          )}
        </div>
        <p className='text-sm text-gray-500'>Current eth Price</p>
      </div>

      <div className='p-6 border drop-shadow rounded-md mr-2 hover:transform hover:translate-y-1 transition duration-300'>
        <div className='flex items-center justify-center'>
          {ethPrice.data ? (
            <span className='text-lg font-bold flex items-center'>
              <Image src='/small-eth.webp' width={35} height={35} alt='ETH' />
              {pricePerCourse} = {COURSE_PRICE}$
            </span>
          ) : (
            <div className='w-full flex justify-center'>
              <Loader size='md' />
            </div>
          )}
        </div>
        <p className='text-sm text-gray-500'>Price per course</p>
      </div>
    </div>
  );
}
