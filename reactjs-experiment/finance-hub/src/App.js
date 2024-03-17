// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Updated import statement
import './App.css';

// Placeholder components
const Home = () => <h2>Welcome to Finance Hub</h2>;
const StockData = () => <h2>Stock Data</h2>;
const News = () => <h2>Financial News</h2>;
const Account = () => <h2>User Account</h2>;

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/stock">Stock Data</Link>
            </li>
            <li>
              <Link to="/news">Financial News</Link>
            </li>
            <li>
              <Link to="/account">User Account</Link>
            </li>
          </ul>
        </nav>

        <Routes> {/* Wrapping Route components with Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<StockData />} />
          <Route path="/news" element={<News />} />
          <Route path="/account" element={<Account />} />
        </Routes> {/* Wrapping Route components with Routes */}
      </div>
    </Router>
  );
}

export default App;
