// MCP (Model Context Protocol) 协议实现
// 用于增强AI模型的上下文理解和工具调用能力

/**
 * MCP协议管理器
 */
export class MCPManager {
  constructor() {
    this.servers = new Map()
    this.tools = new Map()
    this.resources = new Map()
    this.prompts = new Map()
    this.isInitialized = false
  }

  /**
   * 初始化MCP管理器
   */
  async initialize() {
    try {
      const savedConfigs = localStorage.getItem('mcp-configs')
      if (savedConfigs) {
        const configs = JSON.parse(savedConfigs)
        for (const config of configs) {
          await this.loadConfiguration(JSON.parse(config.config))
        }
      }
      this.isInitialized = true
      console.log('MCP Manager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize MCP Manager:', error)
    }
  }

  /**
   * 加载MCP配置
   * @param {Object} config - MCP配置对象
   */
  async loadConfiguration(config) {
    if (config.mcpServers) {
      for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
        await this.registerServer(name, serverConfig)
      }
    }

    if (config.tools) {
      for (const [name, toolConfig] of Object.entries(config.tools)) {
        this.registerTool(name, toolConfig)
      }
    }

    if (config.resources) {
      for (const [name, resourceConfig] of Object.entries(config.resources)) {
        this.registerResource(name, resourceConfig)
      }
    }

    if (config.prompts) {
      for (const [name, promptConfig] of Object.entries(config.prompts)) {
        this.registerPrompt(name, promptConfig)
      }
    }
  }

  /**
   * 注册MCP服务器
   * @param {string} name - 服务器名称
   * @param {Object} config - 服务器配置
   */
  async registerServer(name, config) {
    try {
      const server = new MCPServer(name, config)
      await server.initialize()
      this.servers.set(name, server)
      console.log(`MCP Server '${name}' registered successfully`)
    } catch (error) {
      console.error(`Failed to register MCP Server '${name}':`, error)
    }
  }

  /**
   * 注册工具
   * @param {string} name - 工具名称
   * @param {Object} config - 工具配置
   */
  registerTool(name, config) {
    const tool = new MCPTool(name, config)
    this.tools.set(name, tool)
    console.log(`MCP Tool '${name}' registered`)
  }

  /**
   * 注册资源
   * @param {string} name - 资源名称
   * @param {Object} config - 资源配置
   */
  registerResource(name, config) {
    const resource = new MCPResource(name, config)
    this.resources.set(name, resource)
    console.log(`MCP Resource '${name}' registered`)
  }

  /**
   * 注册提示模板
   * @param {string} name - 提示名称
   * @param {Object} config - 提示配置
   */
  registerPrompt(name, config) {
    const prompt = new MCPPrompt(name, config)
    this.prompts.set(name, prompt)
    console.log(`MCP Prompt '${name}' registered`)
  }

  /**
   * 调用工具
   * @param {string} toolName - 工具名称
   * @param {Object} params - 参数
   * @returns {Promise<any>} 工具执行结果
   */
  async callTool(toolName, params = {}) {
    const tool = this.tools.get(toolName)
    if (!tool) {
      throw new Error(`Tool '${toolName}' not found`)
    }

    try {
      return await tool.execute(params)
    } catch (error) {
      console.error(`Tool '${toolName}' execution failed:`, error)
      throw error
    }
  }

  /**
   * 获取资源
   * @param {string} resourceName - 资源名称
   * @returns {Promise<any>} 资源内容
   */
  async getResource(resourceName) {
    const resource = this.resources.get(resourceName)
    if (!resource) {
      throw new Error(`Resource '${resourceName}' not found`)
    }

    try {
      return await resource.fetch()
    } catch (error) {
      console.error(`Resource '${resourceName}' fetch failed:`, error)
      throw error
    }
  }

  /**
   * 渲染提示模板
   * @param {string} promptName - 提示名称
   * @param {Object} variables - 变量
   * @returns {string} 渲染后的提示
   */
  renderPrompt(promptName, variables = {}) {
    const prompt = this.prompts.get(promptName)
    if (!prompt) {
      throw new Error(`Prompt '${promptName}' not found`)
    }

    return prompt.render(variables)
  }

  /**
   * 增强AI请求上下文
   * @param {Object} request - 原始请求
   * @returns {Object} 增强后的请求
   */
  async enhanceContext(request) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const enhancedRequest = { ...request }

    // 添加可用工具信息
    if (this.tools.size > 0) {
      enhancedRequest.tools = Array.from(this.tools.values()).map(tool => tool.getSchema())
    }

    // 添加相关资源
    const relevantResources = await this.findRelevantResources(request.messages)
    if (relevantResources.length > 0) {
      enhancedRequest.resources = relevantResources
    }

    // 应用相关提示模板
    const relevantPrompts = this.findRelevantPrompts(request.messages)
    if (relevantPrompts.length > 0) {
      enhancedRequest.systemPrompts = relevantPrompts
    }

    return enhancedRequest
  }

  /**
   * 查找相关资源
   * @param {Array} messages - 消息列表
   * @returns {Promise<Array>} 相关资源
   */
  async findRelevantResources(messages) {
    const relevantResources = []
    const lastMessage = messages[messages.length - 1]?.content || ''

    for (const [name, resource] of this.resources) {
      if (resource.isRelevant(lastMessage)) {
        try {
          const content = await resource.fetch()
          relevantResources.push({
            name,
            type: resource.type,
            content
          })
        } catch (error) {
          console.warn(`Failed to fetch resource '${name}':`, error)
        }
      }
    }

    return relevantResources
  }

  /**
   * 查找相关提示模板
   * @param {Array} messages - 消息列表
   * @returns {Array} 相关提示
   */
  findRelevantPrompts(messages) {
    const relevantPrompts = []
    const lastMessage = messages[messages.length - 1]?.content || ''

    for (const [name, prompt] of this.prompts) {
      if (prompt.isRelevant(lastMessage)) {
        relevantPrompts.push({
          name,
          content: prompt.template
        })
      }
    }

    return relevantPrompts
  }

  /**
   * 获取状态信息
   * @returns {Object} 状态信息
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      servers: this.servers.size,
      tools: this.tools.size,
      resources: this.resources.size,
      prompts: this.prompts.size,
      serverList: Array.from(this.servers.keys()),
      toolList: Array.from(this.tools.keys()),
      resourceList: Array.from(this.resources.keys()),
      promptList: Array.from(this.prompts.keys())
    }
  }
}

/**
 * MCP服务器类
 */
