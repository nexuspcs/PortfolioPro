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

const ForexDisplay: React.FC<ForexDisplayProps> = ({ fromCurrency, toCurrency, apiKey }) => {
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLatestFXRate = async (fromCurrency: string, toCurrency: string, apiKey: string) => {
      try {
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

        setExchangeRateData({
          exchangeRate: exchangeRateData['5. Exchange Rate'],
          lastRefreshed: exchangeRateData['6. Last Refreshed'],
          bidPrice: exchangeRateData['8. Bid Price'],
          askPrice: exchangeRateData['9. Ask Price']
        });
      } catch (err: any) {
        setError(err.message);
      }
    };

    getLatestFXRate(fromCurrency, toCurrency, apiKey);
  }, [fromCurrency, toCurrency, apiKey]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exchangeRateData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Forex Exchange Rate</h1>
      <p>Exchange Rate: {exchangeRateData.exchangeRate}</p>
      <p>Last Refreshed: {exchangeRateData.lastRefreshed}</p>
      <p>Bid Price: {exchangeRateData.bidPrice}</p>
      <p>Ask Price: {exchangeRateData.askPrice}</p>
    </div>
  );
};

export default ForexDisplay;