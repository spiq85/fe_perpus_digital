"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Heart, Star, Search, Filter, TrendingUp, 
  Clock, User, Settings, LogOut, Home, Library, 
  ChevronRight, Play, Bookmark, Award, Calendar,
  Menu, Bell, ArrowRight, BookMarked, Eye, Download
} from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Data states
  const [books, setBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [stats, setStats] = useState({
    booksRead: 0,
    favorites: 0,
    currentlyReading: 0,
    totalRatings: 0
  });

  // API Configuration
  const API_BASE_URL = 'http://localhost:8000/api/v1';
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // API Calls
  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  };

  const toggleFavorite = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/favorite`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        loadFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const rateBook = async (bookId, rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/rate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating })
      });
      return response.ok;
    } catch (error) {
      console.error('Error rating book:', error);
      return false;
    }
  };

  // Load data functions
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [booksData, popularData, favoritesData, historyData, profileData] = await Promise.all([
        fetchData('books'),
        fetchData('books/popular'),
        fetchData('my-favorites'),
        fetchData('dashboard/history'),
        fetchData('profile')
      ]);

      setBooks(booksData || []);
      setPopularBooks(popularData || []);
      setFavorites(favoritesData || []);
      setReadingHistory(historyData || []);
      setUserProfile(profileData || {});

      // Calculate user stats
      setStats({
        booksRead: (historyData || []).length,
        favorites: (favoritesData || []).length,
        currentlyReading: 3, // This would be calculated based on your logic
        totalRatings: 12 // This would come from user's ratings
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const favoritesData = await fetchData('my-favorites');
    setFavorites(favoritesData || []);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sidebar Component
  const Sidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: sidebarOpen ? 0 : -250 }}
      className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl z-50"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-blue-300" />
          <div>
            <h1 className="text-xl font-bold">ReadSpace</h1>
            <p className="text-blue-300 text-sm">Your Digital Library</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'library', icon: Library, label: 'My Library' },
            { id: 'favorites', icon: Heart, label: 'Favorites' },
            { id: 'history', icon: Clock, label: 'Reading History' },
            { id: 'browse', icon: Search, label: 'Browse Books' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-blue-200 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Books Read', value: stats.booksRead, icon: BookOpen, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
        { label: 'Favorites', value: stats.favorites, icon: Heart, color: 'pink', gradient: 'from-pink-500 to-rose-500' },
        { label: 'Currently Reading', value: stats.currentlyReading, icon: Play, color: 'green', gradient: 'from-green-500 to-emerald-500' },
        { label: 'Ratings Given', value: stats.totalRatings, icon: Star, color: 'yellow', gradient: 'from-yellow-500 to-orange-500' },
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-6 translate-x-6`}></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${stat.gradient} text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Book Card Component
  const BookCard = ({ book, showFavoriteButton = true, showReadButton = true }) => {
    const isFavorited = favorites.some(fav => fav.id_book === book.id_book);
    
    return (
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
      >
        <div className="relative">
          <div className="w-full h-48 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/80" />
          </div>
          {showFavoriteButton && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(book.id_book)}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </motion.button>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author?.author_name}</p>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < (book.rating_counts || 0) 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">
                ({book.rating_counts || 0})
              </span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {book.category?.category_name}
            </span>
          </div>
          
          {showReadButton && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Read Now
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  // Main Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {userProfile.username || 'Reader'}!
                </h1>
                <p className="text-gray-600 mt-2">Continue your reading journey</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <StatsCards />
            
            {/* Continue Reading */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Continue Reading</h2>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingHistory.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{item.book?.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.book?.author?.author_name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <p className="text-xs text-gray-500">65% complete</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular Books */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Popular This Week</h2>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularBooks.slice(0, 4).map((book, index) => (
                  <motion.div
                    key={book.id_book}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'library':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Library</h1>
            <StatsCards />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.slice(0, 8).map((book, index) => (
                <motion.div
                  key={book.id_book}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Favorites</h1>
            
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
                <p className="text-gray-500">Start adding books to your favorites to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.map((book, index) => (
                  <motion.div
                    key={book.id_book}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BookCard book={book} showFavoriteButton={false} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Reading History</h1>
            
            {readingHistory.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No reading history</h3>
                <p className="text-gray-500">Start reading books to build your history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {readingHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{item.book?.title}</h3>
                        <p className="text-gray-600">{item.book?.author?.author_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Read on {new Date(item.read_at).toLocaleDateString()}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Read Again
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'browse':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Books</h1>
            
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books, authors, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id_category} value={category.id_category}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {books
                .filter((book) => {
                  const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      book.author?.author_name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' || book.id_category === parseInt(selectedCategory);
                  return matchesSearch && matchesCategory;
                })
                .map((book, index) => (
                  <motion.div
                    key={book.id_book}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{userProfile.username}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <p className="text-sm text-gray-500 mt-2">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Reading Statistics</h3>
                <StatsCards />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{userProfile.username}</p>
                  <p className="text-xs text-gray-600">Reader</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                renderContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;