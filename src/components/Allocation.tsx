import React, { useState, useEffect, CSSProperties } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Stock = {
    ticker: string;
    quantity: number;
};

type TickerData = {
    ticker: string;
    name: string;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={styles.tooltip}>
                <p
                    style={{ margin: 0, color: "#000" }}
                >{`${payload[0].name}: ${payload[0].value}%`}</p>
                <p
                    style={{ margin: 0, color: "#000" }}
                >{`Quantity: ${payload[0].payload.quantity}`}</p>
            </div>
        );
    }
    return null;
};

const Allocation = () => {
    const [stocks, setStocks] = useState<Stock[]>(() => {
        const savedStocks = localStorage.getItem("stocks");
        return savedStocks ? JSON.parse(savedStocks) : [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticker, setTicker] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [suggestions, setSuggestions] = useState<TickerData[]>([]);
    const [tickers, setTickers] = useState<TickerData[]>([]);

    useEffect(() => {
        localStorage.setItem("stocks", JSON.stringify(stocks));
        window.dispatchEvent(new Event("storage")); // Manually trigger the storage event
    }, [stocks]);

    useEffect(() => {
        // Load tickers from the JSON file
        fetch("/tickers.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => setTickers(data))
            .catch((error) => console.error("Error loading tickers:", error));
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage(""); // Clear the error message when closing the modal
    };

    const handleAddStock = () => {
        if (ticker && quantity > 0) {
            setStocks((prevStocks) => [...prevStocks, { ticker, quantity }]);
            setTicker("");
            setQuantity(0);
            setErrorMessage(""); // Clear the error message on successful add
            setSuggestions([]);
        } else {
            setErrorMessage("Please enter a valid ticker and quantity.");
        }
    };

    const handleUpdateStock = (index: number, newQuantity: number) => {
        setStocks((prevStocks) => {
            const updatedStocks = [...prevStocks];
            updatedStocks[index].quantity = newQuantity;
            return updatedStocks;
        });
    };

    const handleRemoveStock = (index: number) => {
        setStocks((prevStocks) => prevStocks.filter((_, i) => i !== index));
    };

    const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setTicker(value);

        if (value.length > 1) {
            const filteredSuggestions = tickers.filter(
                (tickerData) =>
                    tickerData.ticker.startsWith(value) ||
                    tickerData.name.toUpperCase().includes(value)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: TickerData) => {
        setTicker(suggestion.ticker);
        setSuggestions([]);
    };

    const totalQuantity = stocks.reduce(
        (sum, stock) => sum + stock.quantity,
        0
    );

    const data = stocks.map((stock) => ({
        name: stock.ticker,
        value: parseFloat(((stock.quantity / totalQuantity) * 100).toFixed(1)),
        quantity: stock.quantity,
    }));

    const COLORS = [
        "#8884d8",
        "#8dd1e1",
        "#82ca9d",
        "#a4de6c",
        "#d0ed57",
        "#ffc658",
        "#6c8ead",
        "#d88487",
        "#d8a284",
        "#d8bd84",
        "#b1d884",
        "#84d89d",
        "#84d8c2",
        "#84c2d8",
        "#849dd8",
        "#8487d8",
        "#a284d8",
        "#bd84d8",
        "#d884a2",
        "#d884bd",
    ];

    return (
        <div
            style={{
                textAlign: "center",
                padding: "20px",
                paddingBottom: "0",
                color: "#fff",
            }}
        >
            {stocks.length === 0 ? (
                <button onClick={openModal} style={styles.addButton}>
                    Add Initial Stocks
                </button>
            ) : (
                <div className="chart-container">
                    <ResponsiveContainer width={500} height={400}>
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
                                label={({ name }) => `${name}`}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        style={{
                                            cursor: "grab",
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div
                        style={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Add Stock</h3>
                        <div
                            style={{
                                ...styles.inputContainer,
                                position: undefined,
                            }}
                        >
                            <input
                                type="text"
                                placeholder="US Stock Ticker"
                                value={ticker}
                                onChange={handleTickerChange}
                                style={styles.input}
                            />
                            {suggestions.length > 0 && (
                                <ul style={styles.suggestionsList}>
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.ticker}
                                            style={styles.suggestionItem}
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion
                                                )
                                            }
                                        >
                                            {`${suggestion.ticker} - ${suggestion.name}`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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

const styles: { [key: string]: CSSProperties } = {
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
    inputContainer: {
        position: "relative",
        width: "100%",
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
        color: "#000", // Ensure font color is applied
        border: "1px solid #ddd",
        borderRadius: "4px",
        textAlign: "left",
    },
    suggestionsList: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxHeight: "150px",
        overflowY: "auto",
        zIndex: 1000,
        position: "absolute",
        width: "100%",
        boxSizing: "border-box",
    },
    suggestionItem: {
        padding: "10px",
        cursor: "pointer",
    },
};

export default Allocation;
