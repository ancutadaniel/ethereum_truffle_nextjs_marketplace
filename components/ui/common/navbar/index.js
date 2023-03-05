import Link from 'next/link';
import { useRouter } from 'next/router';

import { ActiveLink, Button } from '@/components/ui/common';
import { useWeb3 } from '@/components/providers/web3';
import { useAccount } from '@/components/hooks/web3';

export default function Navbar() {
  const { connect, isLoading, web3, requireInstall } = useWeb3();
  const { account } = useAccount();
  const router = useRouter();

  let buttonContent;

  if (isLoading) {
    buttonContent = (
      <Button disabled onClick={connect}>
        Loading...
      </Button>
    );
  } else if (web3 !== null) {
    if (account.data) {
      buttonContent = (
        <Button
          className='cursor-default mr-2 text-sm xs:text-base '
          variant='primary'
          hover={false}
        >
          Hi there {account.isAdmin ? 'Admin' : 'User'}
        </Button>
      );
    } else {
      buttonContent = <Button onClick={connect}>Connect</Button>;
    }
  } else if (requireInstall) {
    buttonContent = (
      <Button
        onClick={() =>
          window.open('https://metamask.io/download.html', '_blank')
        }
      >
        Install Metamask
      </Button>
    );
  }

  return (
    <section>
      <div className='relative pt-6 px-4 sm:px-6 lg:px-8'>
        <nav className='relative' aria-label='Global'>
          <div className='flex flex-col xs:flex-row justify-between items-center'>
            <div>
              <ActiveLink href='/'>
                <a className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                  Home
                </a>
              </ActiveLink>
              <ActiveLink href='/marketplace'>
                <a className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                  Marketplace
                </a>
              </ActiveLink>
              <ActiveLink href='/blogs'>
                <a className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                  Blogs
                </a>
              </ActiveLink>
            </div>
            <div className='flex justify-center items-center'>
              <ActiveLink href='/wishlist' target='_blank'>
                <a className='font-medium mr-8 text-gray-500 hover:text-gray-900'>
                  Wishlist
                </a>
              </ActiveLink>
              {buttonContent}
            </div>
          </div>
        </nav>
      </div>
      {account.data && !router.pathname.includes('/marketplace') && (
        <div className='flex justify-end pt-1 sm:px-6 lg:px-8'>
          <div className='text-white bg-indigo-600 rounded-md p-2'>
            {account.data.slice(0, 5) + '...' + account.data.slice(-4)}
          </div>
        </div>
      )}
    </section>
  );
}
