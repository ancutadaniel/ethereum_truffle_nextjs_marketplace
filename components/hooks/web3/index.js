import { useHooks } from '@components/providers/web3';

const enhanceHooks = (swrResponse) => ({
  ...swrResponse,
  hasInitialized: swrResponse.data || swrResponse.error,
});

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
