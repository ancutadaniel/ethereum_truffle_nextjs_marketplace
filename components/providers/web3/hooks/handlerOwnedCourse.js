import useSWR from 'swr';
import { normalizeOwnedCourse } from '@utils/normalize';

export const handlerOwnedCourse = (web3, contract) => (courses, account) => {
  const swrResp = useSWR(
    () => (web3 && contract && account ? `web3/ownedCourses${account}` : null),
    async () => {
      const ownedCourses = [];
      for (const course of courses) {
        if (!course.id) continue;

        const courseHash = web3.utils.soliditySha3(
          {
            type: 'bytes16',
            value: web3.utils.utf8ToHex(course.id),
          },
          {
            type: 'address',
            value: account,
          }
        );
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

  return { ...swrResp };
};
