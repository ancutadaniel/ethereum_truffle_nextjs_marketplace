import { useState } from 'react';
import { CourseList, CourseCard } from '@/components/ui/course';
import { getAllCourses } from '@/content/courses/fetcher';
import { useWallet } from '@/components/hooks/web3';
import { Button } from '@/components/ui/common';
import { OrderModal } from '@/components/ui/order';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { useWeb3 } from '@components/providers/web3';

export default function Marketplace({ courses }) {
  const [course, setCourse] = useState(null);
  const { account, canPurchase } = useWallet();
  const { web3, contract } = useWeb3();

  const onPurchase = (course) => setCourse(course);
  const onClose = () => setCourse(null);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(course.id);
    const orderHash = web3.utils.soliditySha3(
      {
        type: 'bytes16',
        value: hexCourseId,
      },
      {
        type: 'address',
        value: account.data,
      }
    );
    const emailHash = web3.utils.soliditySha3(order.email);
    const proof = web3.utils.soliditySha3(
      {
        type: 'bytes32',
        value: emailHash,
      },
      {
        type: 'bytes32',
        value: orderHash,
      }
    );

    console.log(proof);

    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({
          from: account.data,
          value: web3.utils.toWei(String(order.price), 'ether'),
        });
      console.log(result);
    } catch (error) {
      console.error(`Purchase course failed: ${error}`);
    }
  };

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
      {course && (
        <OrderModal
          course={course}
          onClose={onClose}
          onSubmit={purchaseCourse}
        />
      )}
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
