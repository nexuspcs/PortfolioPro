import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PortfolioValue = ({ portfolio }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      // Simulated API call for portfolio value over time
      const result = await axios.get('https://api.example.com/portfolio-value');
      setData(result.data);
    };
    fetchPortfolioData();
  }, [portfolio]);

  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default PortfolioValue;
