import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import useDataStore from '../store/dataStore'
import toast from 'react-hot-toast'

const ResumeUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [targetPosition, setTargetPosition] = useState('')
  const { addResume } = useDataStore()
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    if (!targetPosition.trim()) {
      toast.error('请先输入目标岗位')
      return
    }
    
    setUploading(true)
    
    try {
      // 模拟文件上传
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setUploading(false)
      setAnalyzing(true)
      
      // 模拟简历分析
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 生成模拟分析结果
      const analysisResult = {
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
        skills: [
          { name: 'JavaScript', level: Math.floor(Math.random() * 40) + 60 },
          { name: 'React', level: Math.floor(Math.random() * 40) + 60 },
          { name: '项目管理', level: Math.floor(Math.random() * 40) + 60 },
          { name: '团队协作', level: Math.floor(Math.random() * 40) + 60 }
        ],
        strengths: [
          '技术能力扎实，具备丰富的前端开发经验',
          '项目经验丰富，参与过多个大型项目',
          '学习能力强，能够快速适应新技术'
        ],
        improvements: [
          '建议增加更多的技术深度描述',
          '可以添加具体的项目成果和数据',
          '建议完善教育背景和认证信息'
        ],
        overallScore: Math.floor(Math.random() * 20) + 80
      }
      
      const resume = {
        fileName: file.name,
        fileSize: file.size,
        targetPosition,
        analysisResult,
        overallScore: analysisResult.overallScore
      }
      
      const savedResume = addResume(resume)
      
      toast.success('简历分析完成！')
      onUploadComplete?.(savedResume)
      
    } catch (error) {
      toast.error('上传失败: ' + error.message)
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }, [targetPosition, addResume, onUploadComplete])
  
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })
  
  if (uploading || analyzing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {uploading ? '正在上传简历...' : '正在分析简历...'}
        </h3>
        <p className="text-gray-600">
          {uploading ? '请稍候，文件上传中' : 'AI正在深度分析您的简历内容'}
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* 目标岗位输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          目标岗位 *
        </label>
        <input
          type="text"
          value={targetPosition}
          onChange={(e) => setTargetPosition(e.target.value)}
          placeholder="例如：前端工程师、产品经理、数据分析师"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          输入您的目标岗位，AI将针对性分析简历匹配度
        </p>
      </div>
      
      {/* 文件上传区域 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-primary-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? '释放文件开始上传' : '上传简历文件'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          拖拽文件到此处，或点击选择文件
        </p>
        
        <div className="text-sm text-gray-500">
          <p>支持格式：PDF、DOC、DOCX、TXT</p>
          <p>文件大小：最大 10MB</p>
        </div>
      </div>
      
      {/* 已选择的文件 */}
      {acceptedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">已选择文件：</h4>
          {acceptedFiles.map(file => (
            <div key={file.name} className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* 功能说明 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">AI分析功能：</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 岗位匹配度评估</li>
          <li>• 技能关键词提取</li>
          <li>• 简历结构优化建议</li>
          <li>• 综合评分和改进方案</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeUpload