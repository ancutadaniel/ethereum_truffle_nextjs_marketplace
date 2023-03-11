import { useState } from 'react';
import { CourseList, CourseCard } from '@/components/ui/course';
import { getAllCourses } from '@/content/courses/fetcher';
import { useWallet, useOwnedCourses } from '@/components/hooks/web3';

import { OrderModal } from '@/components/ui/order';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { useWeb3 } from '@components/providers/web3';
import CardFooter from '@/components/ui/course/card/CardFooter';

export default function Marketplace({ courses }) {
  const [course, setCourse] = useState(null);
  const { web3, contract, requireInstall } = useWeb3();
  const { account, hasConnectedWallet, isConnecting } = useWallet();
  const { ownedCourses } = useOwnedCourses(courses, account?.data);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const onPurchase = (course) => setCourse(course);
  const onClose = () => {
    setCourse(null);
    setIsNewPurchase(true);
  };

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

    if (isNewPurchase) {
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
      await _purchaseCourse(hexCourseId, proof, order);
    }

    if (!isNewPurchase) {
      await _repurchaseCourse(orderHash, order);
    }
  };

  const onRepurchase = (course) => {
    setIsNewPurchase(false);
    setCourse(course);
  };

  const _purchaseCourse = async (hexCourseId, proof, order) => {
    try {
      await contract.methods.purchaseCourse(hexCourseId, proof).send({
        from: account.data,
        value: web3.utils.toWei(String(order.price), 'ether'),
      });
    } catch (error) {
      console.error(`Purchase course failed: ${error}`);
    }
  };

  const _repurchaseCourse = async (orderHash, order) => {
    console.log('repurchase', account.data, order.price, orderHash);
    try {
      await contract.methods.repurchaseCourse(orderHash).send({
        from: account.data,
        value: web3.utils.toWei(String(order.price), 'ether'),
      });
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
            hasConnectedWallet={hasConnectedWallet}
            owned={ownedCourses.lookup[course?.id]}
          >
            <CardFooter
              course={course}
              hasConnectedWallet={hasConnectedWallet}
              onPurchase={onPurchase}
              onRepurchase={onRepurchase}
              isConnecting={isConnecting}
              ownedCourses={ownedCourses}
              owned={ownedCourses.lookup[course?.id]}
              requireInstall={requireInstall}
            />
          </CourseCard>
        )}
      </CourseList>
      {course && (
        <OrderModal
          isNewPurchase={isNewPurchase}
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
