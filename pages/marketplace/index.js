import { useState } from 'react';
import { CourseList, CourseCard } from '@/components/ui/course';
import { getAllCourses } from '@/content/courses/fetcher';
import { Wallet } from '@/components/ui/web3';
import { useAccount, useNetwork } from '@/components/hooks/web3';
import { Button } from '@/components/ui/common';
import { OrderModal } from '@/components/ui/order';
import { BaseLayout } from '@/components/ui/layout';

export default function Marketplace({ courses }) {
  const { account } = useAccount();
  const { network } = useNetwork();

  const [course, setCourse] = useState(null);

  const onPurchase = (course) => setCourse(course);

  const onClose = () => setCourse(null);

  return (
    <>
      <div className='py-4'>
        <Wallet account={account} network={network} />
      </div>
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard key={course.slug} course={course}>
            <div className='flex justify-center mt-4'>
              <Button
                className='w-full'
                variant='secondary'
                onClick={() => onPurchase(course)}
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
