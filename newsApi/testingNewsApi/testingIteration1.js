const apiKey = 'a04f0ec5e8764532a2619296244e10f6';
const country = 'au';
const category = 'business'; // Set the category to 'business' for finance-related news
const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
const noOfArticles = 5; // Number of articles to display

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
    
    // Example: Display the titles, authors, and descriptions of the top noOfArticles articles
    const articles = data.articles.slice(0, noOfArticles); // Get only the first noOfArticles articles
    const articlesContainer = document.getElementById('articles-container');
    articles.forEach(article => {
      // Create a div element to contain each article
      const articleDiv = document.createElement('div');
      articleDiv.classList.add('article');
      
      // Create an anchor element for the title
      const titleLink = document.createElement('a');
      titleLink.textContent = article.title;
      titleLink.href = article.url;
      titleLink.target = '_blank'; // Open link in a new tab
      titleLink.classList.add('title');
      
      // Create a span element for the author
      const authorSpan = document.createElement('span');
      authorSpan.textContent = `Author: ${article.author}`;
      authorSpan.classList.add('author');
      
      // // Create a p element for the description
      // const descriptionParagraph = document.createElement('p');
      // descriptionParagraph.textContent = article.description || 'No description available';
      // descriptionParagraph.classList.add('description');
      
      // Append title, author, and description to the article div
      articleDiv.appendChild(titleLink);
      articleDiv.appendChild(authorSpan);
      // articleDiv.appendChild(descriptionParagraph);
      
      // Append the article div to the articles container
      articlesContainer.appendChild(articleDiv);
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
