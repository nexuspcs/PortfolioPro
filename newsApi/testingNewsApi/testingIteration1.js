const apiKey = 'a04f0ec5e8764532a2619296244e10f6';
const country = 'au';
const category = 'business'; // Set the category to 'business' for finance-related news
const articlesContainer = document.getElementById('articles-container');
let currentPage = localStorage.getItem('currentPage') || 1; // Retrieve the current page from local storage, default to 1
const pageSize = 5;

function fetchArticles(page) {
  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      articlesContainer.innerHTML = ''; // Clear existing articles
      const articles = data.articles;
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

        const publishTimeSpan = document.createElement('span');
        const publishedAtDate = new Date(article.publishedAt);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedPublishedAt = publishedAtDate.toLocaleDateString('en-US', options);
        publishTimeSpan.textContent = `Published At: ${formattedPublishedAt}`;
        publishTimeSpan.classList.add('publish-time');

        articleDiv.appendChild(titleLink);
        articleDiv.appendChild(authorSpan);
        articleDiv.appendChild(document.createElement('br'));
        articleDiv.appendChild(publishTimeSpan);

        articlesContainer.appendChild(articleDiv);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  
  // Store the current page in local storage
  localStorage.setItem('currentPage', page);
}

// Initial fetch
fetchArticles(currentPage);

// Button to fetch new articles
const loadMoreButton = document.getElementById('load-more-btn');
loadMoreButton.addEventListener('click', () => {
  currentPage++;
  fetchArticles(currentPage);
});

const previousButton = document.getElementById('previous-btn');
previousButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchArticles(currentPage);
  }
});