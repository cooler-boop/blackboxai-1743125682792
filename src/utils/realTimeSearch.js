/**
 * 实时搜索引擎 - 参考Algolia、Elasticsearch等成熟方案
 * 实现毫秒级响应的智能搜索体验
 */

export class RealTimeSearchEngine {
  constructor() {
    this.searchIndex = new Map() // 搜索索引
    this.suggestionTrie = new TrieNode() // 前缀树用于自动补全
    this.searchHistory = new Map() // 搜索历史
    this.popularQueries = new Map() // 热门搜索
    this.cache = new Map() // 搜索结果缓存
    this.debounceTimers = new Map() // 防抖定时器
    this.isInitialized = false
    
    // 配置参数
    this.config = {
      debounceDelay: 150, // 防抖延迟
      cacheSize: 1000, // 缓存大小
      suggestionLimit: 8, // 建议数量
      minQueryLength: 1, // 最小查询长度
      maxCacheAge: 5 * 60 * 1000, // 缓存过期时间 5分钟
      enableFuzzySearch: true, // 启用模糊搜索
      enableHighlight: true, // 启用高亮
      enableAnalytics: true // 启用搜索分析
    }
    
    // 搜索分析数据
    this.analytics = {
      totalSearches: 0,
      avgResponseTime: 0,
      popularTerms: new Map(),
      searchTrends: []
    }
  }

  /**
   * 初始化搜索引擎
   */
  async initialize() {
    try {
      // 加载已保存的数据
      await this.loadPersistedData()
      
      // 构建搜索索引
      await this.buildSearchIndex()
      
      // 初始化热门搜索
      this.initializePopularQueries()
      
      this.isInitialized = true
      console.log('RealTimeSearchEngine initialized successfully')
    } catch (error) {
      console.error('Failed to initialize search engine:', error)
    }
  }

  /**
   * 实时搜索主入口
   * @param {string} query - 搜索查询
   * @param {Object} options - 搜索选项
   * @returns {Promise<Object>} 搜索结果
   */
  async search(query, options = {}) {
    const startTime = performance.now()
    
    try {
      // 参数验证
      if (!query || query.length < this.config.minQueryLength) {
        return this.getEmptyResult()
      }

      // 查询预处理
      const processedQuery = this.preprocessQuery(query)
      const cacheKey = this.getCacheKey(processedQuery, options)

      // 缓存检查
      const cachedResult = this.getFromCache(cacheKey)
      if (cachedResult) {
        this.recordAnalytics(query, performance.now() - startTime, true)
        return cachedResult
      }

      // 执行搜索
      const searchResult = await this.performSearch(processedQuery, options)
      
      // 缓存结果
      this.setCache(cacheKey, searchResult)
      
      // 记录搜索历史和分析
      this.recordSearch(query, searchResult)
      this.recordAnalytics(query, performance.now() - startTime, false)
      
      return searchResult
      
    } catch (error) {
      console.error('Search failed:', error)
      return this.getErrorResult(error)
    }
  }

  /**
   * 实时搜索建议
   * @param {string} query - 查询字符串
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消函数
   */
  searchWithSuggestions(query, callback) {
    const searchId = Date.now().toString()
    
    // 清除之前的防抖定时器
    if (this.debounceTimers.has('suggestions')) {
      clearTimeout(this.debounceTimers.get('suggestions'))
    }
    
    // 设置新的防抖定时器
    const timer = setTimeout(async () => {
      try {
        const [searchResults, suggestions] = await Promise.all([
          this.search(query),
          this.getSuggestions(query)
        ])
        
        callback({
          searchId,
          query,
          results: searchResults.hits,
          suggestions,
          totalHits: searchResults.totalHits,
          processingTime: searchResults.processingTime,
          timestamp: Date.now()
        })
      } catch (error) {
        callback({
          searchId,
          query,
          error: error.message,
          timestamp: Date.now()
        })
      }
    }, this.config.debounceDelay)
    
    this.debounceTimers.set('suggestions', timer)
    
    // 返回取消函数
    return () => {
      clearTimeout(timer)
      this.debounceTimers.delete('suggestions')
    }
  }

