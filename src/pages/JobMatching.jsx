import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star,
  Filter,
  Briefcase,
  Building,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Settings,
  BarChart3,
  Cpu,
  Database
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import { jobMatchOrchestrator } from '../utils/jobMatchOrchestrator'
import toast from 'react-hot-toast'

const JobMatching = () => {
  const { jobMatches, addJobMatch } = useDataStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [systemStatus, setSystemStatus] = useState(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState({
    salaryMin: '',
    experience: '',
    companySize: '',
    industry: ''
  })
  
  useEffect(() => {
    // 初始化系统并获取状态
    initializeSystem()
  }, [])
  
  const initializeSystem = async () => {
    try {
      await jobMatchOrchestrator.initialize()
      const status = jobMatchOrchestrator.getStatus()
      setSystemStatus(status)
      console.log('Job matching system initialized:', status)
    } catch (error) {
      console.error('Failed to initialize job matching system:', error)
      toast.error('系统初始化失败，将使用基础匹配模式')
    }
  }
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('请输入搜索关键词')
      return
    }
    
    setSearching(true)
    
    try {
      // 构建搜索请求
      const searchRequest = {
        query: searchTerm,
        location,
        filters: {
          ...filters,
          salaryMin: filters.salaryMin ? parseInt(filters.salaryMin) : undefined
        },
        userProfile: {
          id: 'current_user',
          skills: ['JavaScript', 'React', 'Node.js'], // 从用户数据获取
          experience: '3年',
          preferredLocations: location ? [location] : [],
          expectedSalary: '20K-35K'
        },
        limit: 10
      }
      
      // 调用高级匹配算法
      const result = await jobMatchOrchestrator.matchJobs(searchRequest)
      
      setSearchResults(result.jobs)
      
      // 添加到匹配记录
      result.jobs.forEach(job => {
        addJobMatch({
          ...job,
          searchTerm,
          searchLocation: location,
          algorithm: result.algorithm,
          latency: result.latency
        })
      })
      
      toast.success(`找到 ${result.jobs.length} 个匹配职位 (${result.latency}ms)`)
      
    } catch (error) {
      console.error('搜索失败:', error)
      toast.error('搜索失败，请稍后重试')
    } finally {
      setSearching(false)
    }
  }
  
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }
  
  const getAlgorithmBadge = (algorithm) => {
    const badges = {
      'advanced_ltr_v2.1': { text: 'LTR算法', color: 'bg-purple-100 text-purple-700' },
      'fallback_simple': { text: '基础算法', color: 'bg-gray-100 text-gray-700' }
    }
    
    return badges[algorithm] || badges['fallback_simple']
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            智能职位匹配系统 v2.1
          </h1>
          <p className="text-gray-600">
            基于LTR算法和向量检索的高级职位推荐引擎
          </p>
          
          {/* 系统状态指示器 */}
          {systemStatus && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${systemStatus.initialized ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    {systemStatus.initialized ? '系统就绪' : '系统离线'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    向量库: {systemStatus.components?.vectorStore?.vectorCount || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">
                    LTR模型: {systemStatus.components?.ltrModel?.isLoaded ? '已加载' : '未加载'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 搜索区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* 主搜索栏 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="搜索职位、公司或技能关键词"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="md:w-48">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="城市"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={searching || !searchTerm.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                {searching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                    搜索中...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2 inline" />
                    AI搜索
                  </>
                )}
              </button>
            </div>
            
            {/* 高级筛选 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>高级筛选</span>
              </button>
              
              {systemStatus && (
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>查询次数: {systemStatus.metrics?.totalQueries || 0}</span>
                  <span>平均延迟: {Math.round(systemStatus.metrics?.avgLatency || 0)}ms</span>
                </div>
              )}
            </div>
            
            {/* 高级筛选面板 */}
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低薪资</label>
                  <input
                    type="number"
                    placeholder="如: 15"
                    value={filters.salaryMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">工作经验</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">不限</option>
                    <option value="0年">应届生</option>
                    <option value="1年">1年经验</option>
                    <option value="3年">3年经验</option>
                    <option value="5年">5年经验</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公司规模</label>
                  <select
                    value={filters.companySize}
                    onChange={(e) => setFilters(prev => ({ ...prev, companySize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">不限</option>
                    <option value="初创">初创公司</option>
                    <option value="小型">小型公司</option>
                    <option value="中型">中型公司</option>
                    <option value="大型">大型公司</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">不限</option>
                    <option value="互联网">互联网</option>
                    <option value="金融">金融</option>
                    <option value="教育">教育</option>
                    <option value="医疗">医疗</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* 搜索进度 */}
        {searching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI正在智能匹配职位...</h3>
              <p className="text-gray-600 mb-4">使用LTR算法和向量检索技术为您找到最佳职位</p>
              
              {/* 算法流程指示器 */}
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span>双通道召回</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  <span>特征构建</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>LTR排序</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 搜索结果 */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                搜索结果 ({searchResults.length})
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Zap className="w-4 h-4" />
                  <span>AI算法增强</span>
                </div>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>按匹配度排序</option>
                  <option>按薪资排序</option>
                  <option>按发布时间排序</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {searchResults.map((job, index) => (
                <motion.div
                  key={job.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
                          {job.matchScore}% 匹配
                        </span>
                        {job.algorithm && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlgorithmBadge(job.algorithm.source || 'unknown').color}`}>
                            {getAlgorithmBadge(job.algorithm.source || 'unknown').text}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                    </div>
                  </div>
                  
                  {/* 算法详情 */}
                  {job.algorithm && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        算法评分详情
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">关键词匹配:</span>
                          <span className="ml-2 font-medium">{Math.round((job.algorithm.keywordScore || 0) * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">语义相似度:</span>
                          <span className="ml-2 font-medium">{Math.round((job.algorithm.vectorScore || 0) * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">LTR评分:</span>
                          <span className="ml-2 font-medium">{Math.round((job.algorithm.ltrScore || 0) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 推荐理由 */}
                  {job.reasons && job.reasons.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">推荐理由</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.reasons.map((reason, reasonIndex) => (
                          <span key={reasonIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 技能要求和福利 */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {job.requirements && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">技能要求</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, reqIndex) => (
                            <span key={reqIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {job.benefits && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">福利待遇</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, benefitIndex) => (
                            <span key={benefitIndex} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                      <span className="text-sm text-gray-500">2天前发布</span>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                        收藏
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        立即申请
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* 历史匹配记录 */}
        {jobMatches.length > 0 && searchResults.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">历史匹配记录</h2>
            </div>
            
            <div className="space-y-4">
              {jobMatches.slice(0, 5).map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
                      {job.algorithm && (
                        <p className="text-xs text-gray-400">算法: {job.algorithm} · 延迟: {job.latency}ms</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getMatchColor(job.matchScore).split(' ')[0]}`}>
                      {job.matchScore}%
                    </div>
                    <div className="text-xs text-gray-500">匹配度</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 空状态 */}
        {jobMatches.length === 0 && searchResults.length === 0 && !searching && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始智能职位搜索</h3>
            <p className="text-gray-600 mb-6">使用先进的LTR算法和向量检索技术，为您找到最匹配的职位</p>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">精准匹配</h4>
                <p className="text-sm text-gray-600">多维度特征分析</p>
              </div>
              <div className="text-center p-4">
                <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">实时排序</h4>
                <p className="text-sm text-gray-600">LTR算法优化</p>
              </div>
              <div className="text-center p-4">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">持续学习</h4>
                <p className="text-sm text-gray-600">算法自我优化</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default JobMatching