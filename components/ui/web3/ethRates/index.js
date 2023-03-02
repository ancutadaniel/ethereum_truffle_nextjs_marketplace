import { useETHPrice } from '@/components/hooks/useETHPrice';
import Image from 'next/image';

export default function EthRates() {
  const { ethPrice, pricePerCourse } = useETHPrice();

  return (
    <div className='grid grid-cols-4'>
      <div className='flex flex-1 items-stretch text-center'>
        <div className='p-10 border drop-shadow rounded-md'>
          <div className='flex items-center'>
            <Image src='/small-eth.webp' width={35} height={35} alt='ETH' />
            <span className='text-2xl font-bold'>ETH = {ethPrice.data}$</span>
          </div>
          <p className='text-xl text-gray-500'>Current eth Price</p>
        </div>
      </div>
      <div className='flex flex-1 items-stretch text-center'>
        <div className='p-10 border drop-shadow rounded-md'>
          <div>
            <span className='text-2xl font-bold flex items-center'>
              <Image src='/small-eth.webp' width={35} height={35} alt='ETH' />
              {pricePerCourse} = 15$
            </span>
          </div>
          <p className='text-xl text-gray-500'>Price per course</p>
        </div>
      </div>
    </div>
  );
}
