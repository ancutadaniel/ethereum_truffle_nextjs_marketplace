import { useState } from 'react';
import { CourseList, CourseCard } from '@/components/ui/course';
import { getAllCourses } from '@/content/courses/fetcher';
import { useWallet } from '@/components/hooks/web3';
import { Button } from '@/components/ui/common';
import { OrderModal } from '@/components/ui/order';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';

export default function Marketplace({ courses }) {
  const [course, setCourse] = useState(null);
  const { canPurchase } = useWallet();

  const onPurchase = (course) => setCourse(course);
  const onClose = () => setCourse(null);

  return (
    <>
      <MarketplaceHeader />
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            key={course.slug}
            course={course}
            canPurchase={canPurchase}
          >
            <div className='flex justify-center mt-4'>
              <Button
                className='w-full'
                variant='secondary'
                onClick={() => onPurchase(course)}
                disabled={!canPurchase}
              >
                Purchase
              </Button>
            </div>
          </CourseCard>
        )}
      </CourseList>
      {course && <OrderModal course={course} onClose={onClose} />}
    </>
  );
}

export async function getStaticProps() {
  const { data: courses } = await getAllCourses();

  return {
    props: {
      courses,
    },
  };
}

Marketplace.Layout = BaseLayout;
