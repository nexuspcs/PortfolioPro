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

const PortfolioValue = () => {
    const [stocks, setStocks] = useState<Stock[]>(() => {
        const savedStocks = localStorage.getItem("stocks");
        return savedStocks ? JSON.parse(savedStocks) : [];
    });

    const [portfolioData, setPortfolioData] = useState([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [previousValue, setPreviousValue] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticker, setTicker] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchHistoricalPrices = async (ticker: string) => {
        const apiKey = "UJzQdAiZos0R6JChLBLNhmjXIMbu7OXV";
        const response = await axios.get(
            `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&timeseries=7&apikey=${apiKey}`
        );
        return response.data.historical;
    };

    const fetchStockPrices = async () => {
        if (stocks.length === 0) {
            setPortfolioData([]);
            setCurrentValue(0);
            setPreviousValue(0);
            return;
        }

        const apiKey = "UJzQdAiZos0R6JChLBLNhmjXIMbu7OXV";
        let portfolioValue = 0;
        let portfolioPrevValue = 0;
        const historicalDataPromises = stocks.map(async (stock) => {
            const historicalPrices = await fetchHistoricalPrices(stock.ticker);
            return historicalPrices.map((data) => ({
                date: data.date,
                ticker: stock.ticker,
                close: data.close,
                quantity: stock.quantity,
            }));
        });

        const historicalData = await Promise.all(historicalDataPromises);
        const flattenedData = historicalData.flat();

        const portfolioValueByDate = flattenedData.reduce((acc, cur) => {
            const existingEntry = acc.find((entry) => entry.date === cur.date);
            const stockValue = cur.quantity * cur.close;

            if (existingEntry) {
                existingEntry.value += stockValue;
            } else {
                acc.push({ date: cur.date, value: stockValue });
            }
            return acc;
        }, []);

        portfolioValueByDate.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        const currentPriceResponse = await axios.get(
            `https://financialmodelingprep.com/api/v3/quote/${stocks[0].ticker}?apikey=${apiKey}`
        );
        const currentPrice = currentPriceResponse.data[0].price;
        portfolioValue = stocks.reduce(
            (sum, stock) => sum + stock.quantity * currentPrice,
            0
        );

        setPortfolioData(portfolioValueByDate);
        setCurrentValue(portfolioValue);
        setPreviousValue(portfolioValueByDate[0]?.value || 0);
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
        const changePercent = (change / (previousValue || 1)) * 100;
        return {
            change,
            changePercent,
        };
    };

    const { change, changePercent } = calculateChange();

    const addButtonStyle = {
        padding: "15px 30px",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        transition: "background-color 0.3s ease",
        fontFamily: "'Inter', sans-serif",
    };

    const handleAddInitialStocks = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTicker("");
        setQuantity(0);
        setErrorMessage("");
    };

    const handleAddStock = () => {
        if (ticker === "" || quantity <= 0) {
            setErrorMessage("Please enter a valid ticker and quantity.");
            return;
        }
        const newStocks = [...stocks, { ticker, quantity }];
        setStocks(newStocks);
        closeModal();
    };

    const handleUpdateStock = (index: number, newQuantity: number) => {
        const updatedStocks = [...stocks];
        updatedStocks[index].quantity = newQuantity;
        setStocks(updatedStocks);
    };

    const handleRemoveStock = (index: number) => {
        const updatedStocks = stocks.filter((_, i) => i !== index);
        setStocks(updatedStocks);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
            <h2>Portfolio Value Over Time</h2>
            {stocks.length === 0 ? (
                <button style={addButtonStyle} onClick={handleAddInitialStocks}>
                    Add Initial Stocks
                </button>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={portfolioData}>
                            <CartesianGrid
                                strokeDasharray="4 4"
                                vertical={false}
                            />
                            <XAxis dataKey="date" />
                            <YAxis
                                domain={["dataMin", "dataMax"]}
                                scale="linear"
                            />
                            <Tooltip
                                formatter={(value) => value.toFixed(2)}
                                contentStyle={{ backgroundColor: "#fff" }}
                                labelStyle={{ color: "#000" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                name="Value"
                                stroke="#82ca9d"
                                strokeWidth={3}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: "20px" }}>
                        <h3>
                            Current Portfolio Value: ${currentValue.toFixed(2)}
                        </h3>
                        <h3
                            style={{
                                color: change > 0 ? "green" : "red",
                            }}
                        >
                            24h Change: ${change.toFixed(2)} (
                            {changePercent.toFixed(2)}
                            %)
                        </h3>
                    </div>
                </>
            )}
            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div
                        style={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Add Stock</h3>
                        <input
                            type="text"
                            placeholder="Ticker"
                            value={ticker}
                            onChange={(e) =>
                                setTicker(e.target.value.toUpperCase())
                            }
                            style={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                            style={styles.input}
                        />
                        {errorMessage && (
                            <div style={styles.errorMessage}>
                                {errorMessage}
                            </div>
                        )}
                        <button onClick={handleAddStock} style={styles.button}>
                            Add
                        </button>
                        {stocks.length > 0 && (
                            <>
                                <h3>Edit Stock Quantities</h3>
                                {stocks.map((stock, index) => (
                                    <div
                                        key={stock.ticker}
                                        style={styles.stockItem}
                                    >
                                        <span style={styles.stockTicker}>
                                            {stock.ticker}
                                        </span>
                                        <input
                                            type="number"
                                            value={stock.quantity}
                                            onChange={(e) =>
                                                handleUpdateStock(
                                                    index,
                                                    Number(e.target.value)
                                                )
                                            }
                                            style={{
                                                ...styles.input,
                                                ...styles.stockInput,
                                            }}
                                        />
                                        <button
                                            onClick={() =>
                                                handleRemoveStock(index)
                                            }
                                            style={styles.removeButton}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </>
                        )}
                        {stocks.length > 0 && (
                            <button
                                onClick={() => setStocks([])}
                                style={styles.button}
                            >
                                Clear Stocks
                            </button>
                        )}

                        <button onClick={closeModal} style={styles.button}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        color: "#000000",
        fontFamily: "'Inter', sans-serif",
    },
    modal: {
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        fontFamily: "'Inter', sans-serif",
    },
    input: {
        display: "block",
        margin: "15px 0",
        padding: "15px",
        width: "100%",
        boxSizing: "border-box",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontFamily: "'Inter', sans-serif",
        fontSize: "16px",
    },
    button: {
        margin: "15px",
        padding: "15px 30px",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        transition: "background-color 0.3s ease",
        fontFamily: "'Inter', sans-serif",
    },
    addButton: {
        padding: "15px 30px",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        transition: "background-color 0.3s ease",
        fontFamily: "'Inter', sans-serif",
    },
    stockItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "10px 0",
    },
    stockTicker: {
        flex: "1",
        textAlign: "left",
        paddingRight: "10px",
        fontSize: "16px",
    },
    stockInput: {
        flex: "3",
    },
    removeButton: {
        marginLeft: "10px",
        padding: "5px 10px",
        cursor: "pointer",
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        fontSize: "16px",
        fontWeight: "500",
        transition: "background-color 0.3s ease",
        fontFamily: "'Inter', sans-serif",
    },
    errorMessage: {
        color: "red",
        marginBottom: "10px",
    },
    tooltip: {
        backgroundColor: "#fff",
        padding: "10px",
        color: "#000",
        border: "1px solid #ddd",
        borderRadius: "4px",
        textAlign: "left",
    },
};

export default PortfolioValue;
