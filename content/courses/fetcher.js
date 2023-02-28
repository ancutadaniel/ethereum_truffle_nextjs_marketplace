import courses from './index.json';

export const getAllCourses = () => {
  return {
    data: courses,
    courseMap: courses.reduce((a, c, i) => {
      a[c.id] = c;
      a[c.id].index = i;
      return a;
    }, {}),
  };
};
//  a = { 1: { id: 1, title: '...', index: 0 }, 2: { id: 2, title: '...', index: 1 } }
