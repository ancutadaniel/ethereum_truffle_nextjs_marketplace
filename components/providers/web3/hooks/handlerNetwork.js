import { useEffect } from 'react';
import useSWR from 'swr';

const networkMap = {
  1: 'Ethereum Main Network',
  5: 'Goerli',
  42: 'Kovan',
  1337: 'Ganache',
  137: 'Matic',
  56: 'Binance Smart Chain',
};

const targetNetwork = networkMap[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID];

export const handlerNetwork = (web3) => () => {
  const { data, error, mutate, ...swrResponse } = useSWR(
    () => (web3 ? 'web3/network' : null),
    async () => {
      const chainId = await web3.eth.getChainId();

      if (!chainId || !networkMap[chainId]) {
        throw new Error(
          'Unsupported network. Please connect to supported network.'
        );
      }

      return networkMap[chainId];
    }
  );

  const mutator = (chainId) => mutate(networkMap[chainId] ?? null);

  useEffect(() => {
    window?.ethereum?.on('chainChanged', mutator);

    return () => {
      window?.ethereum?.removeListener('chainChanged', mutator);
    };
  }, [web3]);

  return {
    data,
    error,
    targetNetwork,
    isSupported: data === targetNetwork,
    mutate,
    ...swrResponse,
  };
};
