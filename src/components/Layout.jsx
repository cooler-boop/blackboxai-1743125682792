import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  User,
  Brain,
  Menu,
  X,
  FileText,
  Target,
  Briefcase,
  LayoutDashboard
} from 'lucide-react'
import useAuthStore from '../store/authStore'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '控制台', href: '/dashboard', icon: LayoutDashboard },
    { name: '简历分析', href: '/resume-analysis', icon: FileText },
    { name: '面试练习', href: '/interview', icon: MessageCircle },
    { name: '题库练习', href: '/practice', icon: BookOpen },
    { name: '数据分析', href: '/analytics', icon: BarChart3 },
    { name: '职业规划', href: '/career-planning', icon: Target },
    { name: '职位匹配', href: '/job-matching', icon: Briefcase },
    { name: '个人中心', href: '/profile', icon: User },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI面试助手</span>
              {user?.isTrialUser && (
                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                  试用版
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Info & Mobile menu button */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <span>欢迎，{user.name}</span>
                </div>
              )}
              
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AI智能面试助手. 专业的面试准备平台.</p>
            <p className="text-sm mt-2">
              支持10个AI提供商 · 完整功能模块 · 生产就绪
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout