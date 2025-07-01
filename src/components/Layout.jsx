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
  Network
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [showAIConfig, setShowAIConfig] = React.useState(false)
  const [showMCPManager, setShowMCPManager] = React.useState(false)

  // 重新组织的导航菜单 - 按功能分组
  const navigationGroups = [
    {
      name: '核心功能',
      items: [
        { name: '控制台', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
        { name: '面试练习', href: '/interview', icon: MessageCircle, color: 'text-green-600' },
        { name: '简历分析', href: '/resume-analysis', icon: FileText, color: 'text-purple-600' },
      ]
    },
    {
      name: '学习提升',
      items: [
        { name: '题库练习', href: '/practice', icon: BookOpen, color: 'text-orange-600' },
        { name: '职业规划', href: '/career-planning', icon: Target, color: 'text-red-600' },
        { name: '职位匹配', href: '/job-matching', icon: Briefcase, color: 'text-indigo-600' },
      ]
    },
    {
      name: '数据分析',
      items: [
        { name: '数据分析', href: '/analytics', icon: BarChart3, color: 'text-cyan-600' },
        { name: '个人中心', href: '/profile', icon: User, color: 'text-gray-600' },
      ]
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 增强的Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo增强 */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI面试助手
                </span>
                {user?.isTrialUser && (
                  <span className="block text-xs text-orange-600 font-medium">试用版 v2.1.0</span>
                )}
              </div>
            </Link>

            {/* 桌面导航 - 分组显示 */}
            <nav className="hidden xl:flex space-x-1">
              {navigationGroups.map((group, groupIndex) => (
                <div key={group.name} className="flex items-center space-x-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-600 shadow-md'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive(item.href) ? 'text-primary-600' : item.color} group-hover:scale-110 transition-transform`} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                  {groupIndex < navigationGroups.length - 1 && (
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </nav>

            {/* 工具栏 */}
            <div className="flex items-center space-x-2">
              {user && (
                <div className="hidden md:flex items-center space-x-3 px-3 py-1 bg-white/60 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
              )}
              
              {/* MCP管理器按钮 */}
              <button
                onClick={() => setShowMCPManager(true)}
                className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group"
                title="MCP协议管理"
              >
                <Network className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              {/* AI配置按钮 */}
              <button
                onClick={() => setShowAIConfig(true)}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                title="AI模型配置"
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              <button
                className="xl:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端导航 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
            >
              <div className="px-4 py-4 space-y-4 max-h-96 overflow-y-auto">
                {navigationGroups.map((group) => (
                  <div key={group.name}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {group.name}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              isActive(item.href)
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className={`w-4 h-4 ${isActive(item.href) ? 'text-primary-600' : item.color}`} />
                            <span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                
                {/* 移动端工具 */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    工具
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowMCPManager(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Network className="w-4 h-4 text-purple-600" />
                      <span>MCP协议管理</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAIConfig(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>AI模型配置</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* AI配置模态框 */}
      <AnimatePresence>
        {showAIConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAIConfig(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden"
            >
              <AIConfigContent onClose={() => setShowAIConfig(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MCP管理器模态框 */}
      <AnimatePresence>
        {showMCPManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMCPManager(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
            >
              <MCPManagerContent onClose={() => setShowMCPManager(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 增强的Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-gray-600">
              <p className="font-medium">&copy; 2024 AI智能面试助手 v2.1.0</p>
              <p className="text-sm mt-1">
                支持10个AI提供商 · MCP协议 · 高级算法优化
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Cpu className="w-4 h-4" />
                <span>AI驱动</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Zap className="w-4 h-4" />
                <span>实时分析</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Database className="w-4 h-4" />
                <span>数据安全</span>
              </div>
            </div>
          </div>
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
      icon: '🤖'
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
      icon: '🧠'
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
      icon: '💎'
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
      icon: '🌟'
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
      icon: '🎯'
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
      icon: '⚡'
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
      icon: '🌙'
    },
    deepseek: {
      name: 'DeepSeek',
      category: '云端',
      models: [
        'deepseek-chat',
        'deepseek-coder'
      ],
      defaultBaseUrl: 'https://api.deepseek.com/v1',
      icon: '🔍'
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
      icon: '🦙'
    },
    lmstudio: {
      name: 'LM Studio',
      category: '本地',
      models: [
        'local-model'
      ],
      defaultBaseUrl: 'http://localhost:1234/v1',
      icon: '🏠'
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
        toast.success('连接测试成功！AI响应正常')
        console.log('AI响应:', data)
      } else {
        const errorData = await response.text()
        toast.error(`连接失败: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      toast.error('连接失败: ' + error.message)
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
    toast.success('配置已保存')
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
    toast.success('已应用BOSS提供的配置')
  }
  
  const maskApiKey = (key) => {
    if (!key) return ''
    if (key.length <= 8) return '*'.repeat(key.length)
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
  }
  
  return (
    <>
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI模型配置中心</h2>
            <p className="text-sm text-gray-600">配置和管理您的AI模型连接</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleQuickSetup}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Zap className="w-4 h-4 mr-2 inline" />
            快速配置
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex h-[600px]">
        {/* 提供商列表 - 增强版 */}
        <div className="w-1/3 border-r bg-gradient-to-b from-gray-50 to-gray-100 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            AI提供商 ({Object.keys(providers).length})
          </h3>
          <div className="space-y-2">
            {Object.entries(providers).map(([id, provider]) => (
              <button
                key={id}
                onClick={() => handleProviderChange(id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  selectedProvider === id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{provider.name}</div>
                    <div className={`text-sm ${selectedProvider === id ? 'text-primary-100' : 'text-gray-500'}`}>
                      {provider.category} · {provider.models.length} 模型
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* 配置表单 - 增强版 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">{providers[selectedProvider]?.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {providers[selectedProvider]?.name} 配置
                </h3>
                <p className="text-sm text-gray-600">
                  {providers[selectedProvider]?.category} · 
                  {providers[selectedProvider]?.models.length} 个可用模型
                </p>
              </div>
            </div>
            
            {/* API密钥 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Database className="w-4 h-4 inline mr-2" />
                API密钥
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="请输入API密钥"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {config.apiKey && !showApiKey && (
                <div className="mt-2 text-sm text-gray-500">
                  当前密钥: {maskApiKey(config.apiKey)}
                </div>
              )}
            </div>
            
            {/* Base URL */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Network className="w-4 h-4 inline mr-2" />
                Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                placeholder="API基础URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* 模型配置 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  预设模型
                </label>
                <select
                  value={config.model}
                  onChange={(e) => handleConfigChange('model', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">选择模型</option>
                  {providers[selectedProvider]?.models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  自定义模型ID
                </label>
                <input
                  type="text"
                  value={config.customModel}
                  onChange={(e) => handleConfigChange('customModel', e.target.value)}
                  placeholder="自定义模型ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* 高级参数 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Cpu className="w-4 h-4 mr-2" />
                高级参数
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature ({config.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => handleConfigChange('temperature', e.target.value)}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">创造性 (0-2)</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4000"
                    value={config.maxTokens}
                    onChange={(e) => handleConfigChange('maxTokens', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top P ({config.topP})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.topP}
                    onChange={(e) => handleConfigChange('topP', e.target.value)}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">多样性 (0-1)</div>
                </div>
              </div>
            </div>
            
            {/* 测试连接 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTest}
                disabled={testing || !config.apiKey}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {testing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    测试中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    测试连接
                  </>
                )}
              </button>
              
              {testing && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>正在验证API连接...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          保存配置
        </button>
      </div>
    </>
  )
}

// MCP管理器组件
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
      toast.success('MCP配置已添加')
    } catch (error) {
      toast.error('JSON格式错误，请检查配置')
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
        toast.success('MCP配置导入成功')
      } catch (error) {
        toast.error('文件格式错误，请确保是有效的JSON文件')
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteConfig = (id) => {
    const updated = mcpConfigs.filter(config => config.id !== id)
    setMcpConfigs(updated)
    localStorage.setItem('mcp-configs', JSON.stringify(updated))
    toast.success('配置已删除')
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
      toast.success('配置已导出')
    } catch (error) {
      toast.error('导出失败')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">MCP协议管理器</h2>
            <p className="text-sm text-gray-600">管理Model Context Protocol配置</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2 inline" />
            导入JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAddConfig(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
          >
            添加配置
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 max-h-[500px] overflow-y-auto">
        {showAddConfig && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-xl p-4 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">添加新的MCP配置</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  rows={6}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddConfig}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  保存配置
                </button>
                <button
                  onClick={() => setShowAddConfig(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {mcpConfigs.length > 0 ? (
          <div className="space-y-4">
            {mcpConfigs.map((config) => (
              <div key={config.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{config.name}</h4>
                    <p className="text-sm text-gray-600">{config.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      创建于: {new Date(config.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExportConfig(config)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="导出配置"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfig(config.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除配置"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {config.config}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无MCP配置</h3>
            <p className="text-gray-600 mb-4">添加您的第一个MCP协议配置</p>
            <button
              onClick={() => setShowAddConfig(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              添加配置
            </button>
          </div>
        )}
      </div>

      <div className="border-t bg-gray-50 p-4">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">关于MCP协议:</p>
          <ul className="space-y-1 text-xs">
            <li>• Model Context Protocol - AI模型上下文协议</li>
            <li>• 支持JSON格式配置导入/导出</li>
            <li>• 可配置多个MCP服务器连接</li>
            <li>• 增强AI模型的上下文理解能力</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Layout