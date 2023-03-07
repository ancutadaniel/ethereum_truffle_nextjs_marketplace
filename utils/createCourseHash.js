export const createCourseHash = (web3, courseId, account) =>
  web3.utils.soliditySha3(
    {
      type: 'bytes16',
      value: web3.utils.utf8ToHex(courseId),
    },
    {
      type: 'address',
      value: account,
    }
  );
