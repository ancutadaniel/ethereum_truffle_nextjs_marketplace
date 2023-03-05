import { useWeb3 } from '@/components/providers/web3';
import { useWallet } from '@/components/hooks/web3';
import { Button } from '@/components/ui/common';

export default function Wallet() {
  const { requireInstall } = useWeb3();
  const { account, network } = useWallet();

  return (
    <section className='text-white bg-indigo-600 rounded-xl'>
      <div className='p-8'>
        <h1 className=' text-base md:text-md lg:text-xl break-words'>
          Hello,
          {account.data ? account.data : 'please connect your wallet'}
        </h1>
        <h2 className='subtitle mb-5 text-sm md:text-md lg:text-xl'>
          I hope you are having a great day!
        </h2>
        <div className='flex justify-between items-center'>
          <div className='sm:flex sm:justify-center lg:justify-start'>
            <Button
              variant='white'
              className={`mr-2 text-sm xs:text-base px-1 py-1`}
            >
              {' '}
              Learn how to purchase
            </Button>
          </div>
          <div>
            {network.hasInitialized && !network.isSupported && (
              <div className='bg-red-400 p-4 rounded-lg'>
                <div className='flex items-center'>
                  Connected to the wrong network
                </div>
                <div>
                  <span>Please switch to </span>
                  <strong className='text-2xl'>{network.targetNetwork}</strong>
                </div>
              </div>
            )}
            {requireInstall && (
              <div className='bg-yellow-400 p-4 rounded-lg'>
                <a href='https://metamask.io/download.html' target={'_blank'}>
                  <span className='flex items-center'>
                    Please install MetaMask to continue
                  </span>
                </a>
                <div></div>
              </div>
            )}
            {network.data && (
              <div>
                <span>Currently on </span>
                <strong className='text-2xl'>{network.data}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
