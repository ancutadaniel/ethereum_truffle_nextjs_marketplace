import { useEffect } from 'react';
import useSWR from 'swr';

const adminAddress = {
  '0xa03ba4b45bf15515f4d536976ba55dc7f2a9b3cce740739d9b5fc8add056a614': true,
};

export const handlerAccounts = (web3) => () => {
  const { data, mutate, ...swrResponse } = useSWR(
    () => (web3 ? 'web3/accounts' : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    }
  );

  useEffect(() => {
    window.ethereum &&
      window.ethereum.on('accountsChanged', (accounts) =>
        mutate(accounts[0] ?? null)
      );
  }, [web3]);

  return {
    data,
    isAdmin: (data && adminAddress[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...swrResponse,
  };
};
