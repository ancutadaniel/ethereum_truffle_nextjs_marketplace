import { OwnedCourseCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { Button, Message } from '@/components/ui/common';
import { useAccount, useOwnedCourse } from '@/components/hooks/web3';
import { getAllCourses } from '@/content/courses/fetcher';

const OwnedCourses = ({ courses }) => {
  const { account } = useAccount();

  const { ownedCourse } = useOwnedCourse(courses, account?.data);

  return (
    <>
      <MarketplaceHeader />
      <section className='grid grid-cols-1'>
        {ownedCourse?.data?.map((course) => (
          <OwnedCourseCard key={course.id} course={course}>
            {/* <Message>My custom message!</Message> */}
            <Button>Watch the course</Button>
          </OwnedCourseCard>
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
