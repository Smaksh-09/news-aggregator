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
import { translateText } from '../services/translationService';

interface Article {
  title: string;
  description: string;
  link: string;
  image_url?: string;
  content?: string;
}

const truncateText = (text: string, wordLimit: number): string => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<NewsCategory>("world");
  const [language, setLanguage] = useState<string>("en"); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [originalArticles, setOriginalArticles] = useState<Article[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/news?category=${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || 'Failed to fetch news');
      }

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid data format received from API');
      }

      const seenTitles = new Set();
      const validArticles = data.results.filter(
        (article: Article) => {
          if (!article.title || 
              !article.description || 
              article.title.includes("[Removed]") || 
              article.description.includes("[Removed]") ||
              seenTitles.has(article.title)) {
            return false;
          }
          seenTitles.add(article.title);
          return true;
        }
      ).map((article: Article) => ({
        ...article,
        description: truncateText(article.description, 100)
      }));

      if (validArticles.length === 0) {
        throw new Error('No valid articles found');
      }

      setArticles(validArticles);
      setOriginalArticles(validArticles);
      
    } catch (error: any) {
      console.error('Fetch error details:', error);
      setError(error.message || "Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setArticles(originalArticles);
      return;
    }

    const filtered = originalArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
    setArticles(filtered);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <NavBar onSearch={handleSearch} />
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
    const { title, description, image_url, link } = article;
    console.log(`Rendering article ${index}:`, { title, image_url }); // Add this logging

    const isValidArticle = title && description && link;

    return isValidArticle ? (
      <Card
        key={index}
        title={title}
        description={description}
        imageUrl={image_url ? image_url.trim() : '/images/news-logo.svg'}
        onclick={() => openArticle(link)}
      />
    ) : null; 
  })}

        </div>
      )}
    </main>
  );
}
