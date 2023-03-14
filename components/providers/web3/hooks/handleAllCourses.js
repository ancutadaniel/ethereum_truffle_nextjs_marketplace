import { normalizeOwnedCourse } from '@/utils/normalize';
import useSWR from 'swr';

export const handlerAllCourses = (web3, contract) => (account) => {
  const swrResp = useSWR(
    () =>
      web3 && contract && account.data && account.isAdmin
        ? `web3/allCourses/${account.data}`
        : null,
    async () => {
      const courses = [];
      // Get the total number of courses
      const courseCount = await contract.methods.getCourseCount().call();

      for (let i = Number(courseCount) - 1; i >= 0; i--) {
        const courseHash = await contract.methods.getCourseByIdx(i).call();
        let course = await contract.methods.getCourseByHash(courseHash).call();

        if (course) {
          course = normalizeOwnedCourse(web3)({ hash: courseHash }, course);
          courses.push(course);
        }
      }

      return courses;
    }
  );

  return { ...swrResp };
};
