import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ForexChart = ({ fromCurrency, toCurrency }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForexData = async () => {
            try {
                const result = await axios.get(`https://api.tiingo.com/tiingo/fx/${fromCurrency}${toCurrency}/prices`, {
                    params: {
                        token: '4afdccac5ca312e048ad680a9d04137338af275c', // Replace with your actual API key
                        resampleFreq: '1day'
                    }
                });
                const chartData = result.data.map(item => ({
                    date: item.date.split('T')[0], // Extract date part only
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }));
                setData(chartData);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching Forex data:', error);
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