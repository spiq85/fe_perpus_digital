"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Users, Tag, Building2, Star, TrendingUp, 
  Plus, Edit, Trash2, Search, Filter, Eye, X, Save,
  BarChart3, PieChart, Calendar, Globe, Menu, LogOut,
  Home, Settings, Bell, User
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalAuthors: 0
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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
      const response = await fetch(`${API_BASE_URL}/admin/${endpoint}`, {
        headers: getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  };

  const saveData = async (endpoint, data, method = 'POST', id = null) => {
    try {
      const url = id ? `${API_BASE_URL}/admin/${endpoint}/${id}` : `${API_BASE_URL}/admin/${endpoint}`;
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        return null;
      }
    } catch (error) {
      console.error('Error saving data:', error);
      return null;
    }
  };

  const deleteData = async (endpoint, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting data:', error);
      return false;
    }
  };

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [booksData, categoriesData, authorsData, publishersData] = await Promise.all([
        fetchData('books'),
        fetchData('categories'),
        fetchData('authors'),
        fetchData('publishers')
      ]);

      setBooks(booksData || []);
      setCategories(categoriesData || []);
      setAuthors(authorsData || []);
      setPublishers(publishersData || []);

      // Calculate stats
      setStats({
        totalBooks: (booksData || []).length,
        totalUsers: 150, // This would come from a users endpoint
        totalCategories: (categoriesData || []).length,
        totalAuthors: (authorsData || []).length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
    setErrors({});
  };

  const handleSave = async () => {
    setLoading(true);
    const endpoint = modalType + 's';
    const method = editingItem ? 'PUT' : 'POST';
    const id = editingItem ? editingItem[`id_${modalType}`] : null;

    const result = await saveData(endpoint, formData, method, id);
    
    if (result) {
      await loadAllData();
      closeModal();
    }
    setLoading(false);
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      const success = await deleteData(type + 's', id);
      if (success) {
        await loadAllData();
      }
      setLoading(false);
    }
  };

  // Sidebar Component
  const Sidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: sidebarOpen ? 0 : -250 }}
      className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 text-white shadow-2xl z-50"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-purple-300" />
          <div>
            <h1 className="text-xl font-bold">EBook Admin</h1>
            <p className="text-purple-300 text-sm">Management System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'books', icon: BookOpen, label: 'Books' },
            { id: 'categories', icon: Tag, label: 'Categories' },
            { id: 'authors', icon: Users, label: 'Authors' },
            { id: 'publishers', icon: Building2, label: 'Publishers' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-purple-200 hover:bg-white/10'
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
          className="w-full flex items-center gap-3 px-4 py-3 text-purple-200 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );

  // Dashboard Stats Component
  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'purple' },
        { label: 'Categories', value: stats.totalCategories, icon: Tag, color: 'blue' },
        { label: 'Authors', value: stats.totalAuthors, icon: Users, color: 'green' },
        { label: 'Total Users', value: stats.totalUsers, icon: Globe, color: 'orange' },
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-${stat.color}-100`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Data Table Component
  const DataTable = ({ data, type, columns }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{type} Management</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal(type.slice(0, -1))}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add {type.slice(0, -1)}
          </motion.button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data
              .filter((item) =>
                Object.values(item).some((value) =>
                  value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((item, index) => (
                <motion.tr
                  key={item[`id_${type.slice(0, -1)}`] || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                      {item[column.key] || '-'}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openModal(type.slice(0, -1), item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(type.slice(0, -1), item[`id_${type.slice(0, -1)}`])}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Modal Component
  const Modal = () => (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit' : 'Add'} {modalType}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {modalType === 'category' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.category_name || ''}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter category name"
                  />
                  {errors.category_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_name[0]}</p>
                  )}
                </div>
              )}

              {modalType === 'author' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author_name || ''}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter author name"
                  />
                  {errors.author_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.author_name[0]}</p>
                  )}
                </div>
              )}

              {modalType === 'publisher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher Name
                  </label>
                  <input
                    type="text"
                    value={formData.publisher_name || ''}
                    onChange={(e) => setFormData({ ...formData, publisher_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter publisher name"
                  />
                  {errors.publisher_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.publisher_name[0]}</p>
                  )}
                </div>
              )}

              {modalType === 'book' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter book title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter book description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.id_category || ''}
                      onChange={(e) => setFormData({ ...formData, id_category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id_category} value={category.id_category}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <select
                      value={formData.id_author || ''}
                      onChange={(e) => setFormData({ ...formData, id_author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Author</option>
                      {authors.map((author) => (
                        <option key={author.id_author} value={author.id_author}>
                          {author.author_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publisher
                    </label>
                    <select
                      value={formData.id_publisher || ''}
                      onChange={(e) => setFormData({ ...formData, id_publisher: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Publisher</option>
                      {publishers.map((publisher) => (
                        <option key={publisher.id_publisher} value={publisher.id_publisher}>
                          {publisher.publisher_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Main Content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">New book added</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">New user registered</p>
                      <p className="text-xs text-gray-600">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Top Rated Books
                </h3>
                <div className="space-y-3">
                  {books.slice(0, 3).map((book, index) => (
                    <div key={book.id_book} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{book.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'books':
        return (
          <DataTable
            data={books}
            type="books"
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'slug', label: 'Slug' },
              { key: 'description', label: 'Description' },
              { key: 'rating_counts', label: 'Rating' },
            ]}
          />
        );

      case 'categories':
        return (
          <DataTable
            data={categories}
            type="categories"
            columns={[
              { key: 'id_category', label: 'ID' },
              { key: 'category_name', label: 'Name' },
            ]}
          />
        );

      case 'authors':
        return (
          <DataTable
            data={authors}
            type="authors"
            columns={[
              { key: 'id_author', label: 'ID' },
              { key: 'author_name', label: 'Name' },
            ]}
          />
        );

      case 'publishers':
        return (
          <DataTable
            data={publishers}
            type="publishers"
            columns={[
              { key: 'id_publisher', label: 'ID' },
              { key: 'publisher_name', label: 'Name' },
            ]}
          />
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-600">Administrator</p>
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
                    className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                renderContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Modal />
    </div>
  );
};

export default AdminDashboard;