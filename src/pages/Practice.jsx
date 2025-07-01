import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  Users
} from 'lucide-react'

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: '全部', count: 1250 },
    { id: 'technical', name: '技术面试', count: 450 },
    { id: 'behavioral', name: '行为面试', count: 380 },
    { id: 'case', name: '案例分析', count: 220 },
    { id: 'leadership', name: '领导力', count: 200 }
  ]

  const questionSets = [
    {
      id: 1,
      title: 'JavaScript高级面试题',
      category: 'technical',
      difficulty: '高级',
      questions: 25,
      time: '45分钟',
      rating: 4.8,
      users: 1200,
      description: '涵盖闭包、原型链、异步编程等核心概念'
    },
    {
      id: 2,
      title: '产品经理行为面试',
      category: 'behavioral',
      difficulty: '中级',
      questions: 20,
      time: '30分钟',
      rating: 4.6,
      users: 890,
      description: '产品思维、团队协作、项目管理相关问题'
    },
    {
      id: 3,
      title: '系统设计案例分析',
      category: 'case',
      difficulty: '高级',
      questions: 15,
      time: '60分钟',
      rating: 4.9,
      users: 650,
      description: '大型系统架构设计与优化方案'
    },
    {
      id: 4,
      title: '团队管理情境题',
      category: 'leadership',
      difficulty: '中级',
      questions: 18,
      time: '35分钟',
      rating: 4.7,
      users: 420,
      description: '领导力、冲突解决、团队建设相关场景'
    }
  ]

  const filteredQuestions = questionSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || set.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return 'bg-green-100 text-green-800'
      case '中级': return 'bg-yellow-100 text-yellow-800'
      case '高级': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">题库练习</h1>
          <p className="text-gray-600">
            海量面试题库，分类练习，提升面试技能
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索题库..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>

        {/* 题库列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((questionSet, index) => (
            <motion.div
              key={questionSet.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {questionSet.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {questionSet.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(questionSet.difficulty)}`}>
                    {questionSet.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{questionSet.questions} 题</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{questionSet.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{questionSet.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{questionSet.users}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium rounded-lg transition-colors duration-200">
                    开始练习
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关题库</h3>
            <p className="text-gray-600">尝试调整搜索条件或选择其他分类</p>
          </div>
        )}

        {/* 推荐题库 */}
        <div className="mt-16">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">热门推荐</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {questionSets.slice(0, 4).map((set, index) => (
              <div key={set.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                <h4 className="font-medium text-gray-900 mb-2">{set.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{set.questions} 题</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{set.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Practice