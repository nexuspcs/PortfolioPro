import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import StockChart from './components/StockChart';
import ForexData from './components/ForexData.tsx';
import TimeInCities from './components/TimeInCities';
import PortfolioValue from './components/PortfolioValue.tsx';
import OldAllocation from './components/OldAllocation.tsx';

const App = () => {
  return (
    <>

      <Navbar />
      <div className="dashboard">

        {/* <div className="box"><StockChart symbol="AAPL" /></div>
        <div className="box"><PortfolioValue portfolio="myPortfolio" /></div>   */}



        <div className="box"><PortfolioValue /></div>         

        <div className="box"><OldAllocation /></div>

        <div className="box"><ForexData fromCurrency="USD" toCurrency="AUD" apiKey="D9O_X8drU_i8IZvvSfZi" /></div>
        
        <div className="box"><TimeInCities /></div></div>
    </>
  );
};

export default App;
