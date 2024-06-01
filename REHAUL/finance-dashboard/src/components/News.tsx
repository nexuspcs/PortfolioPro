import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const News: React.FC = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [storedStocks, setStoredStocks] = useState(false);
    const apiKey = '83C3FiMlE5VMtxGNAZCewQrtkTI0W5JCo5v3GFgj';

    const fetchLatestNews = async (bypassCache = false) => {
        setLoading(true);
        const cacheKey = 'latestNews';
        const cachedData = localStorage.getItem(cacheKey);
        const now = new Date().getTime();

        if (!bypassCache && cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (now - timestamp < CACHE_DURATION) {
                setArticles(data);
                setLoading(false);
                return;
            }
        }

        try {
            const response = await axios.get('https://api.marketaux.com/v1/news/all', {
                params: {
                    api_token: apiKey,
                    limit: 5,
                    sort: 'published_at',
                    sort_order: 'desc',
                    language: 'en'
                }
            });
            const filteredArticles = filterArticles(response.data.data);
            setArticles(filteredArticles);
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: filteredArticles }));
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStockNews = async (symbols: string, bypassCache = false) => {
        setLoading(true);
        const cacheKey = `stockNews_${symbols}`;
        const cachedData = localStorage.getItem(cacheKey);
        const now = new Date().getTime();

        if (!bypassCache && cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (now - timestamp < CACHE_DURATION) {
                setArticles(data);
                setLoading(false);
                return;
            }
        }

        try {
            const response = await axios.get('https://api.marketaux.com/v1/news/all', {
                params: {
                    api_token: apiKey,
                    symbols: symbols,
                    limit: 3,
                    sort: 'published_at',
                    sort_order: 'desc',
                    language: 'en'
                }
            });
            const filteredArticles = filterArticles(response.data.data);
            setArticles(filteredArticles);
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: filteredArticles }));
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const stocks = localStorage.getItem('stocks');
        if (stocks) {
            const parsedStocks = JSON.parse(stocks);
            if (parsedStocks.length > 0) {
                setStoredStocks(true);
                const symbols = parsedStocks.map((stock: { ticker: string }) => stock.ticker).join(',');
                fetchStockNews(symbols);
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
                                    {/* <button onClick={() => fetchLatestNews(true)} className="fetch-latest-news-button">
                                        Fetch Latest News
                                    </button> */}
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