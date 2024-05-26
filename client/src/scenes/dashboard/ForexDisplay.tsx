import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

interface HistoricalDataPoint {
  time: string;
  exchangeRate: number;
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
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastFetch = localStorage.getItem('forex_last_fetch');
        const currentTime = new Date().getTime();

        let historicalData: HistoricalDataPoint[] = [];
        const cachedHistoricalData = localStorage.getItem('forex_historical_data');
        if (cachedHistoricalData) {
          historicalData = JSON.parse(cachedHistoricalData);
        }

        if (lastFetch && currentTime - parseInt(lastFetch) < 3600000) {
          setHistoricalData(historicalData);
          return;
        }

        const data = await getLatestFXRate(fromCurrency, toCurrency, apiKey);
        const newHistoricalDataPoint = {
          time: data.lastRefreshed,
          exchangeRate: parseFloat(data.exchangeRate),
        };

        historicalData = [...historicalData, newHistoricalDataPoint];
        localStorage.setItem('forex_historical_data', JSON.stringify(historicalData));
        localStorage.setItem('forex_last_fetch', currentTime.toString());
        setHistoricalData(historicalData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [fromCurrency, toCurrency, apiKey]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (historicalData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h1>Forex Pair Data</h1> */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={historicalData}
          margin={{
            top: 15,
            right: 15,
            left: 15,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="time" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="exchangeRate" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForexData;