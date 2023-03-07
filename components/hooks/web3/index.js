import { useHooks } from '@components/providers/web3';

const _isEmpty = (obj) =>
  obj == null ||
  ((typeof obj === 'string' || Array.isArray(obj)) && obj.length === 0) ||
  (typeof obj === 'object' && Object.keys(obj).length === 0);

const enhanceHooks = (swrResponse) => {
  const { data, error } = swrResponse;
  const hasInitialized = !!(data || error);

  const isEmpty = hasInitialized && _isEmpty(data);

  return {
    ...swrResponse,
    hasInitialized,
    isEmpty,
  };
};

export const useAccount = () => {
  const swr = enhanceHooks(useHooks((hooks) => hooks.useAccount)());
  return {
    account: swr,
  };
};

export const useNetwork = () => {
  const swr = enhanceHooks(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: swr,
  };
};

export const useOwnedCourse = (...args) => {
  const resp = enhanceHooks(useHooks((hooks) => hooks.useOwnedCourse)(...args));
  return {
    ownedCourse: resp,
  };
};

export const useOwnedCourses = (...args) => {
  const resp = enhanceHooks(
    useHooks((hooks) => hooks.useOwnedCourses)(...args)
  );
  return {
    ownedCourse: resp,
  };
};

export const useWallet = () => {
  const { account } = useAccount();
  const { network } = useNetwork();

  const canPurchase = !!(account.data && network.isSupported);

  return {
    account,
    network,
    canPurchase,
  };
};
