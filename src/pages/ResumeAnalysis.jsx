import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import ResumeUpload from '../components/ResumeUpload'

const ResumeAnalysis = () => {
  const { resumes } = useDataStore()
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedResume, setSelectedResume] = useState(null)
  
  const handleUploadComplete = (resume) => {
    setSelectedResume(resume)
    setActiveTab('analysis')
  }
  
  const renderSkillChart = (skills) => {
    return (
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                className="bg-primary-500 h-2 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">简历分析</h1>
          <p className="text-gray-600">
            AI智能分析简历，提供专业的优化建议
          </p>
        </div>
        
        {/* 标签页 */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upload', name: '上传简历', icon: Upload },
                { id: 'analysis', name: '分析结果', icon: BarChart3 },
                { id: 'history', name: '历史记录', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'upload' && (
              <ResumeUpload onUploadComplete={handleUploadComplete} />
            )}
            
            {activeTab === 'analysis' && selectedResume && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 基本信息 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">简历信息</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">文件名：</span>
                      <span className="font-medium">{selectedResume.fileName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">目标岗位：</span>
                      <span className="font-medium">{selectedResume.targetPosition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">分析时间：</span>
                      <span className="font-medium">
                        {new Date(selectedResume.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">文件大小：</span>
                      <span className="font-medium">
                        {(selectedResume.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 综合评分 */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(selectedResume.overallScore)}`}>
                      {selectedResume.overallScore}
                    </div>
                    <div className="text-gray-600 mb-4">综合评分</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className={`h-3 rounded-full ${getScoreBg(selectedResume.overallScore)}`}
                        style={{ width: `${selectedResume.overallScore}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      岗位匹配度：{selectedResume.analysisResult.matchScore}%
                    </div>
                  </div>
                </div>
                
                {/* 技能分析 */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">技能分析</h3>
                  {renderSkillChart(selectedResume.analysisResult.skills)}
                </div>
                
                {/* 优势分析 */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">优势分析</h3>
                  <div className="space-y-3">
                    {selectedResume.analysisResult.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 改进建议 */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
                  <div className="space-y-3">
                    {selectedResume.analysisResult.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex justify-center space-x-4">
                  <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    导出报告
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    分析新简历
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'analysis' && !selectedResume && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分析结果</h3>
                <p className="text-gray-600 mb-4">请先上传简历进行分析</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  上传简历
                </button>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-4">
                {resumes.length > 0 ? (
                  resumes.map(resume => (
                    <div key={resume.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">{resume.fileName}</h4>
                            <p className="text-sm text-gray-500">{resume.targetPosition}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(resume.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(resume.overallScore)}`}>
                              {resume.overallScore}
                            </div>
                            <div className="text-xs text-gray-500">综合评分</div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedResume(resume)
                                setActiveTab('analysis')
                              }}
                              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史记录</h3>
                    <p className="text-gray-600">还没有分析过的简历</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ResumeAnalysis