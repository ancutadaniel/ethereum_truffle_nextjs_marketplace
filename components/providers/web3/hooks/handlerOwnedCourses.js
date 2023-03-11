import useSWR from 'swr';
import { normalizeOwnedCourse } from '@utils/normalize';
import { createCourseHash } from '@utils/createCourseHash';

export const handlerOwnedCourses = (web3, contract) => (courses, account) => {
  const swrResp = useSWR(
    () => (web3 && contract && account ? `web3/ownedCourses/${account}` : null),
    async () => {
      const ownedCourses = [];
      for (const course of courses) {
        if (!course.id) continue;
        const courseHash = createCourseHash(web3, course.id, account);

        const ownedCourse = await contract.methods
          .getCourseByHash(courseHash)
          .call();

        if (
          ownedCourse.owner !== '0x0000000000000000000000000000000000000000'
        ) {
          const normalizeData = normalizeOwnedCourse(web3)(course, ownedCourse);

          ownedCourses.push(normalizeData);
        }
      }

      return ownedCourses;
    }
  );

  return {
    ...swrResp,
    lookup:
      swrResp.data?.reduce((acc, course) => {
        acc[course.id] = course;
        return acc;
      }, {}) ?? {},
  };
};
