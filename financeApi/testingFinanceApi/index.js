var request = require('request');

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=1NL6HIXEZTVJZMCP';

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
        // data is successfully parsed as a JSON object:
        console.log('Meta Data:', data['Meta Data']);
        console.log('Latest Time Series Data:');
        
        // Extracting the latest time series data
        const timeSeries = data['Time Series (5min)'];
        const latestTime = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestTime];
        
        console.log(`Time: ${latestTime}`);
        console.log(`Open: ${latestData['1. open']}`);
        console.log(`High: ${latestData['2. high']}`);
        console.log(`Low: ${latestData['3. low']}`);
        console.log(`Close: ${latestData['4. close']}`);
        console.log(`Volume: ${latestData['5. volume']}`);
    }
});
