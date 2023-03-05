import { handlerAccounts as createAccountHook } from './handlerAccount';
import { handlerNetwork as createNetworkHook } from './handlerNetwork';
import { handlerOwnedCourse } from './handlerOwnedCourse';

const setupHooks = ({ web3, contract }) => {
  return {
    useAccount: createAccountHook(web3),
    useNetwork: createNetworkHook(web3),
    useOwnedCourse: handlerOwnedCourse(web3, contract),
  };
};

export default setupHooks;
