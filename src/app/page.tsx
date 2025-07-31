"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, BookOpen, User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const EBookAuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  // API Base URL - sesuaikan dengan Laravel API Anda
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
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token ke localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login berhasil!');
        // Redirect ke dashboard atau halaman utama
      } else {
        setErrors(data.errors || { general: data.message });
      }
    } catch (error) {
      setErrors({ general: 'Terjadi kesalahan koneksi' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(registerForm)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
        setRegisterForm({
          username: '',
          email: '',
          password: '',
          password_confirmation: ''
        });
      } else {
        setErrors(data.errors || { general: data.message });
      }
    } catch (error) {
      setErrors({ general: 'Terjadi kesalahan koneksi' });
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
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
            <h1 className="text-3xl font-bold text-white mb-2">EBook Library</h1>
            <p className="text-purple-200">Temukan ribuan buku digital terbaik</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white/5 m-4 rounded-2xl p-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Masuk
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Daftar
            </motion.button>
          </div>

          {/* Forms */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={pageTransition}
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
                        placeholder="Masukkan email Anda"
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
                        placeholder="Masukkan password"
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
                        Masuk <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={pageTransition}
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  {/* Username Input */}
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                      <motion.input
                        variants={inputVariants}
                        whileFocus="focus"
                        type="text"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Pilih username"
                        required
                      />
                    </div>
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.username[0]}
                      </motion.p>
                    )}
                  </div>

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
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Masukkan email Anda"
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
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Buat password (min. 8 karakter)"
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

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                      <motion.input
                        variants={inputVariants}
                        whileFocus="focus"
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerForm.password_confirmation}
                        onChange={(e) => setRegisterForm({ ...registerForm, password_confirmation: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Ulangi password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
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

                  {/* Register Button */}
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
                        <Sparkles className="w-5 h-5" />
                        Daftar Sekarang
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-purple-200 text-sm"
        >
          <p>© 2025 EBook Library. Membaca adalah jendela dunia</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EBookAuthPages;