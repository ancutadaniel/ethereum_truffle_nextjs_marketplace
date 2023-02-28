import { Modal } from '@/components/ui/common';
import {
  CourseHero,
  CourseKeyPoints,
  CourseLectures,
} from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import { getAllCourses } from '@/content/courses/fetcher';

export default function Course({ course }) {
  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description}
        image={course.coverImage}
      />
      <CourseKeyPoints points={course.wsl} />
      <CourseLectures locked={true} />
      <Modal />
    </>
  );
}

Course.Layout = BaseLayout;

export function getStaticPaths() {
  const { data } = getAllCourses();
  return {
    paths: data.map((course) => ({
      params: {
        slug: course.slug,
      },
    })),
    fallback: false, // false means other routes should 404.
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();
  return {
    props: {
      course: data.find((course) => course.slug === params.slug),
    },
  };
}
