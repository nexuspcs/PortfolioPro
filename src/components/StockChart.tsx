
/**
 * Renders a stock chart component.
 * Fetches stock data from the Polygon API and displays it using Recharts.
 * Allows users to select a stock and time scale for the chart.
 */
import React, { useState, useEffect } from "react";
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
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

// Time scale options for the chart
const timeScales = [
    { label: "Daily", value: "DAILY", timespan: "day", multiplier: 1 },
    { label: "Weekly", value: "WEEKLY", timespan: "week", multiplier: 1 },
    { label: "Monthly", value: "MONTHLY", timespan: "month", multiplier: 1 },
];

// Cache duration for stock data in milliseconds
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour

/**
 * Retrieves the stored stocks from local storage.
 * @returns An array of stock tickers.
 */
const getStoredStocks = () => {
    const stocks = JSON.parse(localStorage.getItem("stocks") || "[]");
    return stocks.map((stock: { ticker: string }) => stock.ticker);
};

/**
 * Renders a stock chart component.
 */
const StockChart: React.FC = () => {
    // State variables
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<string>(() => {
        const savedStock = localStorage.getItem("selectedStockChartTicker");
        return savedStock ? savedStock : "AAPL";
    });
    const [selectedTimeScale, setSelectedTimeScale] = useState<string>(() => {
        const savedTimeScale = localStorage.getItem(
            "selectedStockChartTimeScale"
        );
        return savedTimeScale ? savedTimeScale : "DAILY";
    });
    const [storedStocks, setStoredStocks] = useState<string[]>(
        getStoredStocks()
    );

    /**
     * Delays execution for a specified number of milliseconds.
     * @param ms - The delay time in milliseconds.
     * @returns A promise that resolves after the specified delay.
     */
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * Fetches stock data from the Polygon API.
     * @param symbol - The stock symbol.
     * @param timeScale - The selected time scale for the chart.
     * @param bypassCache - Whether to bypass the cache and fetch fresh data.
     * @param retries - The number of retries in case of network errors.
     * @param delayTime - The initial delay time between retries.
     */
    const fetchStockData = async (
        symbol: string,
        timeScale: any,
        bypassCache = false,
        retries = 3,
        delayTime = 1000
    ) => {
        const cacheKey = `stockData_${symbol}_${timeScale.value}`;
        const cachedData = localStorage.getItem(cacheKey);
        const now = dayjs();

        if (!bypassCache && cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (now.diff(dayjs(timestamp)) < CACHE_DURATION) {
                setData(data);
                setLoading(null);
                return;
            }
        }

        setLoading(
            `Updating prices to match ${timeScale.label.toLowerCase()} timescale`
        );
        try {
            let from;
            let to = now.format("YYYY-MM-DD");

            switch (timeScale.value) {
                case "DAILY":
                    from = now.subtract(7, "day").format("YYYY-MM-DD");
                    break;
                case "WEEKLY":
                    from = now.subtract(7, "week").format("YYYY-MM-DD");
                    break;
                case "MONTHLY":
                    from = now.subtract(12, "month").format("YYYY-MM-DD");
                    break;
                default:
                    throw new Error("Invalid timespan");
            }

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
            localStorage.setItem(
                cacheKey,
                JSON.stringify({ timestamp: now, data: chartData })
            );
            setLoading(null); // Set loading to null when data is received
        } catch (err) {
            if (retries === 0) {
                console.error("Error fetching stock data:", err);
                setLoading(null); // Set loading to null on error
            } else {
                await delay(delayTime);
                fetchStockData(
                    symbol,
                    timeScale,
                    bypassCache,
                    retries - 1,
                    delayTime * 2
                ); // Exponential backoff
            }
        }
    };

    // Fetch stock data when selected stock or time scale changes
    useEffect(() => {
        const selectedTimeScaleObj = timeScales.find(
            (ts) => ts.value === selectedTimeScale
        );
        fetchStockData(selectedStock, selectedTimeScaleObj);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStock, selectedTimeScale]);

    // Update stored stocks when local storage changes
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "stocks") {
                setStoredStocks(getStoredStocks());
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Update stored stocks periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setStoredStocks(getStoredStocks());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /**
     * Handles the change event of the stock select input.
     * @param event - The change event.
     */
    const handleStockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStock = event.target.value;
        setSelectedStock(newStock);
        localStorage.setItem("selectedStockChartTicker", newStock);
        fetchStockData(
            newStock,
            timeScales.find((ts) => ts.value === selectedTimeScale),
            true
        ); // Bypass cache when stock changes
    };

    /**
     * Handles the change event of the time scale select input.
     * @param event - The change event.
     */
    const handleTimeScaleChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newTimeScale = event.target.value;
        setSelectedTimeScale(newTimeScale);
        localStorage.setItem("selectedStockChartTimeScale", newTimeScale);
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
                {storedStocks.length === 0 ? (
                    <div>Please add your stocks, by using the button above</div>
                ) : (
                    <>
                        <div
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
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
                                    {storedStocks.map((ticker) => (
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
                                        <option
                                            key={scale.value}
                                            value={scale.value}
                                        >
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
                                    {loading}
                                </div> // Display loading message or spinner
                            ) : (
                                <ResponsiveContainer>
                                    <LineChart data={data}>
                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) =>
                                                dayjs(date).format(
                                                    "Do MMM YYYY"
                                                )
                                            }
                                        />
                                        <YAxis
                                            domain={["dataMin", "dataMax"]}
                                            scale={"linear"}
                                        />
                                        <Tooltip
                                            formatter={(value: any) => {
                                                if (typeof value === "number") {
                                                    return value.toFixed(2);
                                                }
                                                return value;
                                            }}
                                            labelFormatter={(date) =>
                                                dayjs(date).format(
                                                    "Do MMM YYYY"
                                                )
                                            }
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                            }}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default StockChart;