  /**
   * 获取搜索建议
   * @param {string} query - 查询字符串
   * @returns {Array} 建议列表
   */
  async getSuggestions(query) {
    if (!query || query.length < this.config.minQueryLength) {
      return this.getPopularSuggestions()
    }

    const suggestions = []
    
    // 1. 前缀匹配建议
    const prefixSuggestions = this.suggestionTrie.search(query.toLowerCase())
    suggestions.push(...prefixSuggestions.slice(0, 4))
    
    // 2. 历史搜索建议
    const historySuggestions = this.getHistorySuggestions(query)
    suggestions.push(...historySuggestions.slice(0, 2))
    
    // 3. 热门搜索建议
    const popularSuggestions = this.getPopularSuggestions(query)
    suggestions.push(...popularSuggestions.slice(0, 2))
    
    // 去重并限制数量
    const uniqueSuggestions = [...new Set(suggestions)]
    return uniqueSuggestions.slice(0, this.config.suggestionLimit)
  }

  /**
   * 执行搜索
   * @param {string} query - 处理后的查询
   * @param {Object} options - 搜索选项
   * @returns {Object} 搜索结果
   */
  async performSearch(query, options = {}) {
    const {
      filters = {},
      sort = 'relevance',
      page = 0,
      hitsPerPage = 20,
      facets = [],
      highlightPreTag = '<mark>',
      highlightPostTag = '</mark>'
    } = options

    // 多阶段搜索策略
    const searchStrategies = [
      () => this.exactMatch(query, filters),
      () => this.fuzzyMatch(query, filters),
      () => this.semanticMatch(query, filters),
      () => this.fallbackMatch(query, filters)
    ]

    let allResults = []
    
    // 执行搜索策略
    for (const strategy of searchStrategies) {
      const results = await strategy()
      allResults.push(...results)
    }

    // 去重和排序
    const uniqueResults = this.deduplicateResults(allResults)
    const sortedResults = this.sortResults(uniqueResults, sort, query)
    
    // 分页
    const startIndex = page * hitsPerPage
    const endIndex = startIndex + hitsPerPage
    const paginatedResults = sortedResults.slice(startIndex, endIndex)
    
    // 高亮处理
    const highlightedResults = this.config.enableHighlight 
      ? this.highlightResults(paginatedResults, query, highlightPreTag, highlightPostTag)
      : paginatedResults

    // 构建facets
    const facetCounts = this.buildFacets(sortedResults, facets)

    return {
      hits: highlightedResults,
      totalHits: sortedResults.length,
      page,
      hitsPerPage,
      processingTime: 0, // 会在调用处计算
      query,
      facets: facetCounts,
      exhaustiveNbHits: true
    }
  }

  /**
   * 精确匹配
   */
  async exactMatch(query, filters) {
    const results = []
    const queryLower = query.toLowerCase()
    
    for (const [id, doc] of this.searchIndex) {
      if (this.applyFilters(doc, filters)) {
        const score = this.calculateExactScore(doc, queryLower)
        if (score > 0) {
          results.push({ ...doc, _score: score, _matchType: 'exact' })
        }
      }
    }
    
    return results
  }

  /**
   * 模糊匹配
   */
  async fuzzyMatch(query, filters) {
    if (!this.config.enableFuzzySearch) return []
    
    const results = []
    const queryLower = query.toLowerCase()
    
    for (const [id, doc] of this.searchIndex) {
      if (this.applyFilters(doc, filters)) {
        const score = this.calculateFuzzyScore(doc, queryLower)
        if (score > 0.3) { // 模糊匹配阈值
          results.push({ ...doc, _score: score * 0.8, _matchType: 'fuzzy' })
        }
      }
    }
    
    return results
  }

  /**
   * 语义匹配
   */
  async semanticMatch(query, filters) {
    // 这里可以集成向量搜索
    const results = []
    // 简化实现，实际可以调用向量搜索服务
    return results
  }

  /**
   * 兜底匹配
   */
  async fallbackMatch(query, filters) {
    const results = []
    const queryWords = query.toLowerCase().split(/\s+/)
    
    for (const [id, doc] of this.searchIndex) {
      if (this.applyFilters(doc, filters)) {
        const score = this.calculatePartialScore(doc, queryWords)
        if (score > 0.1) {
          results.push({ ...doc, _score: score * 0.5, _matchType: 'partial' })
        }
      }
    }
    
    return results
  }

