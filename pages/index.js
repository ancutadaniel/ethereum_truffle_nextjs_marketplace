import { Hero } from '@/components/ui/common';
import { CourseList, CourseCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import { getAllCourses } from '@/content/courses/fetcher';
import { useWallet } from '@/components/hooks/web3';

export default function Home({ courses }) {
  const { canPurchase } = useWallet();
  return (
    <>
      <Hero />
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            key={course.slug}
            course={course}
            canPurchase={canPurchase}
          />
        )}
      </CourseList>
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

Home.Layout = BaseLayout;
