import React, { useState } from 'react'
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
  TrendingUp
} from 'lucide-react'
import useDataStore from '../store/dataStore'

const JobMatching = () => {
  const { jobMatches, addJobMatch } = useDataStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setSearching(true)
    
    try {
      // 模拟搜索延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 生成模拟职位数据
      const mockJobs = [
        {
          title: '高级前端工程师',
          company: '字节跳动',
          location: '北京',
          salary: '25K-40K',
          experience: '3-5年',
          matchScore: 92,
          description: '负责前端架构设计和核心功能开发',
          requirements: ['React', 'TypeScript', 'Node.js'],
          benefits: ['五险一金', '股票期权', '弹性工作']
        },
        {
          title: '前端开发工程师',
          company: '腾讯',
          location: '深圳',
          salary: '20K-35K',
          experience: '2-4年',
          matchScore: 88,
          description: '参与产品前端开发和用户体验优化',
          requirements: ['Vue.js', 'JavaScript', 'CSS3'],
          benefits: ['五险一金', '年终奖', '培训机会']
        },
        {
          title: 'React开发工程师',
          company: '美团',
          location: '上海',
          salary: '22K-38K',
          experience: '3-5年',
          matchScore: 85,
          description: '开发和维护React应用，优化性能',
          requirements: ['React', 'Redux', 'Webpack'],
          benefits: ['五险一金', '餐补', '交通补贴']
        }
      ]
      
      setSearchResults(mockJobs)
      
      // 添加到匹配记录
      mockJobs.forEach(job => {
        addJobMatch({
          ...job,
          searchTerm,
          searchLocation: location
        })
      })
      
    } catch (error) {
      console.error('搜索失败:', error)
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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">智能职位匹配</h1>
          <p className="text-gray-600">
            基于简历分析，为您推荐最匹配的职位机会
          </p>
        </div>
        
        {/* 搜索区域 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索职位、公司或技能关键词"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={searching || !searchTerm.trim()}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
            >
              {searching ? '搜索中...' : '搜索职位'}
            </button>
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
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">正在搜索职位...</h3>
              <p className="text-gray-600">AI正在为您匹配最合适的职位机会</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
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
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
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
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(job.matchScore)}`}>
                          {job.matchScore}% 匹配
                        </span>
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
                      <p className="text-gray-700 mb-3">{job.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                      <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
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
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索职位</h3>
            <p className="text-gray-600 mb-4">输入关键词，AI将为您匹配最合适的职位</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default JobMatching