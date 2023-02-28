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
      return networkMap[chainId];
    }
  );

  useEffect(() => {
    window.ethereum &&
      window.ethereum.on(
        'chainChanged',
        (chainId) => mutate(networkMap[parseInt(chainId, 16)]) ?? null
      );
  }, [web3]);

  return {
    data,
    targetNetwork,
    isSupported: data === targetNetwork,
    mutate,
    ...swrResponse,
  };
};
