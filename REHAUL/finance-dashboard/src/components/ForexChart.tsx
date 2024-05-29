import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ForexDisplayProps {
    fromCurrency: string;
    toCurrency: string;
    apiKey: string;
}

interface ExchangeRateData {
    exchangeRate: number;
    timestamp: string;
}

interface HistoricalDataPoint {
    time: string;
    exchangeRate: number;
}

const fetchTraderMadeFXRate = async (
    fromCurrency: string,
    toCurrency: string,
    apiKey: string
): Promise<ExchangeRateData[]> => {
    const url = `https://marketdata.tradermade.com/api/v1/live?currency=${fromCurrency}${toCurrency}&api_key=${apiKey}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
        throw new Error(`Status: ${response.status}`);
    }

    const data = response.data;
    if (!data || !data.quotes) {
        throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
    }

    return data.quotes.map((quote: any) => ({
        exchangeRate: parseFloat(quote.mid),
        timestamp: quote.timestamp,
    }));
};

const ForexChart: React.FC<ForexDisplayProps> = ({
    fromCurrency,
    toCurrency,
    apiKey,
}) => {
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
        []
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lastFetch = localStorage.getItem("forex_last_fetch");
                const currentTime = new Date().getTime();

                let historicalData: HistoricalDataPoint[] = [];
                const cachedHistoricalData = localStorage.getItem(
                    "forex_historical_data"
                );
                if (cachedHistoricalData) {
                    historicalData = JSON.parse(cachedHistoricalData);
                }

                if (lastFetch && currentTime - parseInt(lastFetch) < 3600000) {
                    setHistoricalData(historicalData);
                    return;
                }

                const data = await fetchTraderMadeFXRate(
                    fromCurrency,
                    toCurrency,
                    apiKey
                );

                const newHistoricalData = data.map((point) => ({
                    time: new Date(point.timestamp * 1000).toISOString(),
                    exchangeRate: point.exchangeRate,
                }));

                historicalData = [...historicalData, ...newHistoricalData];
                localStorage.setItem(
                    "forex_historical_data",
                    JSON.stringify(historicalData)
                );
                localStorage.setItem(
                    "forex_last_fetch",
                    currentTime.toString()
                );
                setHistoricalData(historicalData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [fromCurrency, toCurrency, apiKey]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "2-digit",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
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
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={historicalData}
                    margin={{
                        top: 15,
                        right: 15,
                        left: 15,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="time" tickFormatter={formatDate} />
                    <YAxis domain={["dataMin", "dataMax"]} scale="linear" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="exchangeRate"
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

export default ForexChart;