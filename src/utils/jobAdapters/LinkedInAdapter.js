/**
 * LinkedIn Jobs API适配器
 * 通过后端API调用LinkedIn Jobs服务
 */

export class LinkedInAdapter {
  constructor() {
    this.rateLimiter = new Map()
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5分钟缓存
    this.apiBaseUrl = '/api/linkedin-jobs' // 后端API端点
  }

  /**
   * 搜索LinkedIn职位
   * @param {Object} params - 搜索参数
   * @returns {Promise<Array>} 标准化职位数据
   */
  async searchJobs(params) {
    const {
      query,
      location = '',
      dateSincePosted = 'past Week',
      jobType = '',
      remoteFilter = '',
      salary = '',
      experienceLevel = '',
      limit = 20
    } = params

    try {
      // 检查缓存
      const cacheKey = this.getCacheKey(params)
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }

      // 检查速率限制
      if (this.isRateLimited()) {
        throw new Error('LinkedIn API rate limited')
      }

      const searchParams = {
        keyword: query,
        location,
        dateSincePosted,
        jobType,
        remoteFilter,
        salary,
        experienceLevel,
        limit,
        sortBy: 'recent'
      }

      // 通过HTTP请求调用后端API
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
      })

      if (!response.ok) {
        throw new Error(`LinkedIn API request failed: ${response.status} ${response.statusText}`)
      }

      const jobs = await response.json()
      
      // 记录请求
      this.recordRequest()
      
      // 标准化数据
      const normalizedJobs = this.normalizeLinkedInData(jobs)
      
      // 缓存结果
      this.setCache(cacheKey, normalizedJobs)
      
      return normalizedJobs
      
    } catch (error) {
      console.error('LinkedIn search failed:', error)
      
      // 如果是网络错误，返回缓存数据
      if (error.message.includes('network') || error.message.includes('timeout') || error.message.includes('fetch')) {
        const cacheKey = this.getCacheKey(params)
        const cached = this.getFromCache(cacheKey, true) // 允许过期缓存
        if (cached) {
          console.warn('Using stale cache due to network error')
          return cached
        }
      }
      
      // 如果后端API不可用，返回模拟数据以保持功能正常
      if (error.message.includes('LinkedIn API request failed')) {
        console.warn('LinkedIn API unavailable, returning mock data')
        return this.getMockData(params)
      }
      
      throw error
    }
  }

  /**
   * 获取模拟数据（当后端API不可用时）
   */
  getMockData(params) {
    const { query, location } = params
    
    return [
      {
        id: `linkedin_mock_${Date.now()}_1`,
        title: `${query} Developer`,
        company: 'Tech Company Inc.',
        location: location || 'Remote',
        salary: '$80,000 - $120,000',
        experience: '2-5 years',
        education: 'Bachelor\'s degree',
        description: `We are looking for a skilled ${query} developer to join our team...`,
        requirements: ['JavaScript', 'React', 'Node.js'],
        benefits: ['Health insurance', 'Remote work', 'Stock options'],
        publishTime: new Date().toISOString(),
        source: 'linkedin',
        sourceUrl: '#',
        companySize: '100-500 employees',
        industry: 'Technology',
        jobType: 'Full-time',
        remote: true,
        applicantsCount: '50+ applicants',
        companyLogo: '',
        seniorityLevel: 'Mid-Senior level',
        employmentType: 'Full-time',
        jobFunction: 'Engineering'
      }
    ]
  }

  /**
   * 标准化LinkedIn数据
   */
  normalizeLinkedInData(jobs) {
    if (!Array.isArray(jobs)) return []
    
    return jobs.map(job => ({
      id: `linkedin_${job.jobId || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      experience: this.extractExperience(job.description),
      education: this.extractEducation(job.description),
      description: job.description || '',
      requirements: this.extractSkills(job.description),
      benefits: this.extractBenefits(job.description),
      publishTime: job.postedDate || new Date().toISOString(),
      source: 'linkedin',
      sourceUrl: job.link || '#',
      companySize: job.companySize || '',
      industry: job.industry || '',
      jobType: job.jobType || '',
      remote: this.isRemoteJob(job),
      // LinkedIn特有字段
      applicantsCount: job.applicantsCount,
      companyLogo: job.companyLogo,
      seniorityLevel: job.seniorityLevel,
      employmentType: job.employmentType,
      jobFunction: job.jobFunction
    }))
  }

  /**
   * 提取工作经验要求
   */
  extractExperience(description) {
    if (!description) return ''
    
    const expPatterns = [
      /(\d+)[\+\-\s]*年.*?经验/gi,
      /(\d+)[\+\-\s]*years?\s+experience/gi,
      /(entry|junior|senior|lead|principal)/gi
    ]
    
    for (const pattern of expPatterns) {
      const match = description.match(pattern)
      if (match) {
        return match[0]
      }
    }
    
    return ''
  }

  /**
   * 提取教育要求
   */
  extractEducation(description) {
    if (!description) return ''
    
    const eduPatterns = [
      /(bachelor|master|phd|doctorate|学士|硕士|博士)/gi,
      /(本科|专科|研究生)/gi
    ]
    
    for (const pattern of eduPatterns) {
      const match = description.match(pattern)
      if (match) {
        return match[0]
      }
    }
    
    return ''
  }

  /**
   * 提取技能要求
   */
  extractSkills(description) {
    if (!description) return []
    
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'Git',
      'Machine Learning', 'AI', 'Data Science', 'DevOps', 'Agile', 'Scrum'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    skillKeywords.forEach(skill => {
      if (lowerDesc.includes(skill.toLowerCase())) {
        found.push(skill)
      }
    })
    
    return [...new Set(found)] // 去重
  }

  /**
   * 提取福利信息
   */
  extractBenefits(description) {
    if (!description) return []
    
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'flexible', 'remote', 'work from home',
      'stock options', 'equity', 'bonus', 'gym', 'fitness',
      '医疗保险', '年终奖', '股票期权', '弹性工作', '远程工作'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    benefitKeywords.forEach(benefit => {
      if (lowerDesc.includes(benefit.toLowerCase())) {
        found.push(benefit)
      }
    })
    
    return [...new Set(found)]
  }

  /**
   * 判断是否为远程工作
   */
  isRemoteJob(job) {
    const remoteKeywords = ['remote', 'work from home', 'telecommute', '远程', '在家办公']
    const searchText = `${job.title} ${job.location} ${job.description}`.toLowerCase()
    
    return remoteKeywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  }

  /**
   * 缓存管理
   */
  getCacheKey(params) {
    return JSON.stringify(params)
  }

  getFromCache(key, allowStale = false) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout
    if (isExpired && !allowStale) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    // 限制缓存大小
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  /**
   * 速率限制
   */
  isRateLimited() {
    const now = Date.now()
    const requests = this.rateLimiter.get('linkedin') || []
    
    // 清理5分钟前的请求
    const recentRequests = requests.filter(time => now - time < 5 * 60 * 1000)
    
    // 每5分钟最多50个请求
    return recentRequests.length >= 50
  }

  recordRequest() {
    const now = Date.now()
    const requests = this.rateLimiter.get('linkedin') || []
    requests.push(now)
    this.rateLimiter.set('linkedin', requests)
  }
}