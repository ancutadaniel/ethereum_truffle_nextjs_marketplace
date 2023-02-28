import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import setupHooks from './hooks/setupHooks';

export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null,
    account: null,
    isLoading: true,
    hooks: setupHooks(),
  });

  const loadProvider = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const web3 = new Web3(provider);
        setWeb3Api({
          web3,
          provider,
          contract: null,
          isLoading: false,
          hooks: setupHooks(web3),
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setWeb3Api((prevState) => ({ ...prevState, isLoading: false }));
      console.log('Please install MetaMask!');
    }
  };

  const connectWallet = async () => {
    try {
      await web3Api.provider.request({
        method: 'eth_requestAccounts',
      });
    } catch (error) {
      console.error(`Cannot connect MetaMask: ${error}`);
      location.reload();
    }
  };

  useEffect(() => {
    loadProvider();
  }, []);

  const value = useMemo(
    () => ({
      ...web3Api,
      requireInstall: !web3Api.isLoading && !web3Api.web3,
      hooks: web3Api.hooks,
      connect: web3Api.provider
        ? connectWallet
        : () => {
            console.log('Cannot connect MetaMask, try to reload the page.');
          },
    }),
    [web3Api]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3Provider;

export const useWeb3 = () => {
  const web3 = useContext(Web3Context);

  if (!web3) {
    throw new Error('Web3 is not initialized');
  }

  return web3;
};

// useHooks.js is a custom hook that allows us to use the hooks from the web3 provider
export const useHooks = (cb) => {
  const { hooks } = useWeb3();
  return cb(hooks);
};
