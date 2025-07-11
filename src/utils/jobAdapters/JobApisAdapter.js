/**
 * JobApis多平台适配器
 * 支持Monster、ZipRecruiter、Craigslist等
 */

export class JobApisAdapter {
  constructor() {
    // 使用代理服务器解决CORS问题
    const proxyUrl = import.meta.env.VITE_PROXY_URL || ''
    const baseUrl = import.meta.env.VITE_JOBAPIS_URL || 'https://api.jobapis.com'
    this.baseUrl = proxyUrl ? `${proxyUrl}${baseUrl}` : baseUrl
    this.apiKey = import.meta.env.VITE_JOBAPIS_KEY
    this.supportedProviders = ['monster', 'ziprecruiter', 'craigslist', 'careerbuilder']
    this.rateLimiter = new Map()
  }

  /**
   * 搜索职位
   * @param {Object} params - 搜索参数
   * @returns {Promise<Array>} 标准化职位数据
   */
  async searchJobs(params) {
    const {
      query,
      location = '',
      provider = 'monster',
      limit = 20,
      page = 1
    } = params

    try {
      if (!this.supportedProviders.includes(provider)) {
        throw new Error(`Unsupported provider: ${provider}`)
      }

      // 检查速率限制
      if (this.isRateLimited(provider)) {
        throw new Error(`Rate limited for ${provider}`)
      }

      const searchParams = new URLSearchParams({
        q: query,
        l: location,
        limit: limit.toString(),
        page: page.toString()
      })

      if (this.apiKey) {
        searchParams.append('api_key', this.apiKey)
      }

      const response = await fetch(`${this.baseUrl}/${provider}/jobs?${searchParams}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'JobSearchApp/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`JobApis ${provider} error: ${response.status}`)
      }

      const data = await response.json()
      
      // 记录请求
      this.recordRequest(provider)
      
      return this.normalizeJobApisData(data.jobs || [], provider)
      
    } catch (error) {
      console.error(`JobApis ${provider} search failed:`, error)
      throw error
    }
  }

  /**
   * 批量搜索多个平台
   * @param {Object} params - 搜索参数
   * @returns {Promise<Array>} 合并的职位数据
   */
  async searchMultipleProviders(params) {
    const { providers = this.supportedProviders, ...searchParams } = params
    
    const searchPromises = providers.map(provider => 
      this.searchJobs({ ...searchParams, provider })
        .catch(error => {
          console.warn(`Provider ${provider} failed:`, error.message)
          return []
        })
    )

    const results = await Promise.all(searchPromises)
    
    // 合并和去重
    const allJobs = results.flat()
    return this.deduplicateJobs(allJobs)
  }

  /**
   * 标准化JobApis数据
   */
  normalizeJobApisData(jobs, provider) {
    return jobs.map(job => ({
      id: `jobapis_${provider}_${job.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || job.name || '',
      company: job.company || job.company_name || '',
      location: job.location || job.city || '',
      salary: this.formatJobApisSalary(job),
      experience: job.experience || '',
      education: job.education || '',
      description: job.description || job.summary || '',
      requirements: this.extractRequirements(job.description),
      benefits: this.extractBenefits(job.description),
      publishTime: job.date_posted || job.created_at || new Date().toISOString(),
      source: 'jobapis',
      sourceUrl: job.url || job.link || '#',
      companySize: job.company_size || '',
      industry: job.industry || '',
      jobType: job.job_type || job.type || '',
      remote: this.isRemoteJob(job),
      // JobApis特有字段
      originalProvider: provider,
      jobId: job.id,
      category: job.category,
      subcategory: job.subcategory
    }))
  }

  /**
   * 格式化薪资
   */
  formatJobApisSalary(job) {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min}-${job.salary_max}`
    }
    
    if (job.salary) {
      return job.salary
    }
    
    return ''
  }

  /**
   * 提取技能要求
   */
  extractRequirements(description) {
    if (!description) return []
    
    const skillPatterns = [
      /(?:required|必需|需要)[\s\S]*?(?:skills|技能|能力)[\s\S]*?:([\s\S]*?)(?:\n\n|\.|。)/gi,
      /(?:qualifications|资格)[\s\S]*?:([\s\S]*?)(?:\n\n|\.|。)/gi
    ]
    
    const skills = []
    
    skillPatterns.forEach(pattern => {
      const matches = description.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const extracted = this.extractSkillsFromText(match)
          skills.push(...extracted)
        })
      }
    })
    
    return [...new Set(skills)]
  }

  /**
   * 从文本中提取技能
   */
  extractSkillsFromText(text) {
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go',
      'React', 'Vue', 'Angular', 'Node.js', 'Django', 'Flask',
      'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git'
    ]
    
    const found = []
    const lowerText = text.toLowerCase()
    
    skillKeywords.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        found.push(skill)
      }
    })
    
    return found
  }

  /**
   * 提取福利信息
   */
  extractBenefits(description) {
    if (!description) return []
    
    const benefitPatterns = [
      /(?:benefits|福利|待遇)[\s\S]*?:([\s\S]*?)(?:\n\n|\.|。)/gi,
      /(?:we offer|我们提供)[\s\S]*?([\s\S]*?)(?:\n\n|\.|。)/gi
    ]
    
    const benefits = []
    
    benefitPatterns.forEach(pattern => {
      const matches = description.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const extracted = this.extractBenefitsFromText(match)
          benefits.push(...extracted)
        })
      }
    })
    
    return [...new Set(benefits)]
  }

  /**
   * 从文本中提取福利
   */
  extractBenefitsFromText(text) {
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'flexible hours', 'remote work',
      'stock options', 'bonus', 'gym membership'
    ]
    
    const found = []
    const lowerText = text.toLowerCase()
    
    benefitKeywords.forEach(benefit => {
      if (lowerText.includes(benefit)) {
        found.push(benefit)
      }
    })
    
    return found
  }

  /**
   * 判断是否为远程工作
   */
  isRemoteJob(job) {
    const remoteKeywords = ['remote', 'work from home', 'telecommute', 'virtual']
    const searchText = `${job.title} ${job.location} ${job.description}`.toLowerCase()
    
    return remoteKeywords.some(keyword => searchText.includes(keyword))
  }

  /**
   * 职位去重
   */
  deduplicateJobs(jobs) {
    const seen = new Set()
    return jobs.filter(job => {
      const key = `${job.title}_${job.company}_${job.location}`.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * 速率限制
   */
  isRateLimited(provider) {
    const now = Date.now()
    const requests = this.rateLimiter.get(provider) || []
    
    // 清理1小时前的请求
    const recentRequests = requests.filter(time => now - time < 60 * 60 * 1000)
    
    // 每小时最多100个请求
    return recentRequests.length >= 100
  }

  recordRequest(provider) {
    const now = Date.now()
    const requests = this.rateLimiter.get(provider) || []
    requests.push(now)
    this.rateLimiter.set(provider, requests)
  }
}