  /**
   * 计算精确匹配分数
   */
  calculateExactScore(doc, query) {
    let score = 0
    const searchableText = this.getSearchableText(doc).toLowerCase()
    
    // 标题完全匹配
    if (doc.title && doc.title.toLowerCase() === query) {
      score += 100
    }
    
    // 标题包含查询
    if (doc.title && doc.title.toLowerCase().includes(query)) {
      score += 50
    }
    
    // 描述包含查询
    if (doc.description && doc.description.toLowerCase().includes(query)) {
      score += 20
    }
    
    // 关键词匹配
    if (doc.requirements) {
      const matchedKeywords = doc.requirements.filter(req => 
        req.toLowerCase().includes(query) || query.includes(req.toLowerCase())
      )
      score += matchedKeywords.length * 10
    }
    
    return score
  }

  /**
   * 计算模糊匹配分数
   */
  calculateFuzzyScore(doc, query) {
    const searchableText = this.getSearchableText(doc).toLowerCase()
    const words = query.split(/\s+/)
    let totalScore = 0
    
    for (const word of words) {
      const wordScore = this.calculateWordFuzzyScore(searchableText, word)
      totalScore += wordScore
    }
    
    return totalScore / words.length
  }

  /**
   * 计算单词模糊分数
   */
  calculateWordFuzzyScore(text, word) {
    if (text.includes(word)) return 1.0
    
    // 编辑距离模糊匹配
    const words = text.split(/\s+/)
    let maxScore = 0
    
    for (const textWord of words) {
      const similarity = this.calculateStringSimilarity(word, textWord)
      maxScore = Math.max(maxScore, similarity)
    }
    
    return maxScore
  }

  /**
   * 计算字符串相似度
   */
  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * 计算编辑距离
   */
  levenshteinDistance(str1, str2) {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  /**
   * 高亮搜索结果
   */
  highlightResults(results, query, preTag, postTag) {
    const queryWords = query.toLowerCase().split(/\s+/)
    
    return results.map(result => {
      const highlighted = { ...result }
      
      // 高亮标题
      if (result.title) {
        highlighted._highlightResult = {
          title: { value: this.highlightText(result.title, queryWords, preTag, postTag) }
        }
      }
      
      // 高亮描述
      if (result.description) {
        highlighted._highlightResult = {
          ...highlighted._highlightResult,
          description: { value: this.highlightText(result.description, queryWords, preTag, postTag) }
        }
      }
      
      return highlighted
    })
  }

  /**
   * 高亮文本
   */
  highlightText(text, queryWords, preTag, postTag) {
    let highlightedText = text
    
    for (const word of queryWords) {
      if (word.length < 2) continue
      
      const regex = new RegExp(`(${this.escapeRegExp(word)})`, 'gi')
      highlightedText = highlightedText.replace(regex, `${preTag}$1${postTag}`)
    }
    
    return highlightedText
  }

  /**
   * 转义正则表达式特殊字符
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * 构建搜索索引
   */
  async buildSearchIndex() {
    // 从向量存储获取数据
    const { vectorStore } = await import('./vectorStore.js')
    await vectorStore.initialize()
    
    const stats = vectorStore.getStats()
    if (stats.vectorCount > 0) {
      // 从向量存储构建搜索索引
      for (const [id, metadata] of vectorStore.metadata) {
        this.searchIndex.set(id, {
          id,
          ...metadata,
          _searchableText: this.getSearchableText(metadata)
        })
        
        // 添加到前缀树
        if (metadata.title) {
          this.suggestionTrie.insert(metadata.title.toLowerCase())
        }
        if (metadata.requirements) {
          metadata.requirements.forEach(req => {
            this.suggestionTrie.insert(req.toLowerCase())
          })
        }
      }
    }
    
    console.log(`Built search index with ${this.searchIndex.size} documents`)
  }

  /**
   * 获取可搜索文本
   */
  getSearchableText(doc) {
    const parts = []
    
    if (doc.title) parts.push(doc.title)
    if (doc.company) parts.push(doc.company)
    if (doc.location) parts.push(doc.location)
    if (doc.description) parts.push(doc.description)
    if (doc.requirements) parts.push(...doc.requirements)
    if (doc.benefits) parts.push(...doc.benefits)
    
    return parts.join(' ')
  }

  /**
   * 应用过滤器
   */
  applyFilters(doc, filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue
      
      switch (key) {
        case 'location':
          if (!doc.location?.includes(value)) return false
          break
        case 'salaryMin':
          const salary = this.parseSalary(doc.salary)
          if (salary < value) return false
          break
        case 'experience':
          if (!this.matchExperience(doc.experience, value)) return false
          break
        case 'companySize':
          if (doc.companySize !== value) return false
          break
        default:
          if (doc[key] !== value) return false
      }
    }
    
    return true
  }

