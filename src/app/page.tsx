"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Star, Users, Download, Search, Heart, 
  ArrowRight, Sparkles, LogIn, UserPlus, Play,
  Award, Globe, Shield, Zap
} from 'lucide-react';

const LandingPage = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const navigateToRegister = () => {
    window.location.href = '/register';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
      y: -2
    },
    tap: { scale: 0.95 }
  };

  const FloatingElements = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Books */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`book-${i}`}
          className="absolute text-white/10 text-2xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8
          }}
          style={{
            left: `${5 + i * 12}%`,
            top: `${10 + (i % 4) * 20}%`
          }}
        >
          <BookOpen />
        </motion.div>
      ))}

      {/* Floating Stars */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-yellow-300/20 text-lg"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2
          }}
          style={{
            right: `${10 + i * 10}%`,
            top: `${15 + (i % 3) * 25}%`
          }}
        >
          <Star />
        </motion.div>
      ))}
    </div>
  );

  const BackgroundPattern = () => (
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="bookPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bookPattern)"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <FloatingElements />
      <BackgroundPattern />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">EBook Library</h1>
                <p className="text-purple-200 text-sm">Digital Reading Experience</p>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Hero Text */}
              <motion.div variants={itemVariants} className="space-y-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <BookOpen className="w-16 h-16 text-white mx-auto" />
                  </div>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Your Digital{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Library
                  </span>
                  <br />
                  Awaits
                </h1>

                <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
                  Discover thousands of digital books, create your personal library, 
                  and embark on endless reading adventures. All in one beautiful platform.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto my-12"
              >
                {[
                  { icon: BookOpen, number: "10K+", label: "Books Available" },
                  { icon: Users, number: "5K+", label: "Active Readers" },
                  { icon: Star, number: "4.9", label: "Average Rating" },
                  { icon: Download, number: "50K+", label: "Downloads" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <stat.icon className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-purple-200 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-md mx-auto"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={navigateToLogin}
                  onMouseEnter={() => setHoveredButton('login')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <LogIn className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 text-lg">Login</span>
                  <motion.div
                    animate={hoveredButton === 'login' ? { x: 5 } : { x: 0 }}
                    className="relative z-10"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={navigateToRegister}
                  onMouseEnter={() => setHoveredButton('register')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-full sm:w-auto group relative overflow-hidden bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-lg">Register</span>
                  <motion.div
                    animate={hoveredButton === 'register' ? { rotate: 180 } : { rotate: 0 }}
                    className="transition-transform duration-300"
                  >
                    <UserPlus className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                variants={itemVariants}
                className="text-purple-300 text-sm"
              >
                <p>✨ Free to join • No credit card required • Start reading instantly</p>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Features Preview */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-12 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Why Choose Our Platform?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Smart Discovery",
                  description: "Find your next favorite book with our intelligent recommendation system",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Heart,
                  title: "Personal Library",
                  description: "Create your own digital library and access it from anywhere",
                  color: "from-pink-500 to-rose-500"
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Your reading history and preferences are completely private and secure",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-purple-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="py-8 px-6 border-t border-white/10"
        >
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-purple-200 text-sm">
              © 2025 EBook Library. Reading is the window to the world.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <motion.div whileHover={{ scale: 1.1 }}>
                <a href="#" className="text-purple-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <a href="#" className="text-purple-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <a href="#" className="text-purple-300 hover:text-white transition-colors">
                  Support
                </a>
              </motion.div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;