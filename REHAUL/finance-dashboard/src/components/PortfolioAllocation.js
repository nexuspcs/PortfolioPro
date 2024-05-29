import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PortfolioAllocation = () => {
  const data = [
    { name: 'Stocks', value: 55 },
    { name: 'Bonds', value: 25 },
    { name: 'Real Estate', value: 10 },
    { name: 'Cash', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PortfolioAllocation;