  /**
   * 解析薪资
   */
  parseSalary(salary) {
    if (!salary) return 0
    const numbers = salary.match(/\d+/g)
    return numbers ? parseInt(numbers[0]) : 0
  }

  /**
   * 匹配经验要求
   */
  matchExperience(docExp, filterExp) {
    if (!docExp || !filterExp) return true
    
    const docYears = parseInt(docExp.match(/\d+/)?.[0] || '0')
    const filterYears = parseInt(filterExp.match(/\d+/)?.[0] || '0')
    
    return docYears <= filterYears + 1 // 允许1年误差
  }

  /**
   * 排序结果
   */
  sortResults(results, sort, query) {
    switch (sort) {
      case 'relevance':
        return results.sort((a, b) => b._score - a._score)
      case 'date':
        return results.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
      case 'salary':
        return results.sort((a, b) => this.parseSalary(b.salary) - this.parseSalary(a.salary))
      default:
        return results
    }
  }

  /**
   * 去重结果
   */
  deduplicateResults(results) {
    const seen = new Set()
    return results.filter(result => {
      if (seen.has(result.id)) return false
      seen.add(result.id)
      return true
    })
  }

  /**
   * 构建facets
   */
  buildFacets(results, facetNames) {
    const facets = {}
    
    for (const facetName of facetNames) {
      facets[facetName] = {}
      
      for (const result of results) {
        const value = result[facetName]
        if (value) {
          facets[facetName][value] = (facets[facetName][value] || 0) + 1
        }
      }
    }
    
    return facets
  }

