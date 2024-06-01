import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
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

const ForexDataChart: React.FC = () => {
    const [data, setData] = useState<ForexQuote[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPair, setSelectedPair] = useState<string>(() => {
        const savedPair = localStorage.getItem("selectedPair");
        return savedPair ? savedPair : "AUDUSD";
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true when a new request is initiated
            const promises = [];
            const today = dayjs();
            for (let i = 0; i < 7; i++) {
                const date = today.subtract(i, "day").format("YYYY-MM-DD");
                const url = `https://marketdata.tradermade.com/api/v1/historical?api_key=whvB4NtWALlYqW9oHpmg&currency=${selectedPair}&date=${date}`;
                promises.push(axios.get(url));
            }

            try {
                const responses = await Promise.all(promises);
                const quotes = responses.map((response, index) => ({
                    date: today.subtract(index, "day").format("YYYY-MM-DD"),
                    close: response.data.quotes[0].close,
                }));
                setData(quotes.reverse());
                setLoading(false); // Set loading to false when data is received
            } catch (err) {
                setError(err.message);
                setLoading(false); // Set loading to false on error
            }
        };

        fetchData();
    }, [selectedPair]);

    const handlePairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPair = event.target.value;
        setSelectedPair(newPair);
        localStorage.setItem("selectedPair", newPair);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                                    domain={["dataMin", "dataMax"]} scale={"linear"}
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
