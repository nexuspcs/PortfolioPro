import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';

const News: React.FC = () => {
    const [articles, setArticles] = useState([]);
    const apiKey = '83C3FiMlE5VMtxGNAZCewQrtkTI0W5JCo5v3GFgj';

    useEffect(() => {
        // Fetch stocks from local storage
        const storedStocks = localStorage.getItem('stocks');
        if (storedStocks) {
            const stocks = JSON.parse(storedStocks).map((stock: { ticker: string }) => stock.ticker);
            const symbols = stocks.join(',');

            // Fetch news for the stored stocks
            axios.get('https://api.marketaux.com/v1/news/all', {
                params: {
                    api_token: apiKey,
                    symbols: symbols,
                    limit: 3,
                    sort: 'published_at',
                    sort_order: 'desc',
                    language: 'en'
                }
            })
            .then(response => {
                const filteredArticles = filterArticles(response.data.data);
                setArticles(filteredArticles);
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            });
        }
    }, []);

    const filterArticles = (articles: any[]) => {
        const unwantedPhrases = ["Print this page", "Sign up for our newsletter"];
        return articles.filter(article => {
            return !unwantedPhrases.some(phrase => article.snippet.includes(phrase));
        });
    };

    return (
        <div className="news-container">
            <h2>Latest News</h2>
            {articles.length > 0 ? (
                articles.map((article: any) => (
                    <div key={article.uuid} className="news-article">
                        <h3>{article.title}</h3>
                        <p>{article.snippet}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>
                ))
            ) : (
                <p>No news available.</p>
            )}
        </div>
    );
};

export default News;
