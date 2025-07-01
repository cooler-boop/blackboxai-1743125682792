import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Zap, 
  Target, 
  Award,
  ArrowRight,
  Play,
  Users,
  TrendingUp
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI模拟面试',
      description: '真实的面试场景模拟，智能AI面试官提供专业反馈',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: '题库练习',
      description: '海量面试题库，涵盖各行业各岗位的常见问题',
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: '数据分析',
      description: '详细的面试表现分析，帮你找到提升方向',
      color: 'bg-purple-500'
    },
    {
      icon: Target,
      title: '个性化建议',
      description: '基于你的表现提供针对性的改进建议',
      color: 'bg-orange-500'
    }
  ]

  const stats = [
    { label: '用户数量', value: '10,000+', icon: Users },
    { label: '面试次数', value: '50,000+', icon: MessageCircle },
    { label: '成功率提升', value: '85%', icon: TrendingUp },
    { label: '满意度', value: '4.9/5', icon: Award }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              AI智能面试助手
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              利用人工智能技术，为你提供专业的面试准备和练习平台。
              提升面试技能，增强求职信心，助你获得理想工作。
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/interview"
                className="inline-flex items-center px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 group"
              >
                <Play className="w-5 h-5 mr-2" />
                开始面试
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                练习题库
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们？
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我们提供全方位的面试准备解决方案，帮助你在求职路上脱颖而出
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              准备好开始你的面试之旅了吗？
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              立即开始使用AI智能面试助手，提升你的面试技能
            </p>
            <Link
              to="/interview"
              className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-lg transition-colors duration-200 group"
            >
              <Zap className="w-5 h-5 mr-2" />
              立即开始
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home