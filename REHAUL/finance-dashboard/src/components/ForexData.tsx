import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

interface ForexQuote {
  date: string;
  close: number;
}

const exchangeRatePairs = ['AUDUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'USDCHF'];

const ForexDataChart: React.FC = () => {
  const [data, setData] = useState<ForexQuote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPair, setSelectedPair] = useState<string>('AUDUSD');

  useEffect(() => {
    const fetchData = async () => {
      const promises = [];
      const today = dayjs();
      for (let i = 0; i < 7; i++) {
        const date = today.subtract(i, 'day').format('YYYY-MM-DD');
        const url = `https://marketdata.tradermade.com/api/v1/historical?api_key=ftlbKUoHBSCOuRGoNB3q&currency=${selectedPair}&date=${date}`;
        promises.push(axios.get(url));
      }

      try {
        const responses = await Promise.all(promises);
        const quotes = responses.map((response, index) => ({
          date: today.subtract(index, 'day').format('YYYY-MM-DD'),
          close: response.data.quotes[0].close,
        }));
        setData(quotes.reverse());
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [selectedPair]);

  const handlePairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPair(event.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="pair-select">Select Exchange Rate Pair: </label>
        <select id="pair-select" value={selectedPair} onChange={handlePairChange}>
          {exchangeRatePairs.map((pair) => (
            <option key={pair} value={pair}>
              {pair}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => dayjs(date).format('Do MMM YYYY')} />
          <YAxis domain={['dataMin', 'dataMax']} tickFormatter={(value) => value.toFixed(2)} />
          <Tooltip
            formatter={(value) => value.toFixed(4)}
            labelFormatter={(date) => dayjs(date).format('Do MMM YYYY')}
            contentStyle={{ backgroundColor: '#fff' }}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            name="Exchange Rate"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForexDataChart;