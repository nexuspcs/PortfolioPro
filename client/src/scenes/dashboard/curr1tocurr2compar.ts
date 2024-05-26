import React, { useState, useEffect } from 'react';
import request from 'request';

// Function to get the latest FX rate
const getLatestFXRate = (fromCurrency, toCurrency, apiKey) => {
  return new Promise((resolve, reject) => {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;

    request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
      } else {
        if (!data['Realtime Currency Exchange Rate']) {
          reject(new Error(`Unexpected API response: ${JSON.stringify(data)}`));
        }

        const exchangeRateData = data['Realtime Currency Exchange Rate'];

        const result = {
          exchangeRate: exchangeRateData['5. Exchange Rate'],
          lastRefreshed: exchangeRateData['6. Last Refreshed'],
          bidPrice: exchangeRateData['8. Bid Price'],
          askPrice: exchangeRateData['9. Ask Price']
        };

        resolve(result);
      }
    });
  });
};

// React component to display the latest FX rate
const FXRateComponent = ({ fromCurrency, toCurrency, apiKey }) => {
  const [fxRate, setFxRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLatestFXRate(fromCurrency, toCurrency, apiKey)
      .then(data => setFxRate(data))
      .catch(err => setError(err.message));
  }, [fromCurrency, toCurrency, apiKey]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!fxRate) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>FX Rate</h1>
      <p>Exchange Rate: {fxRate.exchangeRate}</p>
      <p>Last Refreshed: {fxRate.lastRefreshed}</p>
      <p>Bid Price: {fxRate.bidPrice}</p>
      <p>Ask Price: {fxRate.askPrice}</p>
    </div>
  );
};

// Example usage
const App = () => {
  const fromCurrency = 'AUD';
  const toCurrency = 'USD';
  const apiKey = '1NL6HIXEZTVJZMCP';

  return (
    <div>
      <FXRateComponent fromCurrency={fromCurrency} toCurrency={toCurrency} apiKey={apiKey} />
    </div>
  );
};

export default App;