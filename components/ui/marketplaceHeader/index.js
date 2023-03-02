import { Wallet, EthRates } from '@/components/ui/web3';
import { Breadcrumbs } from '@/components/ui/common';

const LINKS = [
  {
    href: '/marketplace',
    label: 'Buy',
  },
  {
    href: '/marketplace/courses/owned',
    label: 'My Courses',
  },
  {
    href: '/marketplace/courses/manage',
    label: 'Manage Courses',
  },
];

const MarketplaceHeader = () => {
  return (
    <div className='py-4'>
      <Wallet />
      <EthRates />
      <div className='pb-4 px-4 sm:px-6 lg:px-8 flex flex-row-reverse'>
        <Breadcrumbs links={LINKS} />
      </div>
    </div>
  );
};

export default MarketplaceHeader;
