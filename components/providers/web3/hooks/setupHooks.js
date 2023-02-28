import { handlerAccounts as createAccountHook } from './handlerAccount';
import { handlerNetwork as createNetworkHook } from './handlerNetwork';

const setupHooks = (web3) => {
  return {
    useAccount: createAccountHook(web3),
    useNetwork: createNetworkHook(web3),
  };
};

export default setupHooks;
