import { Hero } from '@/components/ui/common';
import { CourseList, CourseCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import { getAllCourses } from '@/content/courses/fetcher';

export default function Home({ courses }) {
  return (
    <>
      <Hero />
      <CourseList courses={courses}>
        {(course) => <CourseCard key={course.slug} course={course} />}
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
