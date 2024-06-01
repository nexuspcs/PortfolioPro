import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';

const News: React.FC = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [storedStocks, setStoredStocks] = useState(false);
    const apiKey = '83C3FiMlE5VMtxGNAZCewQrtkTI0W5JCo5v3GFgj';

    const fetchLatestNews = () => {
        setLoading(true);
        axios.get('https://api.marketaux.com/v1/news/all', {
            params: {
                api_token: apiKey,
                limit: 3,
                sort: 'published_at',
                sort_order: 'desc',
                language: 'en'
            }
        })
        .then(response => {
            const filteredArticles = filterArticles(response.data.data);
            setArticles(filteredArticles);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            setLoading(false);
        });
    };

    useEffect(() => {
        const stocks = localStorage.getItem('stocks');
        if (stocks) {
            const parsedStocks = JSON.parse(stocks);
            if (parsedStocks.length > 0) {
                setStoredStocks(true);
                const symbols = parsedStocks.map((stock: { ticker: string }) => stock.ticker).join(',');
                setLoading(true);
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
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching news:', error);
                    setLoading(false);
                });
            } else {
                setStoredStocks(false);
            }
        } else {
            setStoredStocks(false);
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
            {loading ? (
                <p>Loading news based on your portfolio...</p>
            ) : (
                <>
                    {articles.length > 0 ? (
                        articles.map((article: any) => (
                            <div key={article.uuid} className="news-article">
                                <h3>{article.title}</h3>
                                <p>{article.snippet}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                            </div>
                        ))
                    ) : (
                        <div>
                            {storedStocks ? (
                                <p>No news available.</p>
                            ) : (
                                <>
                                    <p>Please add your stocks, by using the button above</p>
                                    <button onClick={fetchLatestNews} className="fetch-latest-news-button">
                                        Fetch Latest News
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default News;