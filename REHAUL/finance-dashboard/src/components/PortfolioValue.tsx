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

    const fetchStockPrices = async () => {
        const apiKey = "VxLSGD9wJTouit9rQw06LqNLklLjOztx";
        let portfolioValue = 0;
        let portfolioPrevValue = 0;
        const stockDataPromises = stocks.map(async (stock) => {
            const response = await axios.get(
                `https://financialmodelingprep.com/api/v3/quote/${stock.ticker}?apikey=${apiKey}`
            );
            const stockData = response.data[0];
            const stockValue = stock.quantity * stockData.price;
            const stockPrevValue =
                stock.quantity * (stockData.price - stockData.change);
            portfolioValue += stockValue;
            portfolioPrevValue += stockPrevValue;
            return {
                date: new Date().toISOString().split("T")[0],
                [`${stock.ticker}`]: stockData.price,
                value: stockValue,
            };
        });

        const stockData = await Promise.all(stockDataPromises);
        const mergedData = stockData.reduce((acc: any, cur: any) => {
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
                <button
                    style={addButtonStyle}
                    onClick={handleAddInitialStocks}
                >
                    Add Initial Stocks
                </button>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={portfolioData}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false}/>
                            <XAxis dataKey="date" />
                            <YAxis domain={["dataMin", "dataMax"]} scale="linear"/>
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
                        {stocks.length > 0 && (<button
                            onClick={() => setStocks([])}
                            style={styles.button}
                        >
                            Clear Stocks
                        </button>) }
                        
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











































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// const PortfolioValue = ({ portfolio }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchPortfolioData = async () => {
//       // Simulated API call for portfolio value over time
//       const result = await axios.get('https://api.example.com/portfolio-value');
//       setData(result.data);
//     };
//     fetchPortfolioData();
//   }, [portfolio]);

//   return (
//     <LineChart width={500} height={300} data={data}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="date" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
//     </LineChart>
//   );
// };

// export default PortfolioValue;
