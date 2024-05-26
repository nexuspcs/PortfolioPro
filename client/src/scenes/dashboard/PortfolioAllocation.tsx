import { colors } from "@mui/material";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Stock = {
    ticker: string;
    quantity: number;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={styles.tooltip}>
                <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
                <p>{`Quantity: ${payload[0].payload.quantity}`}</p>
            </div>
        );
    }
    return null;
};

const PortfolioAllocation = () => {
    const [stocks, setStocks] = useState<Stock[]>(() => {
        const savedStocks = localStorage.getItem("stocks");
        return savedStocks ? JSON.parse(savedStocks) : [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticker, setTicker] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        localStorage.setItem("stocks", JSON.stringify(stocks));
    }, [stocks]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage(""); // Clear the error message when closing the modal
    };

    const handleAddStock = () => {
        if (ticker && quantity > 0) {
            setStocks([...stocks, { ticker, quantity }]);
            setTicker("");
            setQuantity(0);
            setErrorMessage(""); // Clear the error message on successful add
        } else {
            setErrorMessage("Please enter a valid ticker and quantity.");
        }
    };

    const handleUpdateStock = (index: number, newQuantity: number) => {
        const updatedStocks = [...stocks];
        updatedStocks[index].quantity = newQuantity;
        setStocks(updatedStocks);
    };

    const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

    const data = stocks.map(stock => ({
        name: stock.ticker,
        value: parseFloat(((stock.quantity / totalQuantity) * 100).toFixed(1)),
        quantity: stock.quantity,
    }));

    const COLORS = [
        "#8884d8", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658",
        "#6c8ead", "#d88487", "#d8a284", "#d8bd84", "#b1d884", "#84d89d",
        "#84d8c2", "#84c2d8", "#849dd8", "#8487d8", "#a284d8", "#bd84d8",
        "#d884a2", "#d884bd"
    ];

    console.log("Data for PieChart:", data);

    return (
        <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
            <h2>Portfolio Allocation</h2>
            {stocks.length === 0 ? (
                <button onClick={openModal} style={styles.addButton}>
                    Add Initial Stocks
                </button>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            onClick={openModal}
                            label={({ name, value }) => `${name}: ${value}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{
                                        cursor: 'grab',
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            )}
            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Add Stock</h3>
                        <input
                            type="text"
                            placeholder="Ticker"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            style={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={styles.input}
                        />
                        {errorMessage && (
                            <div style={styles.errorMessage}>{errorMessage}</div>
                        )}
                        <button onClick={handleAddStock} style={styles.button}>Add</button>
                        <button onClick={() => setStocks([])} style={styles.button}>Clear Stocks</button>
                        {stocks.length > 0 && (
                            <>
                                <h3>Edit Stock Quantities</h3>
                                {stocks.map((stock, index) => (
                                    <div key={stock.ticker} style={styles.stockItem}>
                                        <span style={styles.stockTicker}>{stock.ticker}</span>
                                        <input
                                            type="number"
                                            value={stock.quantity}
                                            onChange={(e) => handleUpdateStock(index, Number(e.target.value))}
                                            style={{ ...styles.input, ...styles.stockInput }}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                        <button onClick={closeModal} style={styles.button}>Close</button>
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

export default PortfolioAllocation;