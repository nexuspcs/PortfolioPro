import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const StockChart: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStock, setSelectedStock] = useState<string>(() => {
        const savedStock = localStorage.getItem("selectedStockChartTicker");
        return savedStock ? savedStock : "AA";
    });

    const fetchStockData = async (symbol: string) => {
        setLoading(true); // Set loading to true when a new request is initiated
        try {
            const result = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=5V8PAFDNEI2TCF9L`);
            const timeSeries = result.data['Time Series (Daily)'];
            const chartData = Object.keys(timeSeries).map(date => ({
                date,
                open: parseFloat(timeSeries[date]['1. open']),
                high: parseFloat(timeSeries[date]['2. high']),
                low: parseFloat(timeSeries[date]['3. low']),
                close: parseFloat(timeSeries[date]['4. close']),
            }));
            setData(chartData.reverse());
            setLoading(false); // Set loading to false when data is received
        } catch (err) {
            console.error("Error fetching stock data:", err);
            setLoading(false); // Set loading to false on error
        }
    };

    useEffect(() => {
        fetchStockData(selectedStock);
    }, [selectedStock]);

    const handleStockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStock = event.target.value;
        setSelectedStock(newStock);
        localStorage.setItem("selectedStockChartTicker", newStock);
    };

    const getStoredStocks = () => {
        const stocks = JSON.parse(localStorage.getItem('stocks') || '[]');
        return stocks.map((stock: { ticker: string }) => stock.ticker);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="stock-select"></label>
                    <select
                        id="stock-select"
                        value={selectedStock}
                        onChange={handleStockChange}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            backgroundColor: "#2c2c2c",
                            color: "#fff",
                            fontSize: "16px",
                        }}
                    >
                        {getStoredStocks().map((ticker) => (
                            <option key={ticker} value={ticker}>
                                {ticker}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ width: "400px", height: "400px" }}>
                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            Loading...
                        </div> // Display loading message or spinner
                    ) : (
                        <ResponsiveContainer>
                            <LineChart data={data}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => dayjs(date).format("Do MMM YYYY")}
                                />
                                <YAxis domain={['dataMin', 'dataMax']} scale={"linear"} />
                                <Tooltip
                                    formatter={(value) => value.toFixed(4)}
                                    labelFormatter={(date) => dayjs(date).format("Do MMM YYYY")}
                                    contentStyle={{ backgroundColor: "#fff" }}
                                    labelStyle={{ color: "#000" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="close"
                                    name="Closing Price"
                                    stroke="#82ca9d"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockChart;