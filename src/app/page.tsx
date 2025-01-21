/* eslint-disable */
"use client";
import NavBar from "./components/NavBar";
import Card from "./components/Card";
import CategoryFilter, { NewsCategory } from "./components/CategoryFilter";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import LoadingSpinner from './components/LoadingSpinner'
import Button from "./components/Button";

import axios from "axios";

interface Article {
  article: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<NewsCategory>('general');
  const [language, setLanguage] = useState<string>("en"); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [originalArticles, setOriginalArticles] = useState<Article[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<boolean>(false);

  
  const fetchNews = async () => {
    setLoading(true); 
    setError(null);
    try {
      console.log('Fetching news for category:', category); 
      const res = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "us",
          category: category,
          pageSize: 20,
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        },
        headers: {
          'User-Agent': 'news-aggregator/1.0',
        },
      });

      console.log('API Response:', res.data); 
      const validArticles = res.data.articles.filter(
        (article:Article) => 
          article.title && 
          !article.title.includes("[Removed]") && 
          article.description && 
          !article.description.includes("[Removed]")
      );

      console.log(res.data.articles);
      setArticles(validArticles);
      setOriginalArticles(validArticles);
    } catch (error: any) {
      const errorMessage = error.response?.status === 426 
        ? "API version requires upgrade. Please try again later."
        : "Failed to fetch news. Please try again.";
      setError(errorMessage);
      console.error("Error fetching news:", error);
    }
    setLoading(false); 
  };

 
  const translateText = async (text: string, target: string) => {
    try {
      const response = await axios.post("http://localhost:5000/translate", {
        q: text,
        source: "en", 
        target: target,
      });
      return response.data.translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return text; 
    }
  };

  
  const translateArticles = async (target: string) => {
    setLoading(true);
    const translatedArticles = await Promise.all(
      originalArticles.map(async (article) => {
        const translatedTitle = await translateText(article.title, target);
        const translatedDescription = await translateText(article.description, target);
        return {
          ...article,
          title: translatedTitle,
          description: translatedDescription,
        };
      })
    );
    setArticles(translatedArticles);
    setLoading(false); 
  };


  useEffect(() => {
    console.log('Category changed to:', category); // Debug log
    fetchNews();
  }, [category]);
 
  useEffect(() => {
    console.log("Fetched articles:", articles);
  }, [articles]);

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage); 
    if (newLanguage === "en") {
      setArticles(originalArticles); 
    } else {
      translateArticles(newLanguage); 
    }
  };


  const openArticle = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              {category.charAt(0).toUpperCase() + category.slice(1)} News
            </h1>
            <CategoryFilter
              selectedCategory={category}
              onCategoryChange={setCategory}
            />
          </div>

          <div className="relative">
            <label htmlFor="language" className="sr-only">
              Select Language
            </label>
            <div className="relative inline-block">
              <select
                id="language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors duration-200"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="it">🇮🇹 Italian</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
          <Button 
            title="Try Again" 
            onclick={() => {
              setRetrying(true);
              fetchNews();
            }} 
          />
        </div>
      ) : (
        <div className="justify-center flex flex-wrap gap-6">
           {articles.map((article, index) => {
    const { title, description, urlToImage, url } = article;

    const isValidArticle = title && description && url;

    return isValidArticle ? (
      <Card
        key={index}
        title={title}
        description={description}
        imageUrl={urlToImage || "/placeholder-image.png"} 
        onclick={() => openArticle(url)}
      />
    ) : null; 
  })}

        </div>
      )}
    </main>
  );
}
