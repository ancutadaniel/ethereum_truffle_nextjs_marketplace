export const COURSE_STATUS = {
  0: 'PURCHASED',
  1: 'ACTIVATED',
  2: 'DEACTIVATED',
};

export const normalizeOwnedCourse = (web3) => (course, ownedCourse) => ({
  ...course,
  ownedCourseId: ownedCourse.id,
  proof: ownedCourse.proof,
  owner: ownedCourse.owner,
  price: web3.utils.fromWei(ownedCourse.price, 'ether'),
  state: COURSE_STATUS[ownedCourse.state],
});
