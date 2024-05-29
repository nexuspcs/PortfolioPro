import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ForexChart = ({ fromCurrency, toCurrency }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('wss://api.tiingo.com/fx');

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            const subscribe = {
                eventName: 'subscribe',
                authorization: '4afdccac5ca312e048ad680a9d04137338af275c', // Replace with your actual API key
                eventData: {
                    thresholdLevel: 5,
                    tickers: fromCurrency && toCurrency ? [`${fromCurrency}${toCurrency}`] : ['*']
                }
            };
            ws.current.send(JSON.stringify(subscribe));
        };

        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message && message.data && message.data.length > 0) {
                    const [messageType, ticker, timestamp, bidSize, bidPrice, askPrice, askSize] = message.data;
                    const date = new Date(timestamp).toISOString().split('T')[0];
                    const close = (bidPrice + askPrice) / 2;

                    setData((prevData) => [
                        ...prevData,
                        { date, close }
                    ]);
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        ws.current.onerror = (event) => {
            setError('WebSocket error');
            console.error('WebSocket error:', event);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
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
