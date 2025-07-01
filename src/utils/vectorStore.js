/**
 * 向量存储服务 - 支持语义检索
 * 实现双通道召回：关键词倒排 + 向量检索
 */

export class VectorStore {
  constructor() {
    this.vectors = new Map() // 存储向量数据
    this.index = new Map()   // 倒排索引
    this.metadata = new Map() // 元数据
    this.isInitialized = false
  }

  /**
   * 初始化向量存储
   */
  async initialize() {
    try {
      // 加载已保存的向量数据
      const savedVectors = localStorage.getItem('vector-store-data')
      if (savedVectors) {
        const data = JSON.parse(savedVectors)
        this.vectors = new Map(data.vectors)
        this.index = new Map(data.index)
        this.metadata = new Map(data.metadata)
      }
      this.isInitialized = true
      console.log('VectorStore initialized successfully')
    } catch (error) {
      console.error('Failed to initialize VectorStore:', error)
    }
  }

  /**
   * 添加文档向量
   * @param {string} id - 文档ID
   * @param {Array} vector - 向量数据
   * @param {Object} metadata - 元数据
   */
  async addVector(id, vector, metadata = {}) {
    this.vectors.set(id, vector)
    this.metadata.set(id, metadata)
    
    // 构建倒排索引
    if (metadata.text) {
      const keywords = this.extractKeywords(metadata.text)
      keywords.forEach(keyword => {
        if (!this.index.has(keyword)) {
          this.index.set(keyword, new Set())
        }
        this.index.get(keyword).add(id)
      })
    }
    
    await this.persist()
  }

  /**
   * 向量相似度搜索
   * @param {Array} queryVector - 查询向量
   * @param {number} topK - 返回前K个结果
   * @returns {Array} 相似度结果
   */
  async vectorSearch(queryVector, topK = 10) {
    const similarities = []
    
    for (const [id, vector] of this.vectors) {
      const similarity = this.cosineSimilarity(queryVector, vector)
      similarities.push({ id, similarity, metadata: this.metadata.get(id) })
    }
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
  }

  /**
   * 关键词搜索
   * @param {string} query - 查询文本
   * @param {number} topK - 返回前K个结果
   * @returns {Array} 搜索结果
   */
  async keywordSearch(query, topK = 50) {
    const keywords = this.extractKeywords(query)
    const candidates = new Map()
    
    keywords.forEach(keyword => {
      const docs = this.index.get(keyword)
      if (docs) {
        docs.forEach(docId => {
          candidates.set(docId, (candidates.get(docId) || 0) + 1)
        })
      }
    })
    
    return Array.from(candidates.entries())
      .map(([id, score]) => ({
        id,
        score,
        metadata: this.metadata.get(id)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  /**
   * 混合搜索 - 关键词 + 向量
   * @param {string} query - 查询文本
   * @param {Array} queryVector - 查询向量
   * @param {number} topK - 返回前K个结果
   * @returns {Array} 混合搜索结果
   */
  async hybridSearch(query, queryVector, topK = 10) {
    // 关键词召回
    const keywordResults = await this.keywordSearch(query, 50)
    
    // 向量召回
    const vectorResults = await this.vectorSearch(queryVector, 50)
    
    // 合并去重
    const mergedResults = new Map()
    
    // 添加关键词结果
    keywordResults.forEach(result => {
      mergedResults.set(result.id, {
        ...result,
        keywordScore: result.score,
        vectorScore: 0
      })
    })
    
    // 添加向量结果
    vectorResults.forEach(result => {
      if (mergedResults.has(result.id)) {
        mergedResults.get(result.id).vectorScore = result.similarity
      } else {
        mergedResults.set(result.id, {
          ...result,
          keywordScore: 0,
          vectorScore: result.similarity
        })
      }
    })
    
    // 计算综合分数
    const finalResults = Array.from(mergedResults.values()).map(result => ({
      ...result,
      finalScore: result.keywordScore * 0.3 + result.vectorScore * 0.7
    }))
    
    return finalResults
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK)
  }

  /**
   * 余弦相似度计算
   */
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
    
    if (normA === 0 || normB === 0) return 0
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * 提取关键词
   */
  extractKeywords(text) {
    return text.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)
      .filter(word => !this.isStopWord(word))
  }

  /**
   * 停用词过滤
   */
  isStopWord(word) {
    const stopWords = ['的', '是', '在', '有', '和', '与', '或', '但', '而', '了', '着', '过']
    return stopWords.includes(word)
  }

  /**
   * 持久化存储
   */
  async persist() {
    try {
      const data = {
        vectors: Array.from(this.vectors.entries()),
        index: Array.from(this.index.entries()).map(([key, value]) => [key, Array.from(value)]),
        metadata: Array.from(this.metadata.entries())
      }
      localStorage.setItem('vector-store-data', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to persist vector store:', error)
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      vectorCount: this.vectors.size,
      indexSize: this.index.size,
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  /**
   * 估算内存使用
   */
  estimateMemoryUsage() {
    let size = 0
    for (const vector of this.vectors.values()) {
      size += vector.length * 8 // 假设每个数字8字节
    }
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }
}

// 全局向量存储实例
export const vectorStore = new VectorStore()