import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import axios from "axios";

type Stock = {
    ticker: string;
    quantity: number;
};

const PortfolioChart = () => {
    const [stocks, setStocks] = useState<Stock[]>(() => {
        const savedStocks = localStorage.getItem("stocks");
        return savedStocks ? JSON.parse(savedStocks) : [];
    });

    const [portfolioData, setPortfolioData] = useState([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [previousValue, setPreviousValue] = useState(0);

    const fetchStockPrices = async () => {
        const apiKey = "0LJLXUZ5CWO8OPTU";
        const today = new Date().toISOString().split("T")[0];
        const sevenDaysAgo = new Date(
            new Date().setDate(new Date().getDate() - 7)
        )
            .toISOString()
            .split("T")[0];
        let portfolioValue = 0;
        let portfolioPrevValue = 0;
        const stockDataPromises = stocks.map(async (stock) => {
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.ticker}&interval=30min&apikey=${apiKey}`
            );
            const timeSeries = response.data["Time Series (30min)"];
            const timeSeriesArray = Object.entries(timeSeries).map(
                ([date, prices]: any) => ({
                    date: new Date(date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }),
                    close: parseFloat(prices["4. close"]).toFixed(2),
                })
            );
            const recentPrices = timeSeriesArray.slice(0, 6); // Get recent prices (3-6 per day)
            const stockValue = stock.quantity * recentPrices[0].close;
            const stockPrevValue =
                stock.quantity * recentPrices[recentPrices.length - 1].close;
            portfolioValue += stockValue;
            portfolioPrevValue += stockPrevValue;
            return recentPrices.map((price: any) => ({
                date: price.date,
                [`${stock.ticker}`]: price.close,
                value: stock.quantity * price.close,
            }));
        });

        const stockData = await Promise.all(stockDataPromises);
        const mergedData = stockData.flat().reduce((acc: any, cur: any) => {
            const existingEntry = acc.find(
                (entry: any) => entry.date === cur.date
            );
            if (existingEntry) {
                existingEntry[cur.ticker] = cur[cur.ticker];
                existingEntry.value += cur.value;
            } else {
                acc.push(cur);
            }
            return acc;
        }, []);

        setPortfolioData(mergedData);
        setCurrentValue(portfolioValue);
        setPreviousValue(portfolioPrevValue);
    };

    useEffect(() => {
        const savedStocks = localStorage.getItem("stocks");
        if (savedStocks) {
            setStocks(JSON.parse(savedStocks));
        }
        fetchStockPrices();
    }, []);

    useEffect(() => {
        localStorage.setItem("stocks", JSON.stringify(stocks));
        fetchStockPrices();
    }, [stocks]);

    const calculateChange = () => {
        const change = currentValue - previousValue;
        const changePercent = (change / previousValue) * 100;
        return {
            change,
            changePercent,
        };
    };

    const { change, changePercent } = calculateChange();

    return (
        <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
            <h2>Portfolio Value Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin", "dataMax"]} />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        name="Value"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "20px" }}>
                <h3>Current Portfolio Value: ${currentValue.toFixed(2)}</h3>
                <h3
                    style={{
                        color: change > 0 ? "green" : "red",
                    }}
                >
                    24h Change: ${change.toFixed(2)} ({changePercent.toFixed(2)}
                    %)
                </h3>
            </div>
        </div>
    );
};

export default PortfolioChart;
