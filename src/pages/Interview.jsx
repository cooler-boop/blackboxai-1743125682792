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
  CheckCircle
} from 'lucide-react'

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)

  const questions = [
    "请简单介绍一下你自己",
    "为什么想要加入我们公司？",
    "你最大的优势是什么？",
    "描述一个你遇到的挑战以及如何解决的",
    "你对这个职位有什么期望？"
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startInterview = () => {
    setInterviewStarted(true)
    setTimeElapsed(0)
    setCurrentQuestion(0)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const resetInterview = () => {
    setInterviewStarted(false)
    setTimeElapsed(0)
    setCurrentQuestion(0)
    setIsRecording(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI模拟面试</h1>
          <p className="text-gray-600">
            真实的面试环境模拟，提升你的面试表现
          </p>
        </div>

        {!interviewStarted ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              准备开始面试
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              本次模拟面试包含 {questions.length} 个问题，预计用时 15-20 分钟。
              请确保你在安静的环境中，并且摄像头和麦克风工作正常。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startInterview}
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                开始面试
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200">
                <Video className="w-5 h-5 mr-2" />
                设备检测
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* 面试状态栏 */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
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
              <div className="aspect-video bg-gray-900 relative">
                {isVideoOn ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="opacity-75">摄像头画面</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="opacity-75">摄像头已关闭</p>
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
              </div>
            </div>

            {/* 问题区域 */}
            <motion.div
              key={currentQuestion}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    面试官问题
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {questions[currentQuestion]}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  建议回答时间：2-3分钟
                </div>
                <div className="flex space-x-3">
                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      下一题
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('面试完成！')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 inline" />
                      完成面试
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 进度条 */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">面试进度</span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Interview