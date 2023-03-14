import { handlerAccounts as createAccountHook } from './handlerAccount';
import { handlerNetwork as createNetworkHook } from './handlerNetwork';
import { handlerOwnedCourses } from './handlerOwnedCourses';
import { handlerOwnedCourse } from './handlerOwnedCourse';
import { handlerAllCourses } from './handleAllCourses';

const setupHooks = ({ web3, contract }) => {
  return {
    useAccount: createAccountHook(web3),
    useNetwork: createNetworkHook(web3),
    useOwnedCourse: handlerOwnedCourse(web3, contract),
    useOwnedCourses: handlerOwnedCourses(web3, contract),
    useAllCourses: handlerAllCourses(web3, contract),
  };
};

export default setupHooks;
