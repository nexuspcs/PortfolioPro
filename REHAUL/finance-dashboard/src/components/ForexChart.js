import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ForexChart = ({ fromCurrency, toCurrency }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchForexData = async () => {
            const result = await axios.get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&apikey=demo`);
            const timeSeries = result.data['Time Series FX (Daily)'];
            const chartData = Object.keys(timeSeries).map(date => ({
                date,
                open: parseFloat(timeSeries[date]['1. open']),
                high: parseFloat(timeSeries[date]['2. high']),
                low: parseFloat(timeSeries[date]['3. low']),
                close: parseFloat(timeSeries[date]['4. close']),
            }));
            setData(chartData);
        };
        fetchForexData();
    }, [fromCurrency, toCurrency]);

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
