import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForexData: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('https://marketdata.tradermade.com/api/v1/live?currency=EURUSD,GBPUSD,UK100&api_key=ftlbKUoHBSCOuRGoNB3q')
            .then(response => {
                setData(response.data.quotes);
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
            {data.map((quote: any, index: number) => (
                <div key={index}>
                    <p>{quote.ask}</p>
                </div>
            ))}
        </div>
    );
};

export default ForexData;
