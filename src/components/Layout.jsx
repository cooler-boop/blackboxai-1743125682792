import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  LayoutDashboard,
  Settings,
  Eye,
  EyeOff,
  Upload,
  Download,
  Zap,
  Database,
  Cpu,
  Network,
  Sparkles,
  Rocket,
  Shield,
  TrendingUp,
  Award,
  Star,
  Activity,
  Globe,
  Lock,
  Layers,
  Code,
  Palette,
  Headphones,
  Coffee,
  Heart
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [showAIConfig, setShowAIConfig] = React.useState(false)
  const [showMCPManager, setShowMCPManager] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // 重新组织的导航菜单 - 按功能分组，增强图标设计
  const navigationGroups = [
    {
      name: '核心功能',
      icon: Rocket,
      gradient: 'from-blue-500 to-cyan-500',
      items: [
        { 
          name: '控制台', 
          href: '/dashboard', 
          icon: LayoutDashboard, 
          color: 'text-blue-600',
          hoverColor: 'hover:text-blue-700',
          bgHover: 'hover:bg-blue-50',
          description: '数据总览和快速操作'
        },
        { 
          name: '面试练习', 
          href: '/interview', 
          icon: MessageCircle, 
          color: 'text-green-600',
          hoverColor: 'hover:text-green-700',
          bgHover: 'hover:bg-green-50',
          description: 'AI智能面试模拟'
        },
        { 
          name: '简历分析', 
          href: '/resume-analysis', 
          icon: FileText, 
          color: 'text-purple-600',
          hoverColor: 'hover:text-purple-700',
          bgHover: 'hover:bg-purple-50',
          description: '智能简历优化建议'
        },
      ]
    },
    {
      name: '学习提升',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      items: [
        { 
          name: '题库练习', 
          href: '/practice', 
          icon: BookOpen, 
          color: 'text-orange-600',
          hoverColor: 'hover:text-orange-700',
          bgHover: 'hover:bg-orange-50',
          description: '海量题库智能练习'
        },
        { 
          name: '职业规划', 
          href: '/career-planning', 
          icon: Target, 
          color: 'text-red-600',
          hoverColor: 'hover:text-red-700',
          bgHover: 'hover:bg-red-50',
          description: '个性化职业发展路径'
        },
        { 
          name: '职位匹配', 
          href: '/job-matching', 
          icon: Briefcase, 
          color: 'text-indigo-600',
          hoverColor: 'hover:text-indigo-700',
          bgHover: 'hover:bg-indigo-50',
          description: 'AI智能职位推荐'
        },
      ]
    },
    {
      name: '数据分析',
      icon: Activity,
      gradient: 'from-cyan-500 to-blue-500',
      items: [
        { 
          name: '数据分析', 
          href: '/analytics', 
          icon: BarChart3, 
          color: 'text-cyan-600',
          hoverColor: 'hover:text-cyan-700',
          bgHover: 'hover:bg-cyan-50',
          description: '深度数据洞察分析'
        },
        { 
          name: '个人中心', 
          href: '/profile', 
          icon: User, 
          color: 'text-gray-600',
          hoverColor: 'hover:text-gray-700',
          bgHover: 'hover:bg-gray-50',
          description: '个人设置和偏好'
        },
      ]
    }
  ]

  const isActive = (path) => location.pathname === path

  // 动态背景粒子效果
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )

  // 状态指示器组件
  const StatusIndicator = ({ status = 'online' }) => (
    <div className="flex items-center space-x-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-green-500' : 
          status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-xs font-medium text-gray-600 capitalize">{status}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <ParticleBackground />
      
      {/* 增强的Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/20 sticky top-0 z-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo增强 - 动态效果 */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -5, 5, 0],
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-7 h-7 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                  animate={{ 
                    background: [
                      "linear-gradient(45deg, rgba(255,255,255,0.2), transparent)",
                      "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)",
                      "linear-gradient(225deg, rgba(255,255,255,0.2), transparent)",
                      "linear-gradient(315deg, rgba(255,255,255,0.2), transparent)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <motion.span 
                  className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  AI面试助手
                </motion.span>
                {user?.isTrialUser && (
                  <motion.span 
                    className="block text-xs bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ 试用版 v2.1.0 Pro
                  </motion.span>
                )}
              </div>
            </Link>

            {/* 桌面导航 - 分组显示增强 */}
            <nav className="hidden xl:flex space-x-2">
              {navigationGroups.map((group, groupIndex) => (
                <div key={group.name} className="flex items-center space-x-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isItemActive = isActive(item.href)
                    return (
                      <motion.div
                        key={item.name}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.href}
                          className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            isItemActive
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                              : `text-gray-600 ${item.hoverColor} ${item.bgHover} hover:shadow-md`
                          }`}
                        >
                          <motion.div
                            className={`p-1 rounded-lg ${isItemActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/10'}`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className={`w-4 h-4 ${isItemActive ? 'text-white' : item.color} group-hover:scale-110 transition-transform`} />
                          </motion.div>
                          <span className="relative">
                            {item.name}
                            {isItemActive && (
                              <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"
                                layoutId="activeTab"
                                initial={false}
                              />
                            )}
                          </span>
                          
                          {/* 悬浮提示 */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.description}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                  {groupIndex < navigationGroups.length - 1 && (
                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-3" />
                  )}
                </div>
              ))}
            </nav>

            {/* 工具栏增强 */}
            <div className="flex items-center space-x-3">
              {user && (
                <motion.div 
                  className="hidden md:flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <StatusIndicator status="online" />
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {user.name.charAt(0)}
                    </motion.div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                </motion.div>
              )}
              
              {/* 工具按钮组 */}
              <div className="flex items-center space-x-2">
                {/* MCP管理器按钮 */}
                <motion.button
                  onClick={() => setShowMCPManager(true)}
                  className="relative p-3 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
                  title="MCP协议管理"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Network className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
                
                {/* AI配置按钮 */}
                <motion.button
                  onClick={() => setShowAIConfig(true)}
                  className="relative p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                  title="AI模型配置"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings className="w-5 h-5" />
                  </motion.div>
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                </motion.button>
                
                {/* 移动端菜单按钮 */}
                <motion.button
                  className="xl:hidden p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端导航增强 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
            >
              <div className="px-4 py-6 space-y-6 max-h-96 overflow-y-auto">
                {navigationGroups.map((group, groupIndex) => (
                  <motion.div 
                    key={group.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${group.gradient} rounded-lg flex items-center justify-center`}>
                        <group.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        {group.name}
                      </h3>
                    </div>
                    <div className="space-y-2 ml-2">
                      {group.items.map((item, itemIndex) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                          >
                            <Link
                              to={item.href}
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive(item.href)
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                  : `text-gray-600 hover:text-gray-900 ${item.bgHover}`
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className={`p-2 rounded-lg ${isActive(item.href) ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <Icon className={`w-4 h-4 ${isActive(item.href) ? 'text-white' : item.color}`} />
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className={`text-xs ${isActive(item.href) ? 'text-white/80' : 'text-gray-500'}`}>
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
                
                {/* 移动端工具 */}
                <motion.div 
                  className="pt-4 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      工具
                    </h3>
                  </div>
                  <div className="space-y-2 ml-2">
                    <button
                      onClick={() => {
                        setShowMCPManager(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Network className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">MCP协议管理</div>
                        <div className="text-xs text-gray-500">模型上下文协议配置</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowAIConfig(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Settings className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">AI模型配置</div>
                        <div className="text-xs text-gray-500">配置AI模型连接</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* AI配置模态框增强 */}
      <AnimatePresence>
        {showAIConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAIConfig(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden"
            >
              <AIConfigContent onClose={() => setShowAIConfig(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MCP管理器模态框增强 */}
      <AnimatePresence>
        {showMCPManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMCPManager(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
            >
              <MCPManagerContent onClose={() => setShowMCPManager(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 增强的Footer */}
      <footer className="bg-white/90 backdrop-blur-xl border-t border-white/20 mt-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <motion.p 
                className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                &copy; 2024 AI智能面试助手 v2.1.0 Pro
              </motion.p>
              <p className="text-sm text-gray-600 mt-1">
                支持10个AI提供商 · MCP协议 · 高级算法优化 · 企业级安全
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              {[
                { icon: Cpu, label: 'AI驱动', color: 'text-blue-600' },
                { icon: Zap, label: '实时分析', color: 'text-yellow-600' },
                { icon: Shield, label: '数据安全', color: 'text-green-600' },
                { icon: Globe, label: '全球服务', color: 'text-purple-600' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center space-x-2 text-sm"
                  whileHover={{ scale: 1.1, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* 底部装饰 */}
          <motion.div
            className="mt-6 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </footer>
    </div>
  )
}

// AI配置内容组件 - 增强版
const AIConfigContent = ({ onClose }) => {
  const [selectedProvider, setSelectedProvider] = React.useState('openai')
  const [config, setConfig] = React.useState({
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    customModel: '',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0
  })
  const [testing, setTesting] = React.useState(false)
  const [showApiKey, setShowApiKey] = React.useState(false)
  
  // 从localStorage加载配置
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('ai-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setSelectedProvider(parsed.provider || 'openai')
        setConfig(parsed.config || {
          apiKey: '',
          baseUrl: providers[parsed.provider]?.defaultBaseUrl || 'https://api.openai.com/v1',
          model: providers[parsed.provider]?.models[0] || 'gpt-4o',
          customModel: '',
          temperature: 0.7,
          maxTokens: 1000,
          topP: 1.0
        })
      } catch (error) {
        console.error('Failed to load AI config:', error)
      }
    }
  }, [])
  
  const providers = {
    openai: {
      name: 'OpenAI',
      category: '云端',
      models: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k',
        'text-davinci-003',
        'text-curie-001'
      ],
      defaultBaseUrl: 'https://api.openai.com/v1',
      icon: '🤖',
      gradient: 'from-green-400 to-blue-500'
    },
    claude: {
      name: 'Claude',
      category: '云端',
      models: [
        'claude-3-5-sonnet-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-2.1',
        'claude-instant-1.2',
        'claude-sonnet-4-20250514'
      ],
      defaultBaseUrl: 'https://api.anthropic.com',
      icon: '🧠',
      gradient: 'from-purple-400 to-pink-500'
    },
    gemini: {
      name: 'Google Gemini',
      category: '云端',
      models: [
        'gemini-pro',
        'gemini-pro-vision',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro',
        'text-bison-001',
        'chat-bison-001'
      ],
      defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1',
      icon: '💎',
      gradient: 'from-blue-400 to-cyan-500'
    },
    qwen: {
      name: '通义千问',
      category: '云端',
      models: [
        'qwen2.5-72b-instruct',
        'qwen2.5-32b-instruct',
        'qwen2.5-14b-instruct',
        'qwen2.5-7b-instruct',
        'qwen2.5-3b-instruct',
        'qwen2.5-1.5b-instruct',
        'qwen2.5-0.5b-instruct',
        'qwen-turbo',
        'qwen-plus'
      ],
      defaultBaseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      icon: '🌟',
      gradient: 'from-yellow-400 to-orange-500'
    },
    ernie: {
      name: '文心一言',
      category: '云端',
      models: [
        'ernie-bot-4',
        'ernie-bot-turbo',
        'ernie-bot',
        'ernie-speed',
        'ernie-lite'
      ],
      defaultBaseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1',
      icon: '🎯',
      gradient: 'from-red-400 to-pink-500'
    },
    zhipu: {
      name: '智谱AI',
      category: '云端',
      models: [
        'glm-4',
        'glm-4-air',
        'glm-4-airx',
        'glm-4-flash',
        'glm-3-turbo'
      ],
      defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      icon: '⚡',
      gradient: 'from-indigo-400 to-purple-500'
    },
    moonshot: {
      name: '月之暗面',
      category: '云端',
      models: [
        'moonshot-v1-8k',
        'moonshot-v1-32k',
        'moonshot-v1-128k'
      ],
      defaultBaseUrl: 'https://api.moonshot.cn/v1',
      icon: '🌙',
      gradient: 'from-gray-400 to-blue-500'
    },
    deepseek: {
      name: 'DeepSeek',
      category: '云端',
      models: [
        'deepseek-chat',
        'deepseek-coder'
      ],
      defaultBaseUrl: 'https://api.deepseek.com/v1',
      icon: '🔍',
      gradient: 'from-teal-400 to-blue-500'
    },
    ollama: {
      name: 'Ollama',
      category: '本地',
      models: [
        'llama2',
        'llama2:13b',
        'llama2:70b',
        'codellama',
        'codellama:13b',
        'mistral',
        'mixtral',
        'neural-chat',
        'starling-lm',
        'vicuna',
        'orca-mini'
      ],
      defaultBaseUrl: 'http://localhost:11434',
      icon: '🦙',
      gradient: 'from-green-400 to-teal-500'
    },
    lmstudio: {
      name: 'LM Studio',
      category: '本地',
      models: [
        'local-model'
      ],
      defaultBaseUrl: 'http://localhost:1234/v1',
      icon: '🏠',
      gradient: 'from-orange-400 to-red-500'
    }
  }
  
  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId)
    setConfig(prev => ({
      ...prev,
      baseUrl: providers[providerId]?.defaultBaseUrl || '',
      model: providers[providerId]?.models[0] || ''
    }))
  }
  
  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }
  
  const handleTest = async () => {
    if (!config.apiKey) {
      toast.error('请先输入API密钥')
      return
    }
    
    setTesting(true)
    try {
      const testPayload = {
        model: config.customModel || config.model,
        messages: [
          {
            role: 'user',
            content: '你好，这是一个连接测试。请简单回复"连接成功"。'
          }
        ],
        max_tokens: parseInt(config.maxTokens),
        temperature: parseFloat(config.temperature),
        top_p: parseFloat(config.topP)
      }
      
      const response = await fetch(config.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(testPayload)
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success('🎉 连接测试成功！AI响应正常')
        console.log('AI响应:', data)
      } else {
        const errorData = await response.text()
        toast.error(`❌ 连接失败: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      toast.error('❌ 连接失败: ' + error.message)
    } finally {
      setTesting(false)
    }
  }
  
  const handleSave = () => {
    if (!config.apiKey) {
      toast.error('请输入API密钥')
      return
    }
    
    localStorage.setItem('ai-config', JSON.stringify({
      provider: selectedProvider,
      config: config
    }))
    toast.success('✅ 配置已保存')
    onClose()
  }
  
  const handleQuickSetup = () => {
    setSelectedProvider('claude')
    setConfig({
      apiKey: 'sk-pNTj4NkGvbmikYHkC8BbFbD39d524826A3F38390E9662841',
      baseUrl: 'https://aihubmix.com',
      model: 'claude-3-5-sonnet-20241022',
      customModel: 'claude-sonnet-4-20250514',
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1.0
    })
    toast.success('⚡ 已应用BOSS提供的配置')
  }
  
  const maskApiKey = (key) => {
    if (!key) return ''
    if (key.length <= 8) return '*'.repeat(key.length)
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
  }
  
  return (
    <>
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AI模型配置中心
            </h2>
            <p className="text-sm text-gray-600">配置和管理您的AI模型连接</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={handleQuickSetup}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-4 h-4 mr-2 inline" />
            快速配置
          </motion.button>
          <motion.button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="flex h-[600px]">
        {/* 提供商列表 - 增强版 */}
        <div className="w-1/3 border-r bg-gradient-to-b from-gray-50 to-gray-100 p-6 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI提供商 ({Object.keys(providers).length})
          </h3>
          <div className="space-y-3">
            {Object.entries(providers).map(([id, provider], index) => (
              <motion.button
                key={id}
                onClick={() => handleProviderChange(id)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                  selectedProvider === id
                    ? `bg-gradient-to-r ${provider.gradient} text-white shadow-xl transform scale-105`
                    : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: selectedProvider === id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.span 
                    className="text-3xl"
                    animate={{ rotate: selectedProvider === id ? [0, 10, -10, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {provider.icon}
                  </motion.span>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{provider.name}</div>
                    <div className={`text-sm ${selectedProvider === id ? 'text-white/80' : 'text-gray-500'}`}>
                      {provider.category} · {provider.models.length} 模型
                    </div>
                  </div>
                  {selectedProvider === id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* 配置表单 - 增强版 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <motion.div 
              className="flex items-center space-x-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.span 
                className="text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {providers[selectedProvider]?.icon}
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {providers[selectedProvider]?.name} 配置
                </h3>
                <p className="text-sm text-gray-600">
                  {providers[selectedProvider]?.category} · 
                  {providers[selectedProvider]?.models.length} 个可用模型
                </p>
              </div>
            </motion.div>
            
            {/* API密钥 */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <Database className="w-4 h-4 mr-2 text-blue-600" />
                API密钥
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="请输入API密钥"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {config.apiKey && !showApiKey && (
                <motion.div 
                  className="mt-2 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  当前密钥: {maskApiKey(config.apiKey)}
                </motion.div>
              )}
            </motion.div>
            
            {/* Base URL */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <Network className="w-4 h-4 mr-2 text-green-600" />
                Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                placeholder="API基础URL"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>
            
            {/* 模型配置 */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  预设模型
                </label>
                <select
                  value={config.model}
                  onChange={(e) => handleConfigChange('model', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">选择模型</option>
                  {providers[selectedProvider]?.models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  自定义模型ID
                </label>
                <input
                  type="text"
                  value={config.customModel}
                  onChange={(e) => handleConfigChange('customModel', e.target.value)}
                  placeholder="自定义模型ID"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            </div>
            
            {/* 高级参数 */}
            <motion.div 
              className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-indigo-600" />
                高级参数配置
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Temperature ({config.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => handleConfigChange('temperature', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                    <span>保守</span>
                    <span>创造性</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4000"
                    value={config.maxTokens}
                    onChange={(e) => handleConfigChange('maxTokens', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Top P ({config.topP})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.topP}
                    onChange={(e) => handleConfigChange('topP', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                    <span>聚焦</span>
                    <span>多样性</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* 测试连接 */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleTest}
                disabled={testing || !config.apiKey}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                whileHover={{ scale: testing ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {testing ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    测试中...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    测试连接
                  </>
                )}
              </motion.button>
              
              {testing && (
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-gray-500"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Activity className="w-4 h-4" />
                  <span>正在验证API连接...</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4 p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100">
        <motion.button
          onClick={onClose}
          className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          取消
        </motion.button>
        <motion.button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-4 h-4 mr-2 inline" />
          保存配置
        </motion.button>
      </div>
    </>
  )
}

// MCP管理器组件增强
const MCPManagerContent = ({ onClose }) => {
  const [mcpConfigs, setMcpConfigs] = React.useState([])
  const [showAddConfig, setShowAddConfig] = React.useState(false)
  const [newConfig, setNewConfig] = React.useState({
    name: '',
    description: '',
    config: ''
  })

  React.useEffect(() => {
    const saved = localStorage.getItem('mcp-configs')
    if (saved) {
      try {
        setMcpConfigs(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load MCP configs:', error)
      }
    }
  }, [])

  const handleAddConfig = () => {
    if (!newConfig.name || !newConfig.config) {
      toast.error('请填写配置名称和JSON配置')
      return
    }

    try {
      JSON.parse(newConfig.config) // 验证JSON格式
      const config = {
        id: Date.now().toString(),
        ...newConfig,
        createdAt: new Date().toISOString()
      }
      
      const updated = [...mcpConfigs, config]
      setMcpConfigs(updated)
      localStorage.setItem('mcp-configs', JSON.stringify(updated))
      
      setNewConfig({ name: '', description: '', config: '' })
      setShowAddConfig(false)
      toast.success('✅ MCP配置已添加')
    } catch (error) {
      toast.error('❌ JSON格式错误，请检查配置')
    }
  }

  const handleImportConfig = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        const config = JSON.parse(content)
        
        const newMcpConfig = {
          id: Date.now().toString(),
          name: file.name.replace('.json', ''),
          description: '从文件导入',
          config: JSON.stringify(config, null, 2),
          createdAt: new Date().toISOString()
        }
        
        const updated = [...mcpConfigs, newMcpConfig]
        setMcpConfigs(updated)
        localStorage.setItem('mcp-configs', JSON.stringify(updated))
        toast.success('🎉 MCP配置导入成功')
      } catch (error) {
        toast.error('❌ 文件格式错误，请确保是有效的JSON文件')
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteConfig = (id) => {
    const updated = mcpConfigs.filter(config => config.id !== id)
    setMcpConfigs(updated)
    localStorage.setItem('mcp-configs', JSON.stringify(updated))
    toast.success('🗑️ 配置已删除')
  }

  const handleExportConfig = (config) => {
    try {
      const configData = JSON.parse(config.config)
      const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${config.name}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('📥 配置已导出')
    } catch (error) {
      toast.error('❌ 导出失败')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Network className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              MCP协议管理器
            </h2>
            <p className="text-sm text-gray-600">管理Model Context Protocol配置</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.label 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            导入JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </motion.label>
          <motion.button
            onClick={() => setShowAddConfig(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 mr-2 inline" />
            添加配置
          </motion.button>
          <motion.button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="p-6 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {showAddConfig && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-blue-200"
            >
              <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                添加新的MCP配置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    配置名称
                  </label>
                  <input
                    type="text"
                    value={newConfig.name}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如: Claude Desktop Config"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述
                  </label>
                  <input
                    type="text"
                    value={newConfig.description}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="配置描述"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JSON配置
                  </label>
                  <textarea
                    value={newConfig.config}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, config: e.target.value }))}
                    placeholder='{"mcpServers": {"example": {"command": "node", "args": ["server.js"]}}}'
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-all duration-200"
                    rows={6}
                  />
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleAddConfig}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    保存配置
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAddConfig(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    取消
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mcpConfigs.length > 0 ? (
          <div className="space-y-4">
            {mcpConfigs.map((config, index) => (
              <motion.div 
                key={config.id} 
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{config.name}</h4>
                    <p className="text-sm text-gray-600">{config.description}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      创建于: {new Date(config.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleExportConfig(config)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="导出配置"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteConfig(config.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="删除配置"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {config.config}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Network className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">暂无MCP配置</h3>
            <p className="text-gray-600 mb-6">添加您的第一个MCP协议配置</p>
            <motion.button
              onClick={() => setShowAddConfig(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 mr-2 inline" />
              添加配置
            </motion.button>
          </motion.div>
        )}
      </div>

      <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 p-6">
        <div className="text-sm text-gray-600">
          <p className="font-bold mb-3 flex items-center">
            <Coffee className="w-4 h-4 mr-2" />
            关于MCP协议:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center">
              <Star className="w-3 h-3 mr-2 text-yellow-500" />
              Model Context Protocol - AI模型上下文协议
            </li>
            <li className="flex items-center">
              <Code className="w-3 h-3 mr-2 text-blue-500" />
              支持JSON格式配置导入/导出
            </li>
            <li className="flex items-center">
              <Layers className="w-3 h-3 mr-2 text-green-500" />
              可配置多个MCP服务器连接
            </li>
            <li className="flex items-center">
              <Palette className="w-3 h-3 mr-2 text-purple-500" />
              增强AI模型的上下文理解能力
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Layout