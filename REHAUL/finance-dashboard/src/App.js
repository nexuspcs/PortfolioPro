import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import StockChart from './components/StockChart';
import ForexChart from './components/ForexChart';
import TimeInCities from './components/TimeInCities';
import PortfolioAllocation from './components/PortfolioAllocation';
import PortfolioValue from './components/PortfolioValue';
import OldAllocation from './components/OldAllocation.tsx';
 
const App = () => {
  return (
    
    <>
    <button onClick={() => console.log('clicked')}>Click me</button>
    <Navbar />
    <div className="dashboard">
      <div className="box"><StockChart symbol="AAPL" /></div>
      <div className="box"><ForexChart fromCurrency="USD" toCurrency="EUR" /></div>
      <div className="box"><TimeInCities /></div>
      <div className="box"><PortfolioAllocation /></div>
      <div className="box"><PortfolioValue portfolio="myPortfolio" /></div>
      <div className="box"><OldAllocation /></div>
    </div></>
  );
};

export default App;
