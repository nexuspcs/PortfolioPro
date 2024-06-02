const request = require('request');

// Function to get the latest FX rate
function getLatestFXRate(fromCurrency, toCurrency, apiKey) {
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
        // Check if the response has the expected structure
        if (!data['Realtime Currency Exchange Rate']) {
          reject(new Error(`Unexpected API response: ${JSON.stringify(data)}`));
        }

        // Extracting the real-time exchange rate data
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
}

// Replace these with desired currencies and your API key
const fromCurrency = 'AUD';
const toCurrency = 'USD';
const apiKey = '1NL6HIXEZTVJZMCP';

getLatestFXRate(fromCurrency, toCurrency, apiKey)
  .then(console.log)
  .catch(console.error);

module.exports = getLatestFXRate;