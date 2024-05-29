import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForexData: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('https://marketdata.tradermade.com/api/v1/historical?api_key=ftlbKUoHBSCOuRGoNB3q&currency=AUDUSD&date=2024-05-22')
            .then(response => {
                setData(response.data.quotes[0]);
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Date: 2024-05-22</p>
            <p>Base Currency: {data.base_currency}</p>
            <p>Quote Currency: {data.quote_currency}</p>
            <p>Open: {data.open}</p>
            <p>High: {data.high}</p>
            <p>Low: {data.low}</p>
            <p>Close: {data.close}</p>
        </div>
    );
};

export default ForexData;