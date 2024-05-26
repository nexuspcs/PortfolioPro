import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ForexDisplayProps {
  fromCurrency: string;
  toCurrency: string;
  apiKey: string;
}

interface ExchangeRateData {
  exchangeRate: string;
  lastRefreshed: string;
  bidPrice: string;
  askPrice: string;
}

const getLatestFXRate = async (fromCurrency: string, toCurrency: string, apiKey: string): Promise<ExchangeRateData> => {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'axios' }
  });

  if (response.status !== 200) {
    throw new Error(`Status: ${response.status}`);
  }

  const data = response.data;
  if (!data['Realtime Currency Exchange Rate']) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  const exchangeRateData = data['Realtime Currency Exchange Rate'];

  return {
    exchangeRate: exchangeRateData['5. Exchange Rate'],
    lastRefreshed: exchangeRateData['6. Last Refreshed'],
    bidPrice: exchangeRateData['8. Bid Price'],
    askPrice: exchangeRateData['9. Ask Price']
  };
};

const ForexData: React.FC<ForexDisplayProps> = ({ fromCurrency, toCurrency, apiKey }) => {
  const [forexData, setForexData] = useState<ExchangeRateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastFetch = localStorage.getItem('forex_last_fetch');
        const currentTime = new Date().getTime();

        if (lastFetch && currentTime - parseInt(lastFetch) < 3600000) {
          const cachedData = localStorage.getItem('forex_data');
          if (cachedData) {
            setForexData(JSON.parse(cachedData));
            return;
          }
        }

        const data = await getLatestFXRate(fromCurrency, toCurrency, apiKey);
        localStorage.setItem('forex_data', JSON.stringify(data));
        localStorage.setItem('forex_last_fetch', currentTime.toString());
        setForexData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [fromCurrency, toCurrency, apiKey]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!forexData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Exchange Rate: {forexData.exchangeRate}, Last Refreshed: {forexData.lastRefreshed}, Bid Price: {forexData.bidPrice}, Ask Price: {forexData.askPrice}
    </div>
  );
};

export default ForexData;