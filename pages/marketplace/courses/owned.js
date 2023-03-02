import { OwnedCourseCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';

const OwnedCourses = () => {
  return (
    <>
      <MarketplaceHeader />
      <section className='grid grid-cols-1'>
        <OwnedCourseCard />
      </section>
    </>
  );
};

OwnedCourses.Layout = BaseLayout;

export default OwnedCourses;
