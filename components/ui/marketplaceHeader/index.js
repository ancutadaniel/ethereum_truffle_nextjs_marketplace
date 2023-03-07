import { Wallet, EthRates } from '@/components/ui/web3';
import { Breadcrumbs } from '@/components/ui/common';
import { useAdmin } from '@/components/hooks/web3';

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
    href: '/marketplace/courses/managedCourses',
    label: 'Manage Courses',
    isVisible: true,
  },
];

const MarketplaceHeader = () => {
  const { admin } = useAdmin({ redirectTo: '/marketplace' });
  return (
    <div className='pt-4'>
      <Wallet />
      <EthRates />
      <div className='p-4 flex flex-row-reverse'>
        <Breadcrumbs links={LINKS} isAdmin={admin.isAdmin} />
      </div>
    </div>
  );
};

export default MarketplaceHeader;
