import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

type StockData = {
    ticker: string;
    quantity: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6BA4'];

const PortfolioAllocation = () => {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [ticker, setTicker] = useState('');
    const [quantity, setQuantity] = useState<number | ''>('');
    
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddStock = () => {
        if (ticker && quantity) {
            setStockData([...stockData, { ticker, quantity: Number(quantity) }]);
            setTicker('');
            setQuantity('');
            handleCloseModal();
        }
    };

    const totalQuantity = stockData.reduce((acc, stock) => acc + stock.quantity, 0);

    const pieData = stockData.map(stock => ({
        name: stock.ticker,
        value: (stock.quantity / totalQuantity) * 100
    }));

    return (
        <div style={{ textAlign: 'center' }}>
            <h3>Portfolio Allocation</h3>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                        onClick={handleShowModal}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTicker">
                            <Form.Label>Stock Ticker</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter stock ticker"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddStock}>
                            Add Stock
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PortfolioAllocation;