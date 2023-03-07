import { Message, Modal } from '@/components/ui/common';
import {
  CourseHero,
  CourseKeyPoints,
  CourseLectures,
} from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import { getAllCourses } from '@/content/courses/fetcher';
import { useOwnedCourse, useAccount } from '@/components/hooks/web3';
import { useWeb3 } from '@/components/providers/web3';
export default function Course({ course }) {
  const { isLoading } = useWeb3();
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account?.data);
  const courseState = ownedCourse?.data?.state;
  const isLocked = courseState !== 'ACTIVATED' || !courseState;

  const messageProps = {
    PURCHASED: {
      type: 'warning',
      content:
        'You have purchased this course. Please wait for the owner to approve it, process may take up to 24 hours.',
    },
    ACTIVATED: { type: 'success', content: 'Enjoy your course!' },
    DEACTIVATED: {
      type: 'danger',
      content: 'Course has been deactivated by the owner due to some issues.',
    },
  }[courseState];

  const courseData = messageProps && (
    <div className='max-w-5xl mx-auto'>
      <Message type={messageProps.type}>
        {messageProps.content}
        {courseState !== 'ACTIVATED' && (
          <i className='block font-normal'>
            In case of any issues, please contact us at test@test.com
          </i>
        )}
      </Message>
    </div>
  );

  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description}
        image={course.coverImage}
        hasOwner={!!ownedCourse?.data}
      />
      <CourseKeyPoints points={course.wsl} />
      {courseData}
      <CourseLectures
        locked={isLocked}
        courseState={courseState}
        isLoading={isLoading}
      />
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
