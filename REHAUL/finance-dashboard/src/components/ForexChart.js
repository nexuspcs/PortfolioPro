import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ForexChart = ({ fromCurrency, toCurrency }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForexData = async () => {
            try {
                const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
                const oneMonthAgo = now - 30 * 24 * 60 * 60; // timestamp for one month ago

                const response = await axios.get(`https://finnhub.io/api/v1/forex/candle`, {
                    params: {
                        symbol: `OANDA:${fromCurrency}_${toCurrency}`,
                        resolution: 'D',
                        from: oneMonthAgo,
                        to: now,
                        token: 'cpbf7u1r01qodesspvhgcpbf7u1r01qodesspvi0',
                    },
                });

                if (response.status === 403) {
                    throw new Error('Access forbidden: check your API key and permissions.');
                }

                if (response.data.s !== 'ok') {
                    throw new Error('Failed to fetch data');
                }

                const chartData = response.data.t.map((timestamp, index) => ({
                    date: new Date(timestamp * 1000).toISOString().split('T')[0],
                    open: response.data.o[index],
                    high: response.data.h[index],
                    low: response.data.l[index],
                    close: response.data.c[index],
                }));

                setData(chartData);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching forex data:', error);
            }
        };
        fetchForexData();
    }, [fromCurrency, toCurrency]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );
};

export default ForexChart;
