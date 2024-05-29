import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './PortfolioAllocation.css';

const PortfolioAllocation = () => {
  const [stocks, setStocks] = useState([]);
  const [input, setInput] = useState('');
  const [quantity, setQuantity] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // Load saved stocks from local storage
    const savedStocks = JSON.parse(localStorage.getItem('stocks')) || [];
    setStocks(savedStocks);
  }, []);

  useEffect(() => {
    // Save stocks to local storage
    localStorage.setItem('stocks', JSON.stringify(stocks));
  }, [stocks]);

  const fetchSuggestions = async (query) => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const API_KEY = '5V8PAFDNEI2TCF9L';
    const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.bestMatches) {
      setSuggestions(data.bestMatches.map(match => match['1. symbol']));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInput(value);
    fetchSuggestions(value);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setQuantity(value);
    }
  };

  const addStock = () => {
    if (input && quantity > 0) {
      const newStocks = [...stocks, { name: input, value: parseFloat(quantity) }];
      setStocks(newStocks);
      setInput('');
      setQuantity('');
      setSuggestions([]);
    }
  };

  const editStock = (name) => {
    const stock = stocks.find(s => s.name === name);
    setInput(stock.name);
    setQuantity(stock.value);
    removeStock(name);
  };

  const removeStock = (name) => {
    const updatedStocks = stocks.filter(s => s.name !== name);
    setStocks(updatedStocks);
  };

  return (
    <div>
      <div className="stock-input">
        <input 
          type="text" 
          value={input} 
          onChange={handleInputChange} 
          placeholder="Enter stock ticker"
        />
        <input 
          type="number" 
          value={quantity} 
          onChange={handleQuantityChange} 
          placeholder="Enter quantity"
          min="0"
          step="0.01"
        />
        <button onClick={addStock}>Add/Update Stock</button>
      </div>
      <div className="suggestions">
        {suggestions.map(suggestion => (
          <div key={suggestion} onClick={() => setInput(suggestion)} className="suggestion-item">
            {suggestion}
          </div>
        ))}
      </div>
      <PieChart width={400} height={400}>
        <Pie
          data={stocks}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onClick={({ name }) => editStock(name)}
        >
          {stocks.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PortfolioAllocation;