class MCPServer {
  constructor(name, config) {
    this.name = name
    this.config = config
    this.isConnected = false
    this.capabilities = []
  }

  async initialize() {
    try {
      // 模拟服务器连接
      await this.connect()
      await this.handshake()
      this.isConnected = true
    } catch (error) {
      console.error(`Failed to initialize server '${this.name}':`, error)
      throw error
    }
  }

  async connect() {
    // 模拟连接过程
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  async handshake() {
    // 模拟握手过程
    this.capabilities = ['tools', 'resources', 'prompts']
    return new Promise(resolve => setTimeout(resolve, 50))
  }

  async sendRequest(method, params) {
    if (!this.isConnected) {
      throw new Error(`Server '${this.name}' is not connected`)
    }

    // 模拟请求处理
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          result: { success: true, data: params }
        })
      }, 100)
    })
  }
}

/**
 * MCP工具类
 */
class MCPTool {
  constructor(name, config) {
    this.name = name
    this.config = config
    this.description = config.description || ''
    this.parameters = config.parameters || {}
    this.handler = config.handler || this.defaultHandler
  }

  async execute(params) {
    try {
      return await this.handler(params)
    } catch (error) {
      console.error(`Tool '${this.name}' execution error:`, error)
      throw error
    }
  }

  async defaultHandler(params) {
    // 默认处理器 - 根据工具类型执行不同逻辑
    switch (this.config.type) {
      case 'resume_analyzer':
        return this.analyzeResume(params)
      case 'interview_scorer':
        return this.scoreInterview(params)
      case 'job_matcher':
        return this.matchJobs(params)
      case 'skill_assessor':
        return this.assessSkills(params)
      default:
        return { result: 'Tool executed successfully', params }
    }
  }

  async analyzeResume(params) {
    const { resumeText, targetPosition } = params
    
    // 模拟简历分析
    return {
      matchScore: Math.floor(Math.random() * 30) + 70,
      skills: [
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 78 },
        { name: '项目管理', level: 72 }
      ],
      suggestions: [
        '增加更多技术深度描述',
        '添加具体项目成果数据',
        '完善教育背景信息'
      ]
    }
  }

  async scoreInterview(params) {
    const { question, answer } = params
    
    // 模拟面试评分
    return {
      score: Math.floor(Math.random() * 30) + 70,
      feedback: '回答结构清晰，建议增加具体案例',
      criteria: {
        relevance: 85,
        clarity: 78,
        depth: 72
      }
    }
  }

  async matchJobs(params) {
    const { userProfile, jobRequirements } = params
    
    // 模拟职位匹配
    return {
      matchScore: Math.floor(Math.random() * 40) + 60,
      reasons: ['技能匹配度高', '经验符合要求'],
      recommendations: ['提升系统设计能力', '增加项目管理经验']
    }
  }

  async assessSkills(params) {
    const { skills, targetLevel } = params
    
    // 模拟技能评估
    return {
      currentLevel: 'intermediate',
      gaps: ['系统设计', '高并发处理'],
      learningPath: [
        { skill: '数据结构', estimatedTime: '2周' },
        { skill: '算法优化', estimatedTime: '3周' }
      ]
    }
  }

  getSchema() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters
    }
  }
}

/**
 * MCP资源类
 */
