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
