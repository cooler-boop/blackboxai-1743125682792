/**
 * JobSpy适配器 - 支持LinkedIn、Indeed、Glassdoor等
 * 基于 JobSpy Python库的Node.js适配层
 */

export class JobSpyAdapter {
  constructor() {
    this.baseUrl = process.env.VITE_JOBSPY_API_URL || 'http://localhost:8000'
    this.supportedSites = ['linkedin', 'indeed', 'glassdoor', 'google_jobs', 'zip_recruiter']
    this.rateLimiter = new Map()
    this.proxyPool = []
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
      site = 'linkedin',
      results_wanted = 20,
      hours_old = 72,
      country = 'China'
    } = params

    try {
      // 检查速率限制
      if (this.isRateLimited(site)) {
        throw new Error(`Rate limited for ${site}`)
      }

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; JobSearchBot/1.0)'
        },
        body: JSON.stringify({
          site_name: site,
          search_term: query,
          location,
          results_wanted,
          hours_old,
          country_indeed: country,
          linkedin_fetch_description: true,
          proxy: this.getRandomProxy()
        })
      })

      if (!response.ok) {
        throw new Error(`JobSpy API error: ${response.status}`)
      }

      const data = await response.json()
      
      // 记录请求时间用于速率限制
      this.recordRequest(site)
      
      return this.normalizeJobSpyData(data.jobs || [])
      
    } catch (error) {
      console.error(`JobSpy search failed for ${site}:`, error)
      throw error
    }
  }

  /**
   * 标准化JobSpy数据格式
   */
  normalizeJobSpyData(jobs) {
    return jobs.map(job => ({
      id: `jobspy_${job.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: this.formatSalary(job.compensation),
      experience: job.experience || '',
      education: job.education || '',
      description: job.description || job.summary || '',
      requirements: this.extractRequirements(job.description),
      benefits: this.extractBenefits(job.description),
      publishTime: job.date_posted || new Date().toISOString(),
      source: 'jobspy',
      sourceUrl: job.job_url || '#',
      companySize: job.company_size || '',
      industry: job.industry || '',
      jobType: job.job_type || '',
      remote: job.is_remote || false,
      // JobSpy特有字段
      originalSite: job.site,
      jobLevel: job.job_level,
      companyIndustry: job.company_industry,
      companyRevenue: job.company_revenue,
      companyDescription: job.company_description
    }))
  }

  /**
   * 格式化薪资信息
   */
  formatSalary(compensation) {
    if (!compensation) return ''
    
    const { min_amount, max_amount, currency, interval } = compensation
    
    if (min_amount && max_amount) {
      const unit = interval === 'yearly' ? '年' : interval === 'monthly' ? '月' : '小时'
      return `${min_amount}-${max_amount} ${currency}/${unit}`
    }
    
    return compensation.raw || ''
  }

  /**
   * 提取技能要求
   */
  extractRequirements(description) {
    if (!description) return []
    
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Vue', 'Angular', 'Node.js',
      'TypeScript', 'CSS', 'HTML', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    skillKeywords.forEach(skill => {
      if (lowerDesc.includes(skill.toLowerCase())) {
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
    
    const benefitKeywords = [
      '五险一金', '年终奖', '股票期权', '弹性工作', '远程工作',
      '健身房', '免费午餐', '培训', '带薪假期', '医疗保险'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    benefitKeywords.forEach(benefit => {
      if (lowerDesc.includes(benefit)) {
        found.push(benefit)
      }
    })
    
    return found
  }

  /**
   * 速率限制检查
   */
  isRateLimited(site) {
    const now = Date.now()
    const requests = this.rateLimiter.get(site) || []
    
    // 清理1分钟前的请求
    const recentRequests = requests.filter(time => now - time < 60000)
    
    // 每分钟最多10个请求
    return recentRequests.length >= 10
  }

  /**
   * 记录请求时间
   */
  recordRequest(site) {
    const now = Date.now()
    const requests = this.rateLimiter.get(site) || []
    requests.push(now)
    this.rateLimiter.set(site, requests)
  }

  /**
   * 获取随机代理
   */
  getRandomProxy() {
    if (this.proxyPool.length === 0) return null
    return this.proxyPool[Math.floor(Math.random() * this.proxyPool.length)]
  }

  /**
   * 设置代理池
   */
  setProxyPool(proxies) {
    this.proxyPool = proxies
  }
}