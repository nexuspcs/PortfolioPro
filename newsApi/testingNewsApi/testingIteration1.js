const apiKey = 'xxxxxxxx';
const country = 'au';
const category = 'business'; // Set the category to 'business' for finance-related news
const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Work with the data here, for example:
    console.log(data); // Log the data to the console
    
    // Example: Display the titles of the articles
    const articles = data.articles;
    articles.forEach(article => {
      console.log(article.title);
      // You can append these titles to HTML elements to display them on your web page
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
