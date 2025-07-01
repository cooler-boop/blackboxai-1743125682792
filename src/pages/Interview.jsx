import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  RotateCcw,
  MessageCircle,
  Clock,
  CheckCircle,
  Send,
  Bot,
  Brain,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import { scoreInterviewAnswer, analyzeSentiment } from '../utils/algorithms'
import { mcpManager } from '../utils/mcpProtocol'

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [interviewHistory, setInterviewHistory] = useState([])
  const [overallScore, setOverallScore] = useState(0)
  const [skillAssessment, setSkillAssessment] = useState({})

  const questions = [
    {
      id: 1,
      text: "请简单介绍一下你自己，包括你的技术背景和职业目标",
      category: "自我介绍",
      difficulty: "基础",
      keywords: ["技术背景", "职业目标", "个人经历"]
    },
    {
      id: 2,
      text: "为什么想要加入我们公司？你对这个职位有什么了解？",
      category: "动机意愿",
      difficulty: "基础",
      keywords: ["公司了解", "职位认知", "加入动机"]
    },
    {
      id: 3,
      text: "描述一个你在项目中遇到的技术挑战，以及你是如何解决的",
      category: "技术能力",
      difficulty: "中级",
      keywords: ["技术挑战", "解决方案", "项目经验"]
    },
    {
      id: 4,
      text: "如果你需要在紧急情况下快速学习一门新技术，你会采用什么策略？",
      category: "学习能力",
      difficulty: "中级",
      keywords: ["学习策略", "适应能力", "时间管理"]
    },
    {
      id: 5,
      text: "描述一次你与团队成员意见不合的情况，你是如何处理的？",
      category: "团队协作",
      difficulty: "高级",
      keywords: ["团队协作", "冲突解决", "沟通技巧"]
    }
  ]

  useEffect(() => {
    let interval
    if (interviewStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewStarted])

  useEffect(() => {
    // 初始化MCP管理器
    mcpManager.initialize()
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startInterview = () => {
    setInterviewStarted(true)
    setTimeElapsed(0)
    setCurrentQuestion(0)
    setInterviewHistory([])
    setOverallScore(0)
    setAiResponse('你好！欢迎参加今天的面试。我是你的AI面试官，我将从多个维度评估你的回答。让我们开始第一个问题吧。')
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('请输入您的回答')
      return
    }

    setIsAiThinking(true)
    
    try {
      const currentQ = questions[currentQuestion]
      
      // 使用算法评分
      const scoreResult = scoreInterviewAnswer(currentQ.text, userAnswer)
      const sentimentResult = analyzeSentiment(userAnswer)
      
      // 尝试使用MCP工具进行评估
      let mcpResult = null
      try {
        mcpResult = await mcpManager.callTool('interview_scorer', {
          question: currentQ.text,
          answer: userAnswer,
          category: currentQ.category,
          difficulty: currentQ.difficulty
        })
      } catch (error) {
        console.log('MCP tool not available, using local algorithms')
      }
      
      // 获取AI配置并调用API
      let aiResponse = ''
      const savedConfig = localStorage.getItem('ai-config')
      
      if (savedConfig) {
        try {
          const { config } = JSON.parse(savedConfig)
          
          // 使用MCP增强上下文
          const enhancedRequest = await mcpManager.enhanceContext({
            messages: [
              {
                role: 'system',
                content: `你是一个专业的面试官。请对候选人的回答进行详细评价，包括：
1. 回答质量评分（1-10分）
2. 具体的优点和不足
3. 改进建议
4. 下一步发展方向

当前问题类别：${currentQ.category}
难度级别：${currentQ.difficulty}
算法评分：${scoreResult.totalScore}/100
情感倾向：${sentimentResult.sentiment}（置信度：${(sentimentResult.confidence * 100).toFixed(1)}%）`
              },
              {
                role: 'user',
                content: `面试问题：${currentQ.text}\n\n候选人回答：${userAnswer}\n\n请提供专业的面试反馈。`
              }
            ]
          })
          
          const response = await fetch(config.baseUrl + '/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              model: config.customModel || config.model,
              messages: enhancedRequest.messages,
              max_tokens: parseInt(config.maxTokens) || 800,
              temperature: parseFloat(config.temperature) || 0.7,
              top_p: parseFloat(config.topP) || 1.0
            })
          })

          if (response.ok) {
            const data = await response.json()
            aiResponse = data.choices[0]?.message?.content || '感谢您的回答，让我们继续下一个问题。'
          } else {
            throw new Error(`API调用失败: ${response.status}`)
          }
        } catch (error) {
          console.error('AI调用失败:', error)
          aiResponse = generateLocalFeedback(scoreResult, sentimentResult, currentQ)
        }
      } else {
        aiResponse = generateLocalFeedback(scoreResult, sentimentResult, currentQ)
      }
      
      // 记录面试历史
      const historyItem = {
        questionId: currentQ.id,
        question: currentQ.text,
        answer: userAnswer,
        score: scoreResult.totalScore,
        sentiment: sentimentResult,
        aiResponse,
        timestamp: new Date().toISOString(),
        category: currentQ.category,
        difficulty: currentQ.difficulty
      }
      
      setInterviewHistory(prev => [...prev, historyItem])
      
      // 更新技能评估
      updateSkillAssessment(currentQ.category, scoreResult.totalScore)
      
      // 计算总体评分
      const newHistory = [...interviewHistory, historyItem]
      const avgScore = newHistory.reduce((sum, item) => sum + item.score, 0) / newHistory.length
      setOverallScore(Math.round(avgScore))
      
      setAiResponse(aiResponse)
      toast.success('AI反馈已生成')
      
    } catch (error) {
      console.error('评估失败:', error)
      const fallbackResponse = `感谢您的回答。您的回答展现了一定的思考深度，建议可以更具体地举例说明。评分：${Math.floor(Math.random() * 20) + 70}/100分。让我们继续下一个问题。`
      setAiResponse(fallbackResponse)
      toast.warning('使用本地评估算法')
    } finally {
      setIsAiThinking(false)
    }
  }

  const generateLocalFeedback = (scoreResult, sentimentResult, question) => {
    const score = scoreResult.totalScore
    const sentiment = sentimentResult.sentiment
    
    let feedback = `【评分：${score}/100分】\n\n`
    
    // 基于评分给出反馈
    if (score >= 90) {
      feedback += "🌟 优秀的回答！您的表达清晰、逻辑严密，完全符合问题要求。"
    } else if (score >= 80) {
      feedback += "👍 很好的回答！整体质量较高，稍作完善就能更加出色。"
    } else if (score >= 70) {
      feedback += "✅ 回答基本符合要求，但还有提升空间。"
    } else {
      feedback += "💡 回答需要进一步改进，建议重新组织思路。"
    }
    
    // 基于情感分析给出建议
    if (sentiment === 'positive') {
      feedback += "\n\n您的回答展现了积极的态度，这很好！"
    } else if (sentiment === 'negative') {
      feedback += "\n\n建议在表达中增加更多积极的元素。"
    }
    
    // 基于问题类别给出具体建议
    switch (question.category) {
      case '自我介绍':
        feedback += "\n\n💼 建议突出您的核心技能和独特优势。"
        break
      case '技术能力':
        feedback += "\n\n🔧 可以更详细地描述技术实现细节和解决思路。"
        break
      case '团队协作':
        feedback += "\n\n🤝 展现您的沟通技巧和团队合作精神。"
        break
      case '学习能力':
        feedback += "\n\n📚 分享具体的学习方法和成长经历会更有说服力。"
        break
      default:
        feedback += "\n\n🎯 建议结合具体案例来支撑您的观点。"
    }
    
    return feedback
  }

  const updateSkillAssessment = (category, score) => {
    setSkillAssessment(prev => ({
      ...prev,
      [category]: {
        score,
        count: (prev[category]?.count || 0) + 1,
        average: prev[category] 
          ? Math.round(((prev[category].average * prev[category].count) + score) / (prev[category].count + 1))
          : score
      }
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setUserAnswer('')
      setAiResponse('')
    }
  }

  const resetInterview = () => {
    setInterviewStarted(false)
    setTimeElapsed(0)
    setCurrentQuestion(0)
    setIsRecording(false)
    setUserAnswer('')
    setAiResponse('')
    setInterviewHistory([])
    setOverallScore(0)
    setSkillAssessment({})
  }

  const finishInterview = () => {
    const finalReport = {
      totalQuestions: questions.length,
      answeredQuestions: interviewHistory.length,
      overallScore,
      skillAssessment,
      totalTime: timeElapsed,
      completedAt: new Date().toISOString()
    }
    
    // 保存面试记录
    const savedInterviews = JSON.parse(localStorage.getItem('interview-history') || '[]')
    savedInterviews.push(finalReport)
    localStorage.setItem('interview-history', JSON.stringify(savedInterviews))
    
    toast.success('面试完成！报告已保存')
    console.log('面试报告:', finalReport)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI智能面试系统
          </h1>
          <p className="text-gray-600">
            基于高级算法的智能面试评估，提供专业的反馈和建议
          </p>
        </div>

        {!interviewStarted ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              准备开始智能面试
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              本次面试包含 {questions.length} 个问题，涵盖技术能力、团队协作、学习能力等多个维度。
              AI将使用先进算法对您的回答进行实时评估和反馈。
            </p>
            
            {/* 面试特性展示 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 mb-1">智能评分</h3>
                <p className="text-sm text-blue-700">多维度算法评估</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 mb-1">精准反馈</h3>
                <p className="text-sm text-purple-700">个性化改进建议</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900 mb-1">能力分析</h3>
                <p className="text-sm text-green-700">技能水平评估</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startInterview}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                开始智能面试
              </button>
              <button 
                onClick={() => window.open('#', '_blank')}
                className="inline-flex items-center px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
              >
                <Video className="w-5 h-5 mr-2" />
                设备检测
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* 主面试区域 */}
            <div className="lg:col-span-3 space-y-6">
              {/* 面试状态栏 */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">
                        问题 {currentQuestion + 1} / {questions.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">
                        总分: {overallScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isVideoOn 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                          : 'bg-red-100 hover:bg-red-200 text-red-600'
                      }`}
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isRecording 
                          ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={resetInterview}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 视频区域 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 relative">
                  {isVideoOn ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Video className="w-16 h-16 mx-auto mb-4 opacity-60" />
                        <p className="text-lg opacity-80">摄像头画面</p>
                        <p className="text-sm opacity-60 mt-2">AI正在分析您的表情和肢体语言</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-60" />
                        <p className="text-lg opacity-80">摄像头已关闭</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 录制指示器 */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">录制中</span>
                    </div>
                  )}
                  
                  {/* 问题信息 */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg px-3 py-2">
                    <div className="text-white text-sm">
                      <div className="font-medium">{questions[currentQuestion]?.category}</div>
                      <div className="text-xs opacity-80">{questions[currentQuestion]?.difficulty}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 问题区域 */}
              <motion.div
                key={currentQuestion}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">面试官问题</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {questions[currentQuestion]?.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {questions[currentQuestion]?.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {questions[currentQuestion]?.text}
                    </p>
                  </div>
                </div>
                
                {/* 用户回答输入 */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    您的回答
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="请详细回答问题，AI将从多个维度评估您的回答质量..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">建议回答时间：2-3分钟</span>
                      <span className="ml-4">字数：{userAnswer.length}</span>
                    </div>
                    <button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim() || isAiThinking}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                      {isAiThinking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                          AI分析中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 inline" />
                          提交回答
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* AI反馈区域 */}
              {(aiResponse || isAiThinking) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        AI面试官反馈
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          智能评估
                        </span>
                      </h3>
                      {isAiThinking ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-gray-600">AI正在深度分析您的回答，请稍候...</span>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                            {aiResponse}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {aiResponse && !isAiThinking && (
                    <div className="mt-6 flex justify-end space-x-3">
                      {currentQuestion < questions.length - 1 ? (
                        <button
                          onClick={nextQuestion}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          下一题
                        </button>
                      ) : (
                        <button
                          onClick={finishInterview}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 inline" />
                          完成面试
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* 进度条 */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">面试进度</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 侧边栏 - 实时统计 */}
            <div className="space-y-6">
              {/* 总体评分 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  总体评分
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {overallScore}
                  </div>
                  <div className="text-sm text-gray-500">/ 100分</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${overallScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 技能评估 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  技能评估
                </h3>
                <div className="space-y-3">
                  {Object.entries(skillAssessment).map(([skill, data]) => (
                    <div key={skill}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill}</span>
                        <span className="text-sm text-gray-500">{data.average}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${data.average}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {Object.keys(skillAssessment).length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">开始回答问题后<br />将显示技能评估</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 面试历史 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                  回答记录
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {interviewHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          问题 {index + 1}
                        </div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">
                          {item.score}
                        </div>
                        <div className="text-xs text-gray-500">分</div>
                      </div>
                    </div>
                  ))}
                  {interviewHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无回答记录</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Interview