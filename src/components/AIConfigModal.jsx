import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Check, AlertCircle, Eye, EyeOff } from 'lucide-react'
import useAIConfigStore from '../store/aiConfigStore'
import toast from 'react-hot-toast'

const AIConfigModal = ({ isOpen, onClose }) => {
  const {
    getProviders,
    activeProvider,
    setActiveProvider,
    getProviderConfig,
    updateProviderConfig,
    testConnection
  } = useAIConfigStore()
  
  const [selectedProvider, setSelectedProvider] = useState(activeProvider)
  const [config, setConfig] = useState(() => getProviderConfig(activeProvider))
  const [testing, setTesting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  
  const providers = getProviders()
  
  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId)
    setConfig(getProviderConfig(providerId))
  }
  
  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }
  
  const handleTest = async () => {
    setTesting(true)
    try {
      await testConnection(selectedProvider)
      toast.success('连接测试成功！')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTesting(false)
    }
  }
  
  const handleSave = () => {
    updateProviderConfig(selectedProvider, config)
    setActiveProvider(selectedProvider)
    toast.success('配置已保存')
    onClose()
  }
  
  const maskApiKey = (key) => {
    if (!key) return ''
    if (key.length <= 8) return '*'.repeat(key.length)
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
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
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AIConfigModal