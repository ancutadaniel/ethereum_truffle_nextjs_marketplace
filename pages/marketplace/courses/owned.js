import { OwnedCourseCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { Button, Message } from '@/components/ui/common';

const OwnedCourses = () => {
  return (
    <>
      <MarketplaceHeader />
      <section className='grid grid-cols-1'>
        <OwnedCourseCard>
          <Message>My custom message!</Message>
          <Button>Watch the course</Button>
        </OwnedCourseCard>
      </section>
    </>
  );
};

OwnedCourses.Layout = BaseLayout;

export default OwnedCourses;
