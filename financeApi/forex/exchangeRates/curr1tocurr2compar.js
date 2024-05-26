const request = require('request');

// Function to get the latest FX rate
function getLatestFXRate(fromCurrency, toCurrency, apiKey) {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;

  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // Check if the response has the expected structure
      if (!data['Realtime Currency Exchange Rate']) {
        console.log('Unexpected API response:', data);
        return;
      }

      // Extracting the real-time exchange rate data
      const exchangeRateData = data['Realtime Currency Exchange Rate'];

      console.log(`Exchange Rate (${fromCurrency} to ${toCurrency}):`);
      console.log(`Exchange Rate: ${exchangeRateData['5. Exchange Rate']}`);
      console.log(`Last Refreshed: ${exchangeRateData['6. Last Refreshed']}`);
      console.log(`Bid Price: ${exchangeRateData['8. Bid Price']}`);
      console.log(`Ask Price: ${exchangeRateData['9. Ask Price']}`);
    }
  });
}

// Replace these with desired currencies and your API key
const fromCurrency = 'AUD';
const toCurrency = 'USD';
const apiKey = '1NL6HIXEZTVJZMCP';

getLatestFXRate(fromCurrency, toCurrency, apiKey);