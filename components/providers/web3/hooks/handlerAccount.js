import { useEffect } from 'react';
import useSWR from 'swr';

// To hash the address, we use the keccak256 function from web3 we add the address without the 0x prefix and we add the 0x prefix again, in the editor we select output as hex
const adminAddress = {
  '0xa03ba4b45bf15515f4d536976ba55dc7f2a9b3cce740739d9b5fc8add056a614': true,
};

// // Ganache account 0 hash
// const adminAddress = {
//   '0x197ebb36460b4701d9fd0cd5cfc33b810fea54aec8ea803e2ab8f15ab099959c': true,
// };

export const handlerAccounts = (web3) => () => {
  const { data, error, mutate, ...swrResponse } = useSWR(
    () => (web3 ? 'web3/accounts' : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error('No account found. Please connect your wallet.');
      }

      return account;
    }
  );

  const mutator = (accounts) => mutate(accounts[0] ?? null);

  useEffect(() => {
    window?.ethereum?.on('accountsChanged', mutator);

    return () => {
      window?.ethereum?.removeListener('accountsChanged', mutator);
    };
  }, [web3]);

  return {
    data,
    error,
    isAdmin: (data && adminAddress[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...swrResponse,
  };
};
