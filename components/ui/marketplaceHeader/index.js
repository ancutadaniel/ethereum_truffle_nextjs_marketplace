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
    <div className='pt-4'>
      <Wallet />
      <EthRates />
      <div className='p-4 flex flex-row-reverse'>
        <Breadcrumbs links={LINKS} />
      </div>
    </div>
  );
};

export default MarketplaceHeader;
