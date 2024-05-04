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
    const articles = data.articles.slice(0, noOfArticles); // Get only the first noOfArticles articles
    const articlesContainer = document.getElementById('articles-container');
    articles.forEach(article => {
      const articleDiv = document.createElement('div');
      articleDiv.classList.add('article');

      const titleLink = document.createElement('a');
      titleLink.textContent = article.title;
      titleLink.href = article.url;
      titleLink.target = '_blank'; // Open link in a new tab
      titleLink.classList.add('title');

      const authorSpan = document.createElement('span');
      authorSpan.textContent = `Author: ${article.author}`;
      authorSpan.classList.add('author');

      // Format the publish time
      const publishedAtDate = new Date(article.publishedAt);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
      const formattedPublishedAt = publishedAtDate.toLocaleDateString('en-US', options);
      const publishTimeSpan = document.createElement('span');
      publishTimeSpan.textContent = `Published at: ${formattedPublishedAt}`;
      publishTimeSpan.classList.add('publish-time');

      // Append title, author, and publish time to the article div
      articleDiv.appendChild(titleLink);
      articleDiv.appendChild(authorSpan);
      articleDiv.appendChild(publishTimeSpan);

      // Append the article div to the articles container
      articlesContainer.appendChild(articleDiv);
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });