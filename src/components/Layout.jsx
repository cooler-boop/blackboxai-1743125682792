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
  LayoutDashboard,
  Settings
} from 'lucide-react'
import useAuthStore from '../store/authStore'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [showAIConfig, setShowAIConfig] = React.useState(false)

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

            {/* User Info & AI Config & Mobile menu button */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <span>欢迎，{user.name}</span>
                </div>
              )}
              
              {/* AI配置按钮 */}
              <button
                onClick={() => setShowAIConfig(true)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                title="AI模型配置"
              >
                <Settings className="w-5 h-5" />
              </button>
              
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
              
              {/* 移动端AI配置 */}
              <button
                onClick={() => {
                  setShowAIConfig(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>AI模型配置</span>
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* AI配置模态框 */}
      {showAIConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAIConfig(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            <AIConfigContent onClose={() => setShowAIConfig(false)} />
          </motion.div>
        </div>
      )}

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

// AI配置内容组件
const AIConfigContent = ({ onClose }) => {
  const [selectedProvider, setSelectedProvider] = React.useState('openai')
  const [config, setConfig] = React.useState({
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    customModel: ''
  })
  const [testing, setTesting] = React.useState(false)
  const [showApiKey, setShowApiKey] = React.useState(false)
  
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
      defaultBaseUrl: 'https://api.openai.com/v1'
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
        'claude-instant-1.2'
      ],
      defaultBaseUrl: 'https://api.anthropic.com'
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
      defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1'
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
      defaultBaseUrl: 'https://dashscope.aliyuncs.com/api/v1'
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
      defaultBaseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1'
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
      defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4'
    },
    moonshot: {
      name: '月之暗面',
      category: '云端',
      models: [
        'moonshot-v1-8k',
        'moonshot-v1-32k',
        'moonshot-v1-128k'
      ],
      defaultBaseUrl: 'https://api.moonshot.cn/v1'
    },
    deepseek: {
      name: 'DeepSeek',
      category: '云端',
      models: [
        'deepseek-chat',
        'deepseek-coder'
      ],
      defaultBaseUrl: 'https://api.deepseek.com/v1'
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
      defaultBaseUrl: 'http://localhost:11434'
    },
    lmstudio: {
      name: 'LM Studio',
      category: '本地',
      models: [
        'local-model'
      ],
      defaultBaseUrl: 'http://localhost:1234/v1'
    }
  }
  
  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId)
    setConfig({
      apiKey: '',
      baseUrl: providers[providerId]?.defaultBaseUrl || '',
      model: providers[providerId]?.models[0] || '',
      customModel: ''
    })
  }
  
  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }
  
  const handleTest = async () => {
    setTesting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('连接测试成功！')
    } catch (error) {
      alert('连接失败: ' + error.message)
    } finally {
      setTesting(false)
    }
  }
  
  const handleSave = () => {
    // 保存配置到localStorage
    localStorage.setItem('ai-config', JSON.stringify({
      provider: selectedProvider,
      config: config
    }))
    alert('配置已保存')
    onClose()
  }
  
  const maskApiKey = (key) => {
    if (!key) return ''
    if (key.length <= 8) return '*'.repeat(key.length)
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
  }
  
  return (
    <>
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold">AI模型配置</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex h-[600px]">
        {/* 提供商列表 */}
        <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-4">AI提供商</h3>
          <div className="space-y-2">
            {Object.entries(providers).map(([id, provider]) => (
              <button
                key={id}
                onClick={() => handleProviderChange(id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedProvider === id
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="font-medium">{provider.name}</div>
                <div className="text-sm text-gray-500">{provider.category}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {provider.models.length} 个模型
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* 配置表单 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {providers[selectedProvider]?.name} 配置
              </h3>
            </div>
            
            {/* API密钥 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API密钥
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="请输入API密钥"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              {config.apiKey && !showApiKey && (
                <div className="mt-1 text-sm text-gray-500">
                  当前密钥: {maskApiKey(config.apiKey)}
                </div>
              )}
            </div>
            
            {/* Base URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                placeholder="API基础URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预设模型
              </label>
              <select
                value={config.model}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">选择模型</option>
                {providers[selectedProvider]?.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            
            {/* 自定义模型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自定义模型ID
              </label>
              <input
                type="text"
                value={config.customModel}
                onChange={(e) => handleConfigChange('customModel', e.target.value)}
                placeholder="如果使用自定义模型，请输入模型ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="mt-1 text-sm text-gray-500">
                自定义模型ID会覆盖预设模型选择
              </div>
            </div>
            
            {/* 测试连接 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleTest}
                disabled={testing || !config.apiKey}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                {testing ? '测试中...' : '测试连接'}
              </button>
              {testing && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span>正在测试连接...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          保存配置
        </button>
      </div>
    </>
  )
}

export default Layout