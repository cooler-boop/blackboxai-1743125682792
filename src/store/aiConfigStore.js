import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AI_PROVIDERS = {
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

const useAIConfigStore = create(
  persist(
    (set, get) => ({
      configs: {},
      activeProvider: 'openai',
      
      // 获取所有提供商
      getProviders: () => AI_PROVIDERS,
      
      // 获取提供商配置
      getProviderConfig: (providerId) => {
        return get().configs[providerId] || {
          apiKey: '',
          baseUrl: AI_PROVIDERS[providerId]?.defaultBaseUrl || '',
          model: AI_PROVIDERS[providerId]?.models[0] || '',
          customModel: ''
        }
      },
      
      // 更新提供商配置
      updateProviderConfig: (providerId, config) => {
        set(state => ({
          configs: {
            ...state.configs,
            [providerId]: {
              ...state.configs[providerId],
              ...config
            }
          }
        }))
      },
      
      // 设置活跃提供商
      setActiveProvider: (providerId) => {
        set({ activeProvider: providerId })
      },
      
      // 测试连接
      testConnection: async (providerId) => {
        const config = get().getProviderConfig(providerId)
        
        if (!config.apiKey) {
          throw new Error('API密钥不能为空')
        }
        
        try {
          // 这里应该调用实际的API测试
          // 暂时模拟测试结果
          await new Promise(resolve => setTimeout(resolve, 1000))
          return { success: true, message: '连接成功' }
        } catch (error) {
          throw new Error('连接失败: ' + error.message)
        }
      },
      
      // 获取当前活跃配置
      getActiveConfig: () => {
        const { activeProvider, configs } = get()
        return {
          provider: activeProvider,
          config: configs[activeProvider] || {}
        }
      }
    }),
    {
      name: 'ai-config-storage'
    }
  )
)

export default useAIConfigStore