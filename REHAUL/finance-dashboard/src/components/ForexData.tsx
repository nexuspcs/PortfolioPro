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
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

interface ForexQuote {
    date: string;
    close: number;
}

const exchangeRatePairs = [
    "AUDUSD",
    "EURUSD",
    "GBPUSD",
    "USDAUD",
    "USDJPY",
    "USDCAD",
    "USDCHF",
    "AUDCNY",
    "USDCNY"
];

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const MAX_RETRIES = 3; // Maximum number of retries for API calls

const ForexDataChart: React.FC = () => {
    const [data, setData] = useState<ForexQuote[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPair, setSelectedPair] = useState<string>(() => {
        const savedPair = localStorage.getItem("selectedPair");
        return savedPair ? savedPair : "AUDUSD";
    });

    const fetchData = async (bypassCache = false, retryCount = 0) => {
        const cacheKey = `forexData_${selectedPair}`;
        const cachedData = localStorage.getItem(cacheKey);
        const now = dayjs();

        if (!bypassCache && cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (now.diff(dayjs(timestamp)) < CACHE_DURATION) {
                setData(data);
                setLoading(false);
                return;
            }
        }

        setLoading(true); // Set loading to true when a new request is initiated

        // Set a timeout to fallback to cached data if loading takes too long
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                if (cachedData) {
                    const { data } = JSON.parse(cachedData);
                    setData(data);
                }
                setLoading(false);
                setError("Loading took too long, reverted to cached data");
            }
        }, 5000);

        const promises = [];
        const today = dayjs();
        for (let i = 0; i < 7; i++) {
            const date = today.subtract(i, "day").format("YYYY-MM-DD");
            const url = `https://marketdata.tradermade.com/api/v1/historical?api_key=Ou7HsjMs4uhJyQp2pM6_&currency=${selectedPair}&date=${date}`;
            promises.push(axios.get(url));
        }

        try {
            const responses = await Promise.all(promises);
            const quotes = responses.map((response, index) => ({
                date: today.subtract(index, "day").format("YYYY-MM-DD"),
                close: response.data.quotes[0].close,
            }));
            setData(quotes.reverse());
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: quotes }));
            setLoading(false); // Set loading to false when data is received
            clearTimeout(loadingTimeout); // Clear the timeout if data is received in time
        } catch (err) {
            if (err.response && err.response.status === 503 && retryCount < MAX_RETRIES) {
                // Retry the API call if status code is 503 and retry limit is not reached
                setTimeout(() => fetchData(bypassCache, retryCount + 1), 1000); // Retry after 1 second
            } else {
                setError(err.message);
                setLoading(false); // Set loading to false on error
                clearTimeout(loadingTimeout); // Clear the timeout on error
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedPair]);

    const handlePairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPair = event.target.value;
        setSelectedPair(newPair);
        localStorage.setItem("selectedPair", newPair);
        fetchData(true); // Bypass cache when pair changes
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
                    <label htmlFor="pair-select"></label>
                    <select
                        id="pair-select"
                        value={selectedPair}
                        onChange={handlePairChange}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            backgroundColor: "#2c2c2c",
                            color: "#fff",
                            fontSize: "16px",
                        }}
                    >
                        {exchangeRatePairs.map((pair) => (
                            <option key={pair} value={pair}>
                                {pair}
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
                    ) : error ? (
                        <div>Error: {error}</div>
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
                                        dayjs(date).format("Do MMM YYYY")
                                    }
                                />
                                <YAxis
                                    domain={["dataMin", "dataMax"]}
                                    scale={"linear"}
                                    tickFormatter={(value) => value.toFixed(3)}
                                />
                                <Tooltip
                                    formatter={(value) => value.toFixed(4)}
                                    labelFormatter={(date) =>
                                        dayjs(date).format("Do MMM YYYY")
                                    }
                                    contentStyle={{ backgroundColor: "#fff" }}
                                    labelStyle={{ color: "#000" }}
                                />
                                {/* <Legend /> */}
                                <Line
                                    type="monotone"
                                    dataKey="close"
                                    name="Exchange Rate"
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

export default ForexDataChart;