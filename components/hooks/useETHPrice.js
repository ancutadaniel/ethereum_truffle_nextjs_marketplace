import useSWR from 'swr';

const URL =
  'https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false';

export const COURSE_PRICE = 15;

const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.market_data.current_price.usd ?? null;
};

export const useETHPrice = () => {
  const swrResponse = useSWR(URL, fetcher, { refreshInterval: 10000 });

  const pricePerCourse = swrResponse?.data
    ? (COURSE_PRICE / Number(swrResponse.data)).toFixed(6)
    : null;

  return {
    ethPrice: { ...swrResponse },
    pricePerCourse,
  };
};