class MCPResource {
  constructor(name, config) {
    this.name = name
    this.config = config
    this.type = config.type || 'text'
    this.uri = config.uri || ''
    this.keywords = config.keywords || []
  }

  async fetch() {
    try {
      switch (this.type) {
        case 'file':
          return await this.fetchFile()
        case 'api':
          return await this.fetchAPI()
        case 'database':
          return await this.fetchDatabase()
        default:
          return this.config.content || ''
      }
    } catch (error) {
      console.error(`Failed to fetch resource '${this.name}':`, error)
      throw error
    }
  }

  async fetchFile() {
    // 模拟文件读取
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Content from file: ${this.uri}`)
      }, 100)
    })
  }

  async fetchAPI() {
    // 模拟API调用
    try {
      const response = await fetch(this.uri)
      return await response.text()
    } catch (error) {
      return `Failed to fetch from API: ${this.uri}`
    }
  }

  async fetchDatabase() {
    // 模拟数据库查询
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Data from database: ${this.config.query}`)
      }, 150)
    })
  }

  isRelevant(text) {
    if (this.keywords.length === 0) return false
    
    const lowerText = text.toLowerCase()
    return this.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    )
  }
}

/**
 * MCP提示模板类
 */
class MCPPrompt {
  constructor(name, config) {
    this.name = name
    this.config = config
    this.template = config.template || ''
    this.variables = config.variables || []
    this.triggers = config.triggers || []
  }

  render(variables = {}) {
    let rendered = this.template
    
    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      rendered = rendered.replace(regex, value)
    }
    
    return rendered
  }

  isRelevant(text) {
    if (this.triggers.length === 0) return false
    
    const lowerText = text.toLowerCase()
    return this.triggers.some(trigger => 
      lowerText.includes(trigger.toLowerCase())
    )
  }
}

// 创建全局MCP管理器实例
export const mcpManager = new MCPManager()

// 预定义的工具配置
export const defaultTools = {
  resume_analyzer: {
    type: 'resume_analyzer',
    description: '分析简历内容，提供匹配度评分和改进建议',
    parameters: {
      resumeText: { type: 'string', required: true },
      targetPosition: { type: 'string', required: true }
    }
  },
  interview_scorer: {
    type: 'interview_scorer',
    description: '评估面试回答质量，提供评分和反馈',
    parameters: {
      question: { type: 'string', required: true },
      answer: { type: 'string', required: true }
    }
  },
  job_matcher: {
    type: 'job_matcher',
    description: '匹配用户画像与职位要求，计算匹配度',
    parameters: {
      userProfile: { type: 'object', required: true },
      jobRequirements: { type: 'object', required: true }
    }
  },
  skill_assessor: {
    type: 'skill_assessor',
    description: '评估技能水平，生成学习路径建议',
    parameters: {
      skills: { type: 'array', required: true },
      targetLevel: { type: 'string', required: false }
    }
  }
}

// 预定义的提示模板
export const defaultPrompts = {
  interview_coach: {
    template: `你是一位专业的面试教练。请根据以下信息为候选人提供面试指导：

问题：{{question}}
候选人回答：{{answer}}

请从以下几个维度进行评估：
1. 回答的相关性和准确性
2. 表达的清晰度和逻辑性
3. 内容的深度和广度
4. 改进建议和最佳实践

请提供建设性的反馈，帮助候选人提升面试表现。`,
    variables: ['question', 'answer'],
    triggers: ['面试', '回答', '评估', '反馈']
  },
  resume_optimizer: {
    template: `你是一位资深的简历优化专家。请分析以下简历内容：

简历内容：{{resumeContent}}
目标职位：{{targetPosition}}

请提供以下分析：
1. 简历与目标职位的匹配度
2. 关键技能和经验的突出程度
3. 简历结构和格式的专业性
4. 具体的优化建议和改进方向

请确保建议具体可行，有助于提升简历的竞争力。`,
    variables: ['resumeContent', 'targetPosition'],
    triggers: ['简历', '优化', '分析', '匹配']
  },
  career_advisor: {
    template: `你是一位经验丰富的职业规划顾问。基于以下信息为用户提供职业发展建议：

当前技能：{{currentSkills}}
职业目标：{{careerGoals}}
工作经验：{{experience}}

请提供：
1. 职业发展路径分析
2. 技能提升优先级建议
3. 学习资源和方法推荐
4. 短期和长期目标规划

请确保建议切实可行，符合当前市场趋势。`,
    variables: ['currentSkills', 'careerGoals', 'experience'],
    triggers: ['职业规划', '发展', '技能', '目标']
  }
}

// 初始化默认配置
export async function initializeDefaultMCP() {
  // 注册默认工具
  for (const [name, config] of Object.entries(defaultTools)) {
    mcpManager.registerTool(name, config)
  }
  
  // 注册默认提示模板
  for (const [name, config] of Object.entries(defaultPrompts)) {
    mcpManager.registerPrompt(name, config)
  }
  
  console.log('Default MCP configuration initialized')
}