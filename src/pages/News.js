import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProfileDropdown from "../components/ProfileDropdown";

const News = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [search, setSearch] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("schemes"); // 'schemes' or 'news'

  // Retrieve username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/"); // Redirect to login if not logged in
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  // Fetch schemes when view changes
  useEffect(() => {
    if (view === "schemes") {
      fetchSchemes();
    }
  }, [view]);

  // Fetch schemes
  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/schemes.json"); // Adjust path if necessary
      if (!response.ok) throw new Error("Failed to fetch schemes");
      const data = await response.json();
      setSchemes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=agriculture+India&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
      );

      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNews(data.articles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-hidden shadow-md">
      <div className="layout-container flex h-full flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between w-full px-8 py-3 text-sm bg-gradient-to-r from-purple-300 to-green-300 shadow-md">
          {/* Left Side: Logo + Title */}
          <div className="flex items-center gap-3 text-[#1C160C]">
            <div className="size-5">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#1C160C] text-lg font-bold tracking-tight">
              <a href="/home">Millets</a>
            </h2>
          </div>
  
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#1C160C] ml-auto">
            <a href="/home">Chatbot</a>
            <a href="/news">News</a>
            <a href="/shared">Shared Machineries</a>
            <a href="/collab">Collaborative Farming</a>
            <a href="/help" className="mr-6">Help & Support</a>
          </nav>
  
          <div className="flex items-center gap-6">
            <div className="relative group">
              <a href="/calendar" className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" alt="Calendar Icon" className="size-5" />
              </a>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Farming Calendar
              </div>
            </div>
            <div className="relative group">
              <a href="/tracker" className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/833/833314.png" alt="Finance Icon" className="size-5" />
              </a>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Finance Tracker
              </div>
            </div>
            <ProfileDropdown logoutUser={logoutUser} />
          </div>
        </header>

      {/* Main Content */}
      <div className="flex flex-col px-32 py-10 text-center fade-content pt-20">
        <h1 className="text-[#1C160C] text-2xl font-bold pb-4">Smart Farming-related News</h1>
        <p className="text-[#4A4A4A] text-lg pb-6">
          Stay updated with the latest developments in agriculture, market trends, government policies, and innovations in farming.
        </p>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-6 py-2 border border-gray-400 rounded-l-md ${view === "schemes" ? "bg-gray-200" : "bg-white"}`}
            onClick={() => setView("schemes")}
          >
            Government Schemes
          </button>
          <button
            className={`px-6 py-2 border border-gray-400 rounded-r-md ${view === "news" ? "bg-gray-200" : "bg-white"}`}
            onClick={() => {
              setView("news");
              fetchNews();
            }}
          >
            Agriculture News
          </button>
        </div>

        {/* Search Box for Schemes */}
        {view === "schemes" && (
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search schemes..."
              className="w-1/2 p-2 border border-gray-300 rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Display Data */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : view === "schemes" ? (
          // Government Schemes Section
          <div className="grid md:grid-cols-3 gap-6">
            {schemes.length > 0 ? (
              schemes
                .filter((scheme) => scheme.name.toLowerCase().includes(search.toLowerCase()))
                .map((scheme) => (
                  <div key={scheme.id} className="border p-4 rounded-md shadow-md">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold">{scheme.name}</h2>
                      <span className="px-2 py-1 border rounded-full text-sm">{scheme.tag}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{scheme.description}</p>
                    <h3 className="mt-3 font-semibold">Eligibility:</h3>
                    <p className="text-gray-700">{scheme.eligibility}</p>
                    <h3 className="mt-3 font-semibold">Benefits:</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {scheme.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                    <button
                      className="mt-4 w-full bg-black text-white py-2 rounded-md"
                      onClick={() => window.open(scheme.link, "_blank")}
                    >
                      Apply Now
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">No matching schemes found.</p>
            )}
          </div>
        ) : (
          // Agriculture News Section
          <div className="grid md:grid-cols-3 gap-6">
            {news.length > 0 ? (
              news.map((article, index) => (
                <div key={index} className="border p-4 rounded-md shadow-md">
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt="News" className="w-full h-40 object-cover mb-3 rounded-md" />
                  )}
                  <h2 className="text-xl font-bold">{article.title}</h2>
                  <p className="text-gray-600 mt-2">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md"
                  >
                    Read More
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">No agriculture news found.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default News;
