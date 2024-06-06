import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import StockChart from './components/StockChart.tsx';
import ForexData from './components/ForexData.tsx';
import TimeInCities from './components/TimeInCities';
import PortfolioValue from './components/PortfolioValue.tsx';
import Allocation from './components/Allocation.tsx';
import News from './components/News';

const App = () => {
  return (
    <>

      <head>
        <link rel="shortcut icon" href="/image/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/image/favicon.ico" />
        <link rel="icon" sizes="32x32" href="/image/favicon.ico" />
        <link rel="icon" sizes="16x16" href="/image/favicon.ico" />
      </head>

      <Navbar />
      <div className="dashboard">

        <div className="box"><PortfolioValue /></div>

        <div className="box"><Allocation /></div>

        <div className="box"><ForexData fromCurrency="USD" toCurrency="AUD" apiKey="q55Jq5LjiJhHWrNssksX" /></div>

        <div className="box" id='row2'><TimeInCities /></div>

        <div className="box" id='row2'><StockChart symbol="AAPL" /></div>

        <div className="box" id='row2'><News /></div>
      </div>

    </>
  );
};

export default App;
