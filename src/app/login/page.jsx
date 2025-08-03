"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, BookOpen, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const API_BASE_URL = 'http://localhost:8000/api/v1';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginForm),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('Login successful!');
        
        // Check user role and redirect accordingly
        if (data.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setErrors(data.errors || { general: data.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Connection error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    window.location.href = '/register';
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#8B5CF6' },
    blur: { scale: 1, borderColor: '#E5E7EB' }
  };

  const buttonVariants = {
    hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)" },
    tap: { scale: 0.98 }
  };

  const FloatingBooks = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-200/20 text-4xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
        >
          <BookOpen />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative">
      <FloatingBooks />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="books" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M2 2h16v16H2z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <path d="M6 6h8v8H6z" fill="currentColor" opacity="0.1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#books)"/>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="text-center py-8 px-6 bg-gradient-to-r from-purple-600/30 to-blue-600/30">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <BookOpen className="w-12 h-12 text-white mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-purple-200">Sign in to your EBook Library account</p>
          </div>

          {/* Login Form */}
          <div className="p-6">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.email[0]}
                  </motion.p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.password[0]}
                  </motion.p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="text-purple-300 hover:text-white text-sm transition-colors"
                >
                  Forgot Password?
                </motion.button>
              </div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm"
                >
                  {errors.general}
                </motion.div>
              )}

              {/* Login Button */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Login <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-purple-200 text-sm">
                  Don't have an account?{' '}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={navigateToRegister}
                    className="text-white hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register here
                  </motion.button>
                </p>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-purple-200 text-sm"
        >
          <p>© 2025 EBook Library. Reading is the window to the world</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;