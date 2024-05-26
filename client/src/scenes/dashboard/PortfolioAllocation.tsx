import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Stock = {
    ticker: string;
    quantity: number;
};

const PortfolioAllocation = () => {
    const [stocks, setStocks] = useState<Stock[]>(() => {
        const savedStocks = localStorage.getItem("stocks");
        return savedStocks ? JSON.parse(savedStocks) : [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticker, setTicker] = useState("");
    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem("stocks", JSON.stringify(stocks));
    }, [stocks]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddStock = () => {
        if (ticker && quantity > 0) {
            setStocks([...stocks, { ticker, quantity }]);
            setTicker("");
            setQuantity(0);
            closeModal();
        } else {
            alert("Please enter a valid ticker and quantity");
        }
    };

    const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

    const data = stocks.map(stock => ({
        name: stock.ticker,
        value: (stock.quantity / totalQuantity) * 100,
    }));

    const COLORS = ["#8884d8", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"];

    console.log("Data for PieChart:", data); // Debugging log

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
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Add Stock</h3>
                        <input
                            type="text"
                            placeholder="Ticker"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={styles.input}
                        />
                        <button onClick={handleAddStock} style={styles.button}>Add</button>
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
    },
    modal: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
    },
    input: {
        display: "block",
        margin: "10px 0",
        padding: "10px",
        width: "100%",
        boxSizing: "border-box",
    },
    button: {
        margin: "10px",
        padding: "10px 20px",
        cursor: "pointer",
    },
    addButton: {
        padding: "10px 20px",
        cursor: "pointer",
        backgroundColor: "#8884d8",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
    },
};

export default PortfolioAllocation;