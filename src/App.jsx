import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Practice from './pages/Practice'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  )
}

export default App