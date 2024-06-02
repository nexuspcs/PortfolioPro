import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import StockChart from './components/StockChart.tsx';
import ForexData from './components/ForexData.tsx';
import TimeInCities from './components/TimeInCities';
import PortfolioValue from './components/PortfolioValue.tsx';
import OldAllocation from './components/OldAllocation.tsx';
import News from './components/News';

const App = () => {
  return (
    <>

      <head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.ico" />
        <link rel="icon" sizes="32x32" href="/images/favicon.ico" />
        <link rel="icon" sizes="16x16" href="/images/favicon.ico" />
      </head>

      <Navbar />
      <div className="dashboard">

        <div className="box"><PortfolioValue /></div>

        <div className="box"><OldAllocation /></div>

        <div className="box"><ForexData fromCurrency="USD" toCurrency="AUD" apiKey="mrpZH84LrQCSbAjcCGqG" /></div>

        <div className="box" id='row2'><TimeInCities /></div>

        <div className="box" id='row2'><StockChart symbol="AAPL" /></div>

        <div className="box" id='row2'><News /></div>
      </div>

    </>
  );
};

export default App;