  /**
   * 缓存管理
   */
  getCacheKey(query, options) {
    return `${query}:${JSON.stringify(options)}`
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.config.maxCacheAge) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  setCache(key, data) {
    if (this.cache.size >= this.config.cacheSize) {
      // 删除最旧的缓存
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 查询预处理
   */
  preprocessQuery(query) {
    return query
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  /**
   * 记录搜索
   */
  recordSearch(query, result) {
    // 记录搜索历史
    this.searchHistory.set(query, {
      query,
      timestamp: Date.now(),
      resultCount: result.totalHits
    })
    
    // 更新热门搜索
    const count = this.popularQueries.get(query) || 0
    this.popularQueries.set(query, count + 1)
    
    // 限制历史记录大小
    if (this.searchHistory.size > 1000) {
      const oldestKey = this.searchHistory.keys().next().value
      this.searchHistory.delete(oldestKey)
    }
  }

  /**
   * 记录分析数据
   */
  recordAnalytics(query, responseTime, fromCache) {
    if (!this.config.enableAnalytics) return
    
    this.analytics.totalSearches++
    this.analytics.avgResponseTime = (
      (this.analytics.avgResponseTime * (this.analytics.totalSearches - 1) + responseTime) / 
      this.analytics.totalSearches
    )
    
    // 记录热门搜索词
    const count = this.analytics.popularTerms.get(query) || 0
    this.analytics.popularTerms.set(query, count + 1)
    
    // 记录搜索趋势
    this.analytics.searchTrends.push({
      query,
      timestamp: Date.now(),
      responseTime,
      fromCache
    })
    
    // 限制趋势数据大小
    if (this.analytics.searchTrends.length > 10000) {
      this.analytics.searchTrends = this.analytics.searchTrends.slice(-5000)
    }
  }

  /**
   * 获取历史搜索建议
   */
  getHistorySuggestions(query) {
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    for (const [historyQuery] of this.searchHistory) {
      if (historyQuery.toLowerCase().includes(queryLower) && historyQuery !== query) {
        suggestions.push(historyQuery)
      }
    }
    
    return suggestions.slice(0, 3)
  }

  /**
   * 获取热门搜索建议
   */
  getPopularSuggestions(query = '') {
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    // 按热度排序
    const sortedPopular = Array.from(this.popularQueries.entries())
      .sort((a, b) => b[1] - a[1])
    
    for (const [popularQuery] of sortedPopular) {
      if (!query || popularQuery.toLowerCase().includes(queryLower)) {
        suggestions.push(popularQuery)
      }
    }
    
    return suggestions.slice(0, 5)
  }

  /**
   * 初始化热门搜索
   */
  initializePopularQueries() {
    const defaultPopular = [
      '前端工程师',
      'React开发',
      'Vue.js',
      'Node.js',
      'Python',
      'Java开发',
      '全栈工程师',
      '产品经理',
      'UI设计师',
      '数据分析'
    ]
    
    defaultPopular.forEach((query, index) => {
      this.popularQueries.set(query, 10 - index)
    })
  }

  /**
   * 加载持久化数据
   */
  async loadPersistedData() {
    try {
      const savedData = localStorage.getItem('realtime-search-data')
      if (savedData) {
        const data = JSON.parse(savedData)
        
        if (data.searchHistory) {
          this.searchHistory = new Map(data.searchHistory)
        }
        
        if (data.popularQueries) {
          this.popularQueries = new Map(data.popularQueries)
        }
        
        if (data.analytics) {
          this.analytics = { ...this.analytics, ...data.analytics }
          this.analytics.popularTerms = new Map(data.analytics.popularTerms || [])
        }
      }
    } catch (error) {
      console.error('Failed to load persisted search data:', error)
    }
  }

  /**
   * 持久化数据
   */
  async persistData() {
    try {
      const data = {
        searchHistory: Array.from(this.searchHistory.entries()),
        popularQueries: Array.from(this.popularQueries.entries()),
        analytics: {
          ...this.analytics,
          popularTerms: Array.from(this.analytics.popularTerms.entries())
        }
      }
      
      localStorage.setItem('realtime-search-data', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to persist search data:', error)
    }
  }

  /**
   * 获取空结果
   */
  getEmptyResult() {
    return {
      hits: [],
      totalHits: 0,
      page: 0,
      hitsPerPage: 20,
      processingTime: 0,
      query: '',
      facets: {},
      exhaustiveNbHits: true
    }
  }

  /**
   * 获取错误结果
   */
  getErrorResult(error) {
    return {
      hits: [],
      totalHits: 0,
      page: 0,
      hitsPerPage: 20,
      processingTime: 0,
      query: '',
      facets: {},
      exhaustiveNbHits: true,
      error: error.message
    }
  }

  /**
   * 获取搜索分析
   */
  getAnalytics() {
    return {
      ...this.analytics,
      cacheHitRate: this.cache.size > 0 ? 
        Array.from(this.cache.values()).filter(c => c.hits > 0).length / this.cache.size : 0,
      indexSize: this.searchIndex.size,
      popularQueries: Array.from(this.popularQueries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    }
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * 重建索引
   */
  async rebuildIndex() {
    this.searchIndex.clear()
    this.suggestionTrie = new TrieNode()
    await this.buildSearchIndex()
  }
}

/**
 * 前缀树节点
 */
class TrieNode {
  constructor() {
    this.children = new Map()
    this.isEndOfWord = false
    this.word = null
    this.frequency = 0
  }

  /**
   * 插入单词
   */
  insert(word) {
    let current = this
    
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode())
      }
      current = current.children.get(char)
    }
    
    current.isEndOfWord = true
    current.word = word
    current.frequency++
  }

  /**
   * 搜索前缀
   */
  search(prefix) {
    let current = this
    
    // 找到前缀节点
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return []
      }
      current = current.children.get(char)
    }
    
    // 收集所有以该前缀开始的单词
    const results = []
    this.collectWords(current, results)
    
    // 按频率排序
    return results
      .sort((a, b) => b.frequency - a.frequency)
      .map(item => item.word)
  }

  /**
   * 收集单词
   */
  collectWords(node, results) {
    if (node.isEndOfWord) {
      results.push({
        word: node.word,
        frequency: node.frequency
      })
    }
    
    for (const child of node.children.values()) {
      this.collectWords(child, results)
    }
  }
}

// 全局实时搜索引擎实例
export const realTimeSearchEngine = new RealTimeSearchEngine()