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

const timeScales = [
    { label: "Intraday", value: "INTRADAY", function: "TIME_SERIES_INTRADAY", interval: "60min" },
    { label: "Daily", value: "DAILY", function: "TIME_SERIES_DAILY" },
    { label: "Weekly", value: "WEEKLY", function: "TIME_SERIES_WEEKLY" },
    { label: "Monthly", value: "MONTHLY", function: "TIME_SERIES_MONTHLY" }
];

const StockChart: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStock, setSelectedStock] = useState<string>(() => {
        const savedStock = localStorage.getItem("selectedStockChartTicker");
        return savedStock ? savedStock : "AA";
    });
    const [selectedTimeScale, setSelectedTimeScale] = useState<string>(() => {
        const savedTimeScale = localStorage.getItem("selectedStockChartTimeScale");
        return savedTimeScale ? savedTimeScale : "DAILY";
    });

    const fetchStockData = async (symbol: string, timeScale: any) => {
        setLoading(true); // Set loading to true when a new request is initiated
        try {
            let url = `https://www.alphavantage.co/query?function=${timeScale.function}&symbol=${symbol}&apikey=MDBBZ5B94SCT9Z83`;
            if (timeScale.value === "INTRADAY") {
                url += `&interval=${timeScale.interval}`;
            }
            const result = await axios.get(url);
            const timeSeriesKey = timeScale.value === "INTRADAY" ? `Time Series (${timeScale.interval})` : `Time Series (${timeScale.label})`;
            const timeSeries = result.data[timeSeriesKey];
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
        const selectedTimeScaleObj = timeScales.find(ts => ts.value === selectedTimeScale);
        fetchStockData(selectedStock, selectedTimeScaleObj);
    }, [selectedStock, selectedTimeScale]);

    const handleStockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStock = event.target.value;
        setSelectedStock(newStock);
        localStorage.setItem("selectedStockChartTicker", newStock);
    };

    const handleTimeScaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newTimeScale = event.target.value;
        setSelectedTimeScale(newTimeScale);
        localStorage.setItem("selectedStockChartTimeScale", newTimeScale);
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
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    <div>
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
                    <div>
                        <label htmlFor="time-scale-select"></label>
                        <select
                            id="time-scale-select"
                            value={selectedTimeScale}
                            onChange={handleTimeScaleChange}
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                backgroundColor: "#2c2c2c",
                                color: "#fff",
                                fontSize: "16px",
                            }}
                        >
                            {timeScales.map((scale) => (
                                <option key={scale.value} value={scale.value}>
                                    {scale.label}
                                </option>
                            ))}
                        </select>
                    </div>
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