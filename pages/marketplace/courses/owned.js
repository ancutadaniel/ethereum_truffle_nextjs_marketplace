import { OwnedCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { Button, Message } from '@/components/ui/common';
import { useAccount, useOwnedCourses } from '@/components/hooks/web3';
import { getAllCourses } from '@/content/courses/fetcher';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWeb3 } from '@/components/providers/web3';

const OwnedCourses = ({ courses }) => {
  const router = useRouter();
  const { account } = useAccount();

  const { ownedCourses } = useOwnedCourses(courses, account?.data);
  const { requireInstall } = useWeb3();

  return (
    <>
      <MarketplaceHeader />
      <section className='grid grid-cols-1'>
        {ownedCourses.isEmpty && (
          <div className='w-1/2'>
            <Message type='warning'>
              <p>You don't own any courses!!!</p>
              <Link href='/marketplace' legacyBehavior>
                <a className='font-normal hover:underline'>
                  <i>Purchase Course</i>
                </a>
              </Link>
            </Message>
          </div>
        )}
        {account.isEmpty && (
          <div className='w-1/2'>
            <Message type='warning'>
              <p>{account.error.message}</p>
            </Message>
          </div>
        )}
        {requireInstall && (
          <div className='w-1/2'>
            <Message type='warning'>
              <p>Please install MetaMask!</p>
            </Message>
          </div>
        )}
        {ownedCourses?.data?.map((course) => (
          <OwnedCard key={course.id} course={course}>
            <Button
              onClick={() => {
                router.push(`/courses/${course.slug}`);
              }}
            >
              Watch the course
            </Button>
          </OwnedCard>
        ))}
      </section>
    </>
  );
};

export async function getStaticProps() {
  const { data: courses } = await getAllCourses();

  return {
    props: {
      courses,
    },
  };
}

OwnedCourses.Layout = BaseLayout;

export default OwnedCourses;
