import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import setupHooks from './hooks/setupHooks';
import CourseMarketplace from '@contracts/abi/CourseMarketplace.json';

export const Web3Context = createContext();

const createWeb3State = ({
  web3 = null,
  provider = null,
  contract = null,
  isLoading = true,
  error = null,
}) => ({
  web3,
  provider,
  contract,
  isLoading,
  error,
  hooks: setupHooks({ web3, contract, provider }),
});

const setListener = (provider) => {
  provider.on('chainChanged', () => window.location.reload());
};

const Web3Provider = ({ children }) => {
  const [web3Api, setWeb3Api] = useState(createWeb3State({}));

  const loadProvider = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const web3 = new Web3(provider);
        setListener(provider);
        const getNetworkId = await web3.eth.net.getId();
        const data = await CourseMarketplace.networks[getNetworkId];
        if (!data) {
          setWeb3Api((prevState) =>
            createWeb3State({ ...prevState, web3, isLoading: false })
          );
          throw new Error('Smart contract not deployed to selected network');
        }

        const contract = new web3.eth.Contract(
          CourseMarketplace.abi,
          data.address
        );

        setWeb3Api(
          createWeb3State({ web3, provider, contract, isLoading: false })
        );
      } catch (error) {
        setWeb3Api((prevState) =>
          createWeb3State({ ...prevState, isLoading: false, error })
        );
      }
    } else {
      setWeb3Api((prevState) =>
        createWeb3State({ ...prevState, isLoading: false })
      );
      console.log('Please install MetaMask!');
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      await web3Api.provider.request({
        method: 'eth_requestAccounts',
      });
    } catch (error) {
      console.error(`Cannot connect MetaMask: ${error}`);
      location.reload();
    }
  }, [web3Api.provider]);

  // reload the page if the user changes the network

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
    [web3Api, connectWallet]
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
