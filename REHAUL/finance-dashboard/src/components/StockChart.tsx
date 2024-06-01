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
    { label: "Intraday", value: "INTRADAY", interval: "minute", timespan: "minute", multiplier: 60 },
    { label: "Daily", value: "DAILY", timespan: "day", multiplier: 1 },
    { label: "Weekly", value: "WEEKLY", timespan: "week", multiplier: 1 },
    { label: "Monthly", value: "MONTHLY", timespan: "month", multiplier: 1 }
];

const StockChart: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStock, setSelectedStock] = useState<string>(() => {
        const savedStock = localStorage.getItem("selectedStockChartTicker");
        return savedStock ? savedStock : "AAPL";
    });
    const [selectedTimeScale, setSelectedTimeScale] = useState<string>(() => {
        const savedTimeScale = localStorage.getItem("selectedStockChartTimeScale");
        return savedTimeScale ? savedTimeScale : "DAILY";
    });

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchStockData = async (symbol: string, timeScale: any, retries = 3, delayTime = 1000) => {
        setLoading(true); // Set loading to true when a new request is initiated
        try {
            const now = dayjs();
            const from = timeScale.value === "INTRADAY" ? now.subtract(1, 'day').toISOString() : now.subtract(1, 'year').toISOString();
            const to = now.toISOString();
            
            let url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${timeScale.multiplier}/${timeScale.timespan}/${from}/${to}?apiKey=AFv47nwMc9Mtc6PuU05nTvcg16Fajj0e`;

            const result = await axios.get(url);
            const timeSeries = result.data.results;
            const chartData = timeSeries.map((item: any) => ({
                date: dayjs(item.t).format("YYYY-MM-DD HH:mm:ss"),
                open: item.o,
                high: item.h,
                low: item.l,
                close: item.c,
            }));
            setData(chartData);
            setLoading(false); // Set loading to false when data is received
        } catch (err) {
            if (retries === 0) {
                console.error("Error fetching stock data:", err);
                setLoading(false); // Set loading to false on error
            } else {
                await delay(delayTime);
                fetchStockData(symbol, timeScale, retries - 1, delayTime * 2); // Exponential backoff
            }
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