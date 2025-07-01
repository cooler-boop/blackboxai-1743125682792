import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Save,
  X,
  Award,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import useDataStore from '../store/dataStore'

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activePractice, setActivePractice] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [practiceStartTime, setPracticeStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState([])
  const [practiceScore, setPracticeScore] = useState(0)
  const { addInterviewSession, updatePracticeTime } = useDataStore()

  // 计时器
  useEffect(() => {
    let timer
    if (practiceStartTime && activePractice) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - practiceStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [practiceStartTime])

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
      questions: [
        {
          id: 101,
          question: '请解释JavaScript中的闭包概念，并提供一个实际应用场景。',
          answer: '闭包是指一个函数能够访问其词法作用域之外的变量的能力。当函数被定义时，它会保留对其所在词法作用域的引用，即使该函数在其他作用域中被调用，它仍然能够访问其原始作用域中的变量。\n\n实际应用场景：\n1. 数据封装和私有变量\n2. 函数工厂\n3. 事件处理器和回调\n4. 模块模式\n\n示例代码：\n```javascript\nfunction createCounter() {\n  let count = 0; // 私有变量\n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getCount: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.getCount()); // 0\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.decrement()); // 1\n```\n\n在这个例子中，`count`变量对外部代码是不可访问的，只能通过返回的方法来操作，这就是闭包的实际应用。',
          keywords: ['闭包', '词法作用域', '私有变量', '函数工厂', '模块模式']
        },
        {
          id: 102,
          question: '解释JavaScript中的原型链和继承机制。',
          answer: 'JavaScript中的原型链是实现继承的主要机制。每个JavaScript对象都有一个原型对象，对象从其原型继承属性和方法。当访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript引擎会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的末端（null）。\n\n继承机制：\n1. 原型继承：通过设置一个对象的原型为另一个对象，实现继承\n2. 构造函数继承：使用call或apply方法在子类构造函数中调用父类构造函数\n3. 组合继承：结合原型继承和构造函数继承\n4. ES6 class继承：使用class和extends关键字\n\n示例代码：\n```javascript\n// ES6 class继承\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  \n  speak() {\n    console.log(`${this.name} makes a noise.`);\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name); // 调用父类构造函数\n    this.breed = breed;\n  }\n  \n  speak() {\n    console.log(`${this.name} barks!`);\n  }\n  \n  getBreed() {\n    return this.breed;\n  }\n}\n\nconst dog = new Dog(\'Rex\', \'German Shepherd\');\ndog.speak(); // "Rex barks!"\nconsole.log(dog.getBreed()); // "German Shepherd"\n```\n\n这个例子展示了ES6 class语法下的继承，Dog类继承了Animal类的属性和方法，并可以重写父类方法。',
          keywords: ['原型链', '继承', '构造函数', 'class', 'extends', 'super']
        },
        {
          id: 103,
          question: '解释JavaScript中的事件循环机制，以及宏任务和微任务的区别。',
          answer: 'JavaScript的事件循环是一种处理异步操作的机制。JavaScript是单线程的，事件循环允许它执行非阻塞操作，通过将操作推送到事件队列中，并在主线程空闲时处理这些操作。\n\n事件循环的基本流程：\n1. 执行同步代码（主线程上的代码）\n2. 检查微任务队列，执行所有微任务\n3. 执行一个宏任务\n4. 再次检查微任务队列，执行所有微任务\n5. 重复步骤3和4\n\n宏任务和微任务的区别：\n- 宏任务（MacroTask）：包括setTimeout、setInterval、setImmediate、I/O操作、UI渲染等\n- 微任务（MicroTask）：包括Promise.then/catch/finally、process.nextTick、MutationObserver等\n\n关键区别是微任务总是在当前宏任务执行完毕后立即执行，而下一个宏任务则要等到所有微任务执行完毕后才会执行。\n\n示例代码：\n```javascript\nconsole.log(\'1 - 同步代码\');\n\nsetTimeout(() => {\n  console.log(\'2 - 宏任务\');\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\'3 - 微任务\');\n});\n\nconsole.log(\'4 - 同步代码\');\n\n// 输出顺序：\n// 1 - 同步代码\n// 4 - 同步代码\n// 3 - 微任务\n// 2 - 宏任务\n```\n\n这个例子展示了事件循环的执行顺序：先执行同步代码，然后执行微任务，最后执行宏任务。',
          keywords: ['事件循环', '宏任务', '微任务', 'Promise', 'setTimeout', '异步']
        },
        {
          id: 104,
          question: '解释React中的虚拟DOM及其工作原理。',
          answer: '虚拟DOM（Virtual DOM）是React的核心概念之一，它是一种编程概念，其中UI的理想或"虚拟"表示保存在内存中，并通过ReactDOM等库与"真实"DOM同步。这个过程称为协调（Reconciliation）。\n\n工作原理：\n1. 当组件的状态或属性发生变化时，React会创建一个新的虚拟DOM树\n2. React比较（diff）新旧虚拟DOM树的差异\n3. 计算出需要更新的最小操作集\n4. 批量执行这些操作，只更新真实DOM中需要变化的部分\n\n虚拟DOM的优势：\n- 性能优化：最小化DOM操作，减少重排和重绘\n- 跨平台：虚拟DOM是平台无关的，可以渲染到不同环境（Web、Native等）\n- 声明式编程：开发者只需关注状态变化，而不是DOM操作\n\n示例：\n```jsx\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```\n\n当点击按钮时，React会：\n1. 创建一个新的虚拟DOM树，其中count值增加了1\n2. 比较新旧虚拟DOM树\n3. 发现只有p标签的文本内容发生了变化\n4. 只更新真实DOM中的那个文本节点，而不是重新渲染整个组件',
          keywords: ['虚拟DOM', '协调', 'diff算法', '性能优化', '批量更新', 'React']
        },
        {
          id: 105,
          question: '解释JavaScript中的Promise及其异步处理方式。',
          answer: 'Promise是JavaScript中处理异步操作的一种对象，它代表了一个异步操作的最终完成（或失败）及其结果值。Promise有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。\n\nPromise的基本用法：\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  // 异步操作\n  const success = true;\n  if (success) {\n    resolve(\'操作成功\');\n  } else {\n    reject(\'操作失败\');\n  }\n});\n\npromise\n  .then(result => {\n    console.log(result); // 操作成功\n  })\n  .catch(error => {\n    console.error(error);\n  })\n  .finally(() => {\n    console.log(\'无论成功失败都会执行\');\n  });\n```\n\nPromise链：\n```javascript\nfetch(\'https://api.example.com/data\')\n  .then(response => response.json())\n  .then(data => {\n    console.log(data);\n    return processData(data);\n  })\n  .then(processedData => {\n    console.log(processedData);\n  })\n  .catch(error => {\n    console.error(\'Error:\', error);\n  });\n```\n\nPromise.all和Promise.race：\n```javascript\n// 所有Promise都完成时才完成\nPromise.all([\n  fetch(\'https://api.example.com/data1\').then(r => r.json()),\n  fetch(\'https://api.example.com/data2\').then(r => r.json()),\n  fetch(\'https://api.example.com/data3\').then(r => r.json())\n])\n.then(([data1, data2, data3]) => {\n  console.log(data1, data2, data3);\n})\n.catch(error => {\n  console.error(\'At least one request failed\', error);\n});\n\n// 任何一个Promise完成就完成\nPromise.race([\n  fetch(\'https://api.example.com/data1\').then(r => r.json()),\n  fetch(\'https://api.example.com/data2\').then(r => r.json())\n])\n.then(firstData => {\n  console.log(\'First to complete:\', firstData);\n});\n```\n\nAsync/Await（基于Promise的语法糖）：\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch(\'https://api.example.com/data\');\n    const data = await response.json();\n    console.log(data);\n    return data;\n  } catch (error) {\n    console.error(\'Error:\', error);\n  }\n}\n\nfetchData();\n```\n\nPromise的优势：\n- 链式调用，避免回调地狱\n- 更好的错误处理\n- 支持并行操作\n- 与async/await结合使用更加优雅',
          keywords: ['Promise', 'async', 'await', 'then', 'catch', 'finally', '异步']
        }
      ],
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
      questions: [
        {
          id: 201,
          question: '请分享一个你成功推动产品从概念到发布的经历，以及你在这个过程中扮演的角色。',
          answer: '一个成功的产品经理应该能够清晰地描述产品开发的完整流程，从市场调研、需求分析、产品规划到最终发布。\n\n优秀答案应包含：\n1. 明确的产品背景和目标\n2. 数据驱动的决策过程\n3. 跨团队协作的具体案例\n4. 遇到的挑战及解决方案\n5. 产品发布后的效果评估\n6. 个人在过程中的具体贡献\n\n回答这个问题时，应该使用STAR法则（情境-任务-行动-结果）来结构化你的回答，确保逻辑清晰，重点突出。',
          keywords: ['产品开发', '跨团队协作', '数据驱动', '项目管理', 'STAR法则']
        },
        {
          id: 202,
          question: '描述一次你需要在有限资源下做出产品优先级决策的情况。你是如何做决策的？',
          answer: '资源有限是产品经理常见的挑战，优秀的产品经理能够建立清晰的优先级框架。\n\n优秀答案应包含：\n1. 使用的优先级框架（如RICE模型：Reach影响范围、Impact影响程度、Confidence信心度、Effort工作量）\n2. 如何收集和分析数据来支持决策\n3. 与利益相关者的沟通过程\n4. 如何处理不同团队的期望和压力\n5. 决策结果及其影响\n\n具体例子：\n"在X项目中，我们面临时间和开发资源有限的情况，需要决定哪些功能进入首个版本。我使用RICE模型对所有功能进行评分，并结合用户调研数据和业务目标，最终确定了核心功能集。虽然这意味着推迟了一些团队成员期待的功能，但我通过数据支持的透明决策过程获得了团队的理解和支持。首个版本发布后，我们的核心指标提升了30%，验证了这一决策的正确性。"',
          keywords: ['优先级', 'RICE模型', '资源分配', '数据分析', '决策框架']
        },
        {
          id: 203,
          question: '请分享一次你与工程团队有分歧的经历，以及你是如何解决的。',
          answer: '产品经理与工程团队的合作至关重要，处理分歧的能力直接影响产品开发效率。\n\n优秀答案应包含：\n1. 分歧的具体内容和背景\n2. 你如何理解工程团队的顾虑\n3. 沟通策略和方法\n4. 如何找到平衡点或妥协方案\n5. 最终解决方案及其结果\n6. 从这次经历中学到的经验\n\n回答示例：\n"在开发X功能时，工程团队认为我提出的实现方案技术难度大且时间紧张。首先，我安排了一次非正式会议，真诚地听取他们的顾虑。然后，我邀请设计师和工程师一起进行头脑风暴，寻找替代方案。我们最终达成了一个分阶段实现的方案：先实现核心功能满足用户基本需求，后续迭代中再逐步完善。这个过程中，我学会了在产品愿景和技术现实之间寻找平衡，并且意识到提前让工程团队参与产品规划的重要性。"',
          keywords: ['跨团队协作', '冲突解决', '沟通技巧', '妥协', '团队合作']
        },
        {
          id: 204,
          question: '你如何收集和分析用户反馈来改进产品？请举一个具体例子。',
          answer: '用户反馈是产品迭代的重要依据，优秀的产品经理应该有系统化的方法收集和分析用户反馈。\n\n优秀答案应包含：\n1. 多渠道的用户反馈收集方法\n2. 定性和定量分析相结合\n3. 如何区分用户"想要的"和"需要的"\n4. 如何将反馈转化为可执行的产品改进\n5. 如何验证改进的效果\n\n回答示例：\n"在负责X产品时，我建立了多渠道的用户反馈系统：应用内反馈、用户访谈、使用数据分析和NPS调查。我发现用户在完成核心流程时遇到了困难，但直接询问时他们往往难以准确描述问题。\n\n我采用了用户行为录制工具，分析了100个用户会话，识别出关键卡点。同时，我进行了10次深度用户访谈，了解用户的真实需求和痛点。\n\n基于这些发现，我提出了界面简化方案，并通过A/B测试验证。新版本将流程步骤从6步减少到4步，完成率提升了35%，用户满意度提高了20%。这个过程教会我，有效的用户反馈分析需要结合定量数据和定性研究，并且要关注用户行为而非仅仅是用户说的话。"',
          keywords: ['用户反馈', '数据分析', '用户研究', 'A/B测试', '产品迭代']
        },
        {
          id: 205,
          question: '请描述你如何与设计师合作，确保产品既满足用户需求又具有良好的用户体验。',
          answer: '产品经理与设计师的良好合作是创造优秀产品体验的关键。\n\n优秀答案应包含：\n1. 如何在产品需求阶段就让设计师参与\n2. 如何清晰地传达产品目标和用户需求\n3. 如何平衡业务目标和用户体验\n4. 如何处理设计评审和反馈\n5. 如何支持设计师的创意同时确保产品方向一致\n\n回答示例：\n"我认为与设计师的合作应该从产品构思阶段就开始，而不是简单地提出需求后等待设计稿。在X项目中，我邀请设计师参与了用户研究和需求分析的全过程。\n\n我会通过用户旅程图和用户故事清晰地传达产品目标和用户痛点，而不是直接规定UI解决方案。我们建立了每周设计评审会议，团队成员可以基于用户目标和业务目标给出建设性反馈。\n\n当设计与业务目标出现冲突时，我会协助设计师理解业务约束，同时也会向其他利益相关者解释良好用户体验的长期价值。例如，在简化注册流程的项目中，我们通过用户测试数据证明了简化后的设计不仅提升了用户体验，还提高了转化率，最终说服了市场团队接受这一变更。\n\n我认为成功的产品经理应该是设计师的合作伙伴而非指挥官，我的角色是确保设计方向与产品愿景一致，同时给予设计师足够的创意空间。"',
          keywords: ['设计协作', '用户体验', '设计评审', '产品愿景', '用户旅程']
        }
      ],
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
      questions: [
        {
          id: 301,
          question: '设计一个类似Twitter的微博系统，考虑系统架构、数据模型和扩展性。',
          answer: '设计Twitter类系统需要考虑高并发、大数据量和实时性等挑战。\n\n**1. 系统需求分析**\n- 发布和查看推文\n- 关注其他用户\n- 时间线展示\n- 搜索功能\n- 通知系统\n\n**2. 架构设计**\n\n**前端**:\n- Web应用 (React/Vue)\n- 移动应用 (iOS/Android)\n\n**后端**:\n- API网关层: 负责请求路由、认证、限流\n- 应用服务层: 微服务架构\n  - 用户服务: 处理用户注册、认证、资料\n  - 推文服务: 处理推文的创建、读取\n  - 关注服务: 处理用户关系\n  - 时间线服务: 生成用户时间线\n  - 搜索服务: 提供搜索功能\n  - 通知服务: 处理实时通知\n\n**数据存储**:\n- 关系型数据库 (MySQL/PostgreSQL): 用户数据、关系数据\n- NoSQL数据库 (MongoDB): 推文内容\n- 缓存 (Redis): 热门推文、用户时间线\n- 搜索引擎 (Elasticsearch): 推文搜索\n- 消息队列 (Kafka): 事件处理、数据流\n\n**3. 数据模型**\n\n**用户表**:\n```sql\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  username VARCHAR(50) UNIQUE,\n  email VARCHAR(100) UNIQUE,\n  password_hash VARCHAR(255),\n  profile_image_url VARCHAR(255),\n  bio TEXT,\n  created_at TIMESTAMP,\n  updated_at TIMESTAMP\n);\n```\n\n**推文表**:\n```sql\nCREATE TABLE tweets (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id),\n  content TEXT,\n  media_urls JSON,\n  created_at TIMESTAMP,\n  likes_count INT DEFAULT 0,\n  retweets_count INT DEFAULT 0,\n  replies_count INT DEFAULT 0\n);\n```\n\n**关注关系表**:\n```sql\nCREATE TABLE follows (\n  follower_id BIGINT REFERENCES users(id),\n  followee_id BIGINT REFERENCES users(id),\n  created_at TIMESTAMP,\n  PRIMARY KEY (follower_id, followee_id)\n);\n```\n\n**4. 关键技术挑战与解决方案**\n\n**时间线生成**:\n- 问题: 如何高效生成用户时间线\n- 解决方案: 采用推拉结合模式\n  - 推模式: 当用户发推文时，将推文ID推送到所有粉丝的时间线缓存中\n  - 拉模式: 对于粉丝数量特别多的用户，采用拉模式，在用户查看时间线时才获取\n\n**读写分离与分片**:\n- 使用主从复制实现读写分离\n- 按用户ID对数据进行水平分片\n\n**缓存策略**:\n- 热门推文和活跃用户的时间线缓存\n- 使用Redis实现计数器(点赞、转发数)\n\n**搜索优化**:\n- 使用Elasticsearch建立推文索引\n- 实现实时搜索和趋势话题分析\n\n**5. 扩展性考虑**\n\n**水平扩展**:\n- 无状态服务便于水平扩展\n- 数据分片策略随用户增长调整\n\n**CDN**:\n- 使用CDN分发静态资源和媒体文件\n\n**全球化部署**:\n- 多区域部署减少延迟\n- 数据同步和一致性策略\n\n**6. 监控与可靠性**\n\n**监控指标**:\n- 服务响应时间\n- 错误率\n- 系统资源使用率\n- 用户活跃度\n\n**故障恢复**:\n- 服务降级策略\n- 数据备份与恢复方案\n\n这个设计方案考虑了Twitter类系统的核心功能和技术挑战，采用了微服务架构和多种数据存储技术来满足高并发、大数据量和实时性的需求。',
          keywords: ['微服务', '数据分片', '缓存策略', '读写分离', '推拉模型', '水平扩展']
        },
        {
          id: 302,
          question: '设计一个分布式文件存储系统，类似Google Drive或Dropbox。',
          answer: '设计分布式文件存储系统需要考虑数据一致性、可靠性、性能和安全性等多方面因素。\n\n**1. 系统需求**\n- 文件上传、下载、删除和共享\n- 文件版本控制\n- 多设备同步\n- 访问控制和权限管理\n- 高可用性和数据持久性\n\n**2. 系统架构**\n\n**客户端**:\n- Web客户端\n- 桌面客户端(Windows/Mac/Linux)\n- 移动客户端(iOS/Android)\n\n**服务端**:\n- API网关: 请求路由、认证、限流\n- 元数据服务: 管理文件元数据(路径、大小、类型等)\n- 存储服务: 管理实际文件内容\n- 同步服务: 处理文件变更和冲突解决\n- 认证授权服务: 用户认证和权限控制\n- 通知服务: 推送文件变更通知\n\n**存储层**:\n- 元数据存储: 关系型数据库(PostgreSQL)\n- 文件内容存储: 对象存储(S3兼容)\n- 缓存层: Redis集群\n- 消息队列: Kafka\n\n**3. 关键技术设计**\n\n**文件存储策略**:\n- 文件分块: 将大文件分割成固定大小的块(如4MB)\n- 内容寻址存储: 使用文件内容哈希作为标识符\n- 重复数据删除: 相同内容的文件只存储一次\n- 增量同步: 只传输变更的文件块\n\n**元数据设计**:\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE,\n  name VARCHAR(255),\n  storage_quota BIGINT,\n  used_storage BIGINT\n);\n\nCREATE TABLE files (\n  id UUID PRIMARY KEY,\n  name VARCHAR(255),\n  parent_id UUID REFERENCES folders(id),\n  owner_id UUID REFERENCES users(id),\n  size BIGINT,\n  content_hash VARCHAR(64),\n  mime_type VARCHAR(100),\n  created_at TIMESTAMP,\n  updated_at TIMESTAMP,\n  is_deleted BOOLEAN DEFAULT FALSE\n);\n\nCREATE TABLE file_versions (\n  id UUID PRIMARY KEY,\n  file_id UUID REFERENCES files(id),\n  content_hash VARCHAR(64),\n  size BIGINT,\n  created_at TIMESTAMP,\n  created_by UUID REFERENCES users(id)\n);\n\nCREATE TABLE file_blocks (\n  content_hash VARCHAR(64),\n  block_index INT,\n  block_hash VARCHAR(64),\n  PRIMARY KEY (content_hash, block_index)\n);\n\nCREATE TABLE shares (\n  id UUID PRIMARY KEY,\n  file_id UUID REFERENCES files(id),\n  user_id UUID REFERENCES users(id),\n  permission VARCHAR(20),\n  created_at TIMESTAMP\n);\n```\n\n**同步机制**:\n- 长轮询或WebSocket实现实时通知\n- 版本向量(Vector Clock)处理并发修改\n- 冲突检测与自动解决策略\n\n**安全设计**:\n- 端到端加密\n- 传输层安全(TLS)\n- 细粒度的访问控制\n- 文件加密密钥管理\n\n**4. 扩展性设计**\n\n**水平扩展**:\n- 元数据服务分片: 按用户ID或文件路径前缀\n- 存储节点扩展: 一致性哈希分配文件块\n\n**缓存策略**:\n- 热门文件元数据缓存\n- 文件内容块缓存\n- 用户权限缓存\n\n**负载均衡**:\n- API网关层负载均衡\n- 存储节点间负载均衡\n\n**5. 可靠性设计**\n\n**数据冗余**:\n- 文件块多副本存储(至少3副本)\n- 地理分布式复制\n\n**故障检测与恢复**:\n- 心跳机制检测节点健康\n- 自动故障转移\n- 数据修复机制\n\n**备份策略**:\n- 定期全量备份\n- 连续增量备份\n- 时间点恢复能力\n\n**6. 性能优化**\n\n**上传优化**:\n- 客户端计算文件哈希，避免上传重复内容\n- 并行上传多个文件块\n- 断点续传\n\n**下载优化**:\n- CDN分发热门文件\n- 预读取策略\n- 智能缓存\n\n**7. 监控与运维**\n\n**关键指标**:\n- 存储使用率\n- 文件操作延迟\n- 同步成功率\n- 系统可用性\n\n**日志与审计**:\n- 详细的操作日志\n- 访问审计\n- 异常行为检测\n\n这个设计方案考虑了分布式文件存储系统的核心需求和技术挑战，采用了现代云原生架构和最佳实践，可以支持高可用、高性能的文件存储服务。',
          keywords: ['分布式存储', '文件分块', '元数据管理', '同步机制', '冗余备份', '内容寻址']
        },
        {
          id: 303,
          question: '设计一个高并发的电子商务网站的后端系统。',
          answer: '设计高并发电商系统需要考虑可扩展性、可用性、一致性和性能等多方面因素。\n\n**1. 系统需求**\n- 商品浏览和搜索\n- 用户账户管理\n- 购物车功能\n- 订单处理\n- 支付集成\n- 库存管理\n- 促销和优惠券\n\n**2. 系统架构**\n\n**前端**:\n- Web前端 (React/Vue)\n- 移动应用 (iOS/Android)\n\n**后端**:\n- API网关: 请求路由、认证、限流、缓存\n- 微服务集群:\n  - 用户服务: 账户管理、认证\n  - 商品服务: 商品信息、分类、搜索\n  - 购物车服务: 购物车管理\n  - 订单服务: 订单创建和管理\n  - 支付服务: 支付处理和集成\n  - 库存服务: 库存管理和预留\n  - 促销服务: 优惠券和促销规则\n  - 搜索服务: 商品搜索和推荐\n  - 通知服务: 邮件、短信、推送\n\n**数据层**:\n- 关系型数据库 (MySQL集群): 用户、订单、支付等事务性数据\n- NoSQL数据库 (MongoDB): 商品信息、用户行为等\n- 搜索引擎 (Elasticsearch): 商品搜索\n- 缓存 (Redis): 商品信息、用户会话、购物车\n- 消息队列 (Kafka): 服务间通信、事件驱动\n\n**3. 数据模型设计**\n\n**用户相关**:\n```sql\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  username VARCHAR(50) UNIQUE,\n  email VARCHAR(100) UNIQUE,\n  password_hash VARCHAR(255),\n  phone VARCHAR(20),\n  created_at TIMESTAMP,\n  last_login TIMESTAMP\n);\n\nCREATE TABLE addresses (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id),\n  name VARCHAR(100),\n  phone VARCHAR(20),\n  province VARCHAR(50),\n  city VARCHAR(50),\n  district VARCHAR(50),\n  detail VARCHAR(255),\n  is_default BOOLEAN\n);\n```\n\n**商品相关**:\n```sql\nCREATE TABLE products (\n  id BIGINT PRIMARY KEY,\n  name VARCHAR(255),\n  description TEXT,\n  price DECIMAL(10,2),\n  category_id BIGINT,\n  brand_id BIGINT,\n  status VARCHAR(20),\n  created_at TIMESTAMP,\n  updated_at TIMESTAMP\n);\n\nCREATE TABLE product_inventory (\n  product_id BIGINT PRIMARY KEY,\n  quantity INT,\n  reserved_quantity INT,\n  updated_at TIMESTAMP\n);\n```\n\n**订单相关**:\n```sql\nCREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id),\n  status VARCHAR(20),\n  total_amount DECIMAL(10,2),\n  address_id BIGINT REFERENCES addresses(id),\n  created_at TIMESTAMP,\n  updated_at TIMESTAMP\n);\n\nCREATE TABLE order_items (\n  id BIGINT PRIMARY KEY,\n  order_id BIGINT REFERENCES orders(id),\n  product_id BIGINT REFERENCES products(id),\n  quantity INT,\n  price DECIMAL(10,2)\n);\n\nCREATE TABLE payments (\n  id BIGINT PRIMARY KEY,\n  order_id BIGINT REFERENCES orders(id),\n  amount DECIMAL(10,2),\n  payment_method VARCHAR(50),\n  status VARCHAR(20),\n  transaction_id VARCHAR(100),\n  created_at TIMESTAMP\n);\n```\n\n**4. 高并发解决方案**\n\n**读写分离**:\n- 主库负责写操作\n- 多个从库负责读操作\n- 使用中间件自动路由读写请求\n\n**数据分片**:\n- 按用户ID分片用户数据\n- 按商品ID分片商品数据\n- 按订单ID分片订单数据\n\n**缓存策略**:\n- 多级缓存: 本地缓存 + 分布式缓存\n- 热点商品缓存\n- 用户会话缓存\n- 购物车缓存\n\n**库存管理**:\n- 预扣库存机制\n- 库存缓存与定时同步\n- 分布式锁防止超卖\n\n**5. 秒杀与高峰应对**\n\n**秒杀系统**:\n- 独立部署的秒杀服务\n- 商品页面静态化\n- 请求入队列，异步处理\n- 限流和熔断机制\n\n**流量削峰**:\n- 排队机制\n- 令牌桶限流\n- CDN分发静态资源\n\n**6. 事务与一致性**\n\n**分布式事务**:\n- Saga模式: 补偿事务\n- 最终一致性\n- 事件溯源\n\n**订单状态机**:\n- 明确的状态转换\n- 幂等操作\n- 失败重试机制\n\n**7. 安全性设计**\n\n**支付安全**:\n- 支付信息加密\n- 防重复提交\n- 风控系统\n\n**数据安全**:\n- 敏感数据加密\n- 权限细粒度控制\n- 操作审计日志\n\n**8. 监控与可观测性**\n\n**监控指标**:\n- 服务响应时间\n- 错误率\n- 吞吐量\n- 资源使用率\n\n**链路追踪**:\n- 分布式追踪系统\n- 请求ID贯穿全链路\n- 性能瓶颈分析\n\n**9. 部署与扩展**\n\n**容器化部署**:\n- Kubernetes编排\n- 自动扩缩容\n- 蓝绿部署\n\n**多区域部署**:\n- 就近接入\n- 数据同步策略\n- 灾备方案\n\n这个设计方案考虑了高并发电商系统的核心需求和技术挑战，采用了微服务架构、数据分片、多级缓存等技术来应对高并发场景，同时保证了系统的可靠性和一致性。',
          keywords: ['微服务', '读写分离', '数据分片', '缓存策略', '秒杀系统', '分布式事务']
        },
        {
          id: 304,
          question: '设计一个实时聊天系统，支持单聊和群聊功能。',
          answer: '设计实时聊天系统需要考虑实时性、可靠性、扩展性和消息一致性等多方面因素。\n\n**1. 系统需求**\n- 一对一聊天\n- 群组聊天\n- 消息实时推送\n- 消息历史记录\n- 在线状态显示\n- 已读回执\n- 多设备同步\n- 媒体文件传输\n\n**2. 系统架构**\n\n**客户端**:\n- Web客户端 (React/Vue)\n- 移动客户端 (iOS/Android)\n- 桌面客户端 (Electron)\n\n**服务端**:\n- 接入层: WebSocket服务器集群\n- 业务层:\n  - 用户服务: 用户管理、认证\n  - 消息服务: 消息处理和路由\n  - 群组服务: 群组管理\n  - 通知服务: 推送通知\n  - 存储服务: 消息持久化\n  - 状态服务: 在线状态管理\n\n**数据层**:\n- 关系型数据库 (PostgreSQL): 用户信息、群组信息\n- NoSQL数据库 (MongoDB): 消息历史\n- 缓存 (Redis): 在线状态、最近消息\n- 消息队列 (Kafka): 消息分发\n- 对象存储 (S3): 媒体文件\n\n**3. 关键技术设计**\n\n**实时通信**:\n- WebSocket长连接\n- 心跳机制保持连接\n- 断线重连策略\n- 消息ACK机制\n\n**消息流设计**:\n```\n客户端A -> 接入服务器 -> 消息服务 -> Kafka -> 消息分发服务 -> 接入服务器 -> 客户端B\n```\n\n**数据模型**:\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  username VARCHAR(50) UNIQUE,\n  avatar_url VARCHAR(255),\n  status VARCHAR(20),\n  last_active TIMESTAMP\n);\n\nCREATE TABLE conversations (\n  id UUID PRIMARY KEY,\n  type VARCHAR(10), -- 'single' or 'group'\n  created_at TIMESTAMP,\n  updated_at TIMESTAMP\n);\n\nCREATE TABLE conversation_members (\n  conversation_id UUID REFERENCES conversations(id),\n  user_id UUID REFERENCES users(id),\n  role VARCHAR(20), -- 'admin', 'member'\n  joined_at TIMESTAMP,\n  PRIMARY KEY (conversation_id, user_id)\n);\n\nCREATE TABLE messages (\n  id UUID PRIMARY KEY,\n  conversation_id UUID REFERENCES conversations(id),\n  sender_id UUID REFERENCES users(id),\n  content TEXT,\n  content_type VARCHAR(20), -- 'text', 'image', 'video', etc.\n  sent_at TIMESTAMP,\n  updated_at TIMESTAMP,\n  is_deleted BOOLEAN DEFAULT FALSE\n);\n\nCREATE TABLE message_receipts (\n  message_id UUID REFERENCES messages(id),\n  user_id UUID REFERENCES users(id),\n  is_delivered BOOLEAN DEFAULT FALSE,\n  delivered_at TIMESTAMP,\n  is_read BOOLEAN DEFAULT FALSE,\n  read_at TIMESTAMP,\n  PRIMARY KEY (message_id, user_id)\n);\n```\n\n**4. 扩展性设计**\n\n**水平扩展**:\n- WebSocket服务器集群，使用负载均衡\n- 消息服务分片，按会话ID路由\n\n**消息分发优化**:\n- 发布-订阅模式\n- 消息批处理\n\n**多设备同步**:\n- 消息ID和时间戳确保顺序\n- 增量同步机制\n- 设备间状态同步\n\n**5. 可靠性设计**\n\n**消息可靠性**:\n- 消息持久化\n- 消息重传机制\n- 幂等处理避免重复\n\n**高可用性**:\n- 服务冗余部署\n- 自动故障转移\n- 区域级容灾\n\n**6. 性能优化**\n\n**连接优化**:\n- 连接池管理\n- 长轮询降级方案\n- 连接多路复用\n\n**消息优化**:\n- 消息压缩\n- 批量获取历史消息\n- 增量更新\n\n**7. 特殊功能实现**\n\n**已读回执**:\n- 客户端发送已读确认\n- 服务端更新消息状态\n- 向发送者推送已读通知\n\n**在线状态**:\n- 心跳包更新状态\n- Redis存储在线状态\n- 状态变更广播\n\n**群聊优化**:\n- 大群消息扇出优化\n- 消息分页加载\n- 群成员缓存\n\n**8. 安全性设计**\n\n**消息加密**:\n- 端到端加密\n- 传输层加密(TLS)\n\n**认证与授权**:\n- JWT认证\n- 细粒度权限控制\n\n**防护措施**:\n- 消息频率限制\n- 内容审核\n- 防盗号机制\n\n**9. 监控与运维**\n\n**关键指标**:\n- 消息延迟\n- 连接数\n- 消息吞吐量\n- 错误率\n\n**日志与分析**:\n- 分布式日志收集\n- 实时监控告警\n- 性能瓶颈分析\n\n这个设计方案考虑了实时聊天系统的核心需求和技术挑战，采用了WebSocket长连接、消息队列、多级存储等技术来实现高性能、高可靠的聊天功能。',
          keywords: ['WebSocket', '消息队列', '实时推送', '状态同步', '端到端加密', '水平扩展']
        },
        {
          id: 305,
          question: '设计一个视频流媒体服务，如YouTube或Netflix。',
          answer: '设计视频流媒体服务需要考虑内容存储、转码、分发和用户体验等多方面因素。\n\n**1. 系统需求**\n- 视频上传和存储\n- 视频转码和处理\n- 视频流式传输\n- 用户账户和订阅\n- 内容推荐\n- 搜索功能\n- 评论和互动\n- 内容管理和审核\n\n**2. 系统架构**\n\n**客户端**:\n- Web客户端\n- 移动应用\n- 智能电视应用\n\n**后端服务**:\n- API网关: 请求路由、认证、限流\n- 用户服务: 账户管理、认证、订阅\n- 内容服务: 视频元数据管理\n- 上传服务: 处理视频上传\n- 转码服务: 视频格式转换和质量适配\n- 流媒体服务: 视频流传输\n- 推荐服务: 内容个性化推荐\n- 搜索服务: 视频搜索\n- 互动服务: 评论、点赞、分享\n- 分析服务: 用户行为分析\n\n**存储层**:\n- 对象存储: 原始视频文件和转码后的视频\n- CDN: 视频内容分发\n- 关系型数据库: 用户数据、视频元数据\n- NoSQL数据库: 用户行为、推荐数据\n- 搜索引擎: 视频搜索索引\n- 缓存: 热门视频元数据、用户会话\n\n**3. 视频处理流程**\n\n**上传流程**:\n1. 用户上传视频\n2. 上传服务接收并存储原始文件\n3. 触发转码任务\n4. 转码服务将视频转换为多种格式和质量\n5. 转码完成后更新视频状态\n6. 将转码后的视频分发到CDN\n\n**转码策略**:\n- 自适应比特率流(ABR): 同一视频多种质量(240p, 360p, 480p, 720p, 1080p, 4K)\n- 多格式支持: HLS, DASH, MP4\n- 支持不同设备: 移动设备、桌面、智能电视\n\n**4. 内容分发网络(CDN)**\n\n**全球分发**:\n- 多区域CDN节点\n- 就近访问原则\n- 边缘缓存策略\n\n**智能路由**:\n- 基于用户地理位置\n- 基于网络质量\n- 负载均衡\n\n**5. 流媒体技术**\n\n**协议选择**:\n- HLS (HTTP Live Streaming): iOS设备和大多数浏览器\n- DASH (Dynamic Adaptive Streaming over HTTP): Android和现代浏览器\n- RTMP/RTSP: 低延迟直播场景\n\n**自适应流**:\n- 根据网络条件动态调整视频质量\n- 缓冲策略优化\n- 预加载机制\n\n**6. 数据模型**\n\n**视频元数据**:\n```sql\nCREATE TABLE videos (\n  id UUID PRIMARY KEY,\n  title VARCHAR(255),\n  description TEXT,\n  creator_id UUID REFERENCES users(id),\n  duration INT, -- in seconds\n  category VARCHAR(50),\n  tags TEXT[],\n  visibility VARCHAR(20), -- public, private, unlisted\n  upload_status VARCHAR(20),\n  created_at TIMESTAMP,\n  published_at TIMESTAMP,\n  view_count BIGINT DEFAULT 0,\n  like_count INT DEFAULT 0,\n  dislike_count INT DEFAULT 0\n);\n\nCREATE TABLE video_assets (\n  id UUID PRIMARY KEY,\n  video_id UUID REFERENCES videos(id),\n  quality VARCHAR(10), -- 240p, 360p, 480p, 720p, 1080p, 4K\n  format VARCHAR(10), -- HLS, DASH, MP4\n  file_size BIGINT,\n  url VARCHAR(255),\n  created_at TIMESTAMP\n);\n```\n\n**用户互动**:\n```sql\nCREATE TABLE video_views (\n  id UUID PRIMARY KEY,\n  video_id UUID REFERENCES videos(id),\n  user_id UUID REFERENCES users(id),\n  watched_duration INT, -- in seconds\n  watched_percentage FLOAT,\n  device_type VARCHAR(50),\n  ip_address VARCHAR(45),\n  viewed_at TIMESTAMP\n);\n\nCREATE TABLE comments (\n  id UUID PRIMARY KEY,\n  video_id UUID REFERENCES videos(id),\n  user_id UUID REFERENCES users(id),\n  content TEXT,\n  parent_id UUID REFERENCES comments(id), -- for replies\n  created_at TIMESTAMP,\n  like_count INT DEFAULT 0\n);\n```\n\n**7. 推荐系统**\n\n**数据收集**:\n- 观看历史\n- 点赞和评论\n- 完成率\n- 搜索历史\n- 用户画像\n\n**推荐算法**:\n- 协同过滤\n- 内容基于推荐\n- 深度学习模型\n- 实时个性化\n\n**8. 扩展性设计**\n\n**视频存储扩展**:\n- 分布式对象存储\n- 冷热数据分离\n\n**转码服务扩展**:\n- 弹性转码集群\n- 任务优先级队列\n\n**流量应对**:\n- 多层缓存\n- 流量预测和资源预留\n\n**9. 监控与分析**\n\n**用户体验监控**:\n- 缓冲率\n- 启动时间\n- 播放错误率\n- 切换质量频率\n\n**系统监控**:\n- CDN性能\n- 转码队列长度\n- 存储使用率\n- API响应时间\n\n**10. 安全性设计**\n\n**内容保护**:\n- DRM (数字版权管理)\n- 视频水印\n- 防盗链措施\n\n**用户安全**:\n- 内容过滤和审核\n- 版权检测\n- 隐私保护\n\n这个设计方案考虑了视频流媒体服务的核心需求和技术挑战，采用了分布式架构、CDN内容分发、自适应流媒体等技术来实现高性能、高可用的视频服务。',
          keywords: ['CDN', '转码', '自适应流', 'HLS', 'DASH', '内容分发', '推荐系统']
        }
      ],
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
      questions: [
        {
          id: 401,
          question: '如何处理团队中两名核心成员之间的冲突？',
          answer: '处理团队成员冲突是管理者的重要职责，尤其是当冲突发生在核心成员之间时，可能会影响整个团队的氛围和效率。\n\n**处理步骤**:\n\n**1. 了解情况**\n- 与双方分别进行一对一谈话\n- 客观收集事实，避免主观判断\n- 了解冲突的根本原因（工作方式差异、沟通不畅、资源竞争等）\n- 评估冲突对团队的影响程度\n\n**2. 促进沟通**\n- 安排适当的时间和私密空间\n- 设定明确的会谈目标和规则\n- 鼓励双方表达感受和观点\n- 使用"我"陈述而非指责性语言\n- 确保双方都有平等的发言机会\n\n**3. 寻找共识**\n- 引导双方关注共同目标\n- 识别双方的共同点\n- 讨论不同观点背后的价值和关切\n- 寻找双方都能接受的解决方案\n\n**4. 制定行动计划**\n- 明确具体的改进措施\n- 设定清晰的期望和界限\n- 建立定期检查机制\n- 必要时调整工作安排或责任分配\n\n**5. 后续跟进**\n- 定期检查情况改善程度\n- 及时给予积极反馈\n- 必要时进行调整\n\n**管理原则**:\n\n- **保持中立**: 不偏袒任何一方\n- **聚焦问题而非人**: 将讨论重点放在行为和影响上\n- **尊重隐私**: 避免在团队中公开讨论冲突\n- **树立榜样**: 展示健康的冲突解决方式\n- **预防胜于解决**: 建立开放的沟通文化\n\n**情境示例**:\n\n"在我管理的开发团队中，技术负责人和产品负责人在项目优先级上产生了严重分歧。技术负责人坚持先解决技术债务，而产品负责人则强调新功能的市场时机。\n\n我首先与双方分别交谈，了解各自的顾虑。然后安排了一次三方会议，设定了明确的议程：理解彼此的优先事项，找出共同目标，制定平衡的解决方案。\n\n在会议中，我引导双方认识到我们的共同目标是产品的长期成功。通过讨论，我们达成了折中方案：将技术债务工作分解为小块，穿插在新功能开发中，并建立了明确的技术健康度指标。\n\n我们还建立了每周的技术-产品同步会议，提前讨论可能的冲突点。三个月后，这种方式不仅解决了当前冲突，还显著改善了技术和产品团队的协作关系。"',
          keywords: ['冲突管理', '沟通技巧', '团队协作', '问题解决', '领导力']
        },
        {
          id: 402,
          question: '你如何激励一个士气低落的团队？',
          answer: '激励士气低落的团队是管理者面临的常见挑战，需要综合运用多种策略来重建团队信心和动力。\n\n**诊断阶段**:\n\n**1. 了解根本原因**\n- 进行一对一谈话和团队匿名调查\n- 识别士气低落的具体原因：\n  - 工作压力过大\n  - 缺乏认可和成就感\n  - 职业发展受限\n  - 团队内部冲突\n  - 目标不明确或不认同\n  - 工作环境问题\n  - 组织变革带来的不确定性\n\n**2. 评估团队状态**\n- 团队凝聚力\n- 工作满意度\n- 成员参与度\n- 信任水平\n\n**解决策略**:\n\n**1. 重建目标和意义**\n- 明确团队使命和愿景\n- 将团队工作与更大的组织目标联系起来\n- 强调工作的意义和影响\n- 设定可实现的短期目标，创造"小胜利"\n\n**2. 改善沟通**\n- 增加透明度，分享公司信息\n- 建立定期的团队会议和反馈机制\n- 创造开放的沟通环境\n- 积极倾听团队成员的意见和建议\n\n**3. 认可和奖励**\n- 公开表彰团队和个人成就\n- 建立正式和非正式的认可机制\n- 确保奖励公平且有意义\n- 个性化认可（了解每个人的偏好）\n\n**4. 职业发展**\n- 提供学习和成长机会\n- 制定个人发展计划\n- 指导和辅导\n- 创造内部晋升和轮岗机会\n\n**5. 团队建设**\n- 组织团队建设活动\n- 促进团队成员之间的联系\n- 庆祝团队成就和里程碑\n- 创造共同经历\n\n**6. 工作环境改善**\n- 解决工作场所的物理问题\n- 优化工作流程和减少障碍\n- 提供必要的资源和工具\n- 平衡工作负载\n\n**7. 以身作则**\n- 展示积极的态度\n- 保持高能量和热情\n- 分享个人挑战和克服方法\n- 实践你所宣扬的价值观\n\n**实施计划**:\n\n**短期行动** (1-2周)\n- 召开团队会议，坦诚讨论现状\n- 设定2-3个可立即实现的小目标\n- 解决最紧迫的环境或资源问题\n- 开始一对一谈话\n\n**中期行动** (1-3个月)\n- 实施认可和奖励计划\n- 组织团队建设活动\n- 开始改进工作流程\n- 提供培训和发展机会\n\n**长期行动** (3-6个月)\n- 重新定义团队使命和目标\n- 建立持续的职业发展路径\n- 创建可持续的团队文化\n- 定期评估进展和调整策略\n\n**情境示例**:\n\n"我曾接手一个因连续项目失败而士气低落的开发团队。通过一对一谈话，我发现团队成员感到他们的努力没有得到认可，技术债务积累严重，且对产品方向缺乏信心。\n\n我首先解决了最紧迫的技术债务问题，给团队创造了"喘息空间"。然后，我们一起重新定义了团队的技术愿景，并将大目标分解为可管理的小任务。\n\n我引入了每周的"胜利时刻"，庆祝团队的进步和成就，无论大小。同时，我与产品团队合作，确保开发团队早期参与产品决策，增强他们的主人翁意识。\n\n我还为每位团队成员创建了个性化的成长计划，包括技术培训和领导力发展机会。三个月后，团队完成了一个关键项目，比预期提前一周，质量超出预期。六个月后，这个曾经士气低落的团队成为了公司内部最受欢迎的团队之一，团队成员满意度提高了40%。"',
          keywords: ['团队激励', '士气管理', '沟通策略', '团队建设', '认可机制', '职业发展']
        },
        {
          id: 403,
          question: '如何有效地进行团队绩效管理？',
          answer: '有效的团队绩效管理是组织成功的关键，它需要系统化的方法来设定目标、监控进展、提供反馈并持续改进。\n\n**1. 建立明确的绩效管理框架**\n\n**目标设定**:\n- 使用SMART原则(具体、可衡量、可实现、相关、有时限)\n- 将团队目标与组织目标对齐\n- 确保团队成员理解并认同目标\n- 平衡定量和定性目标\n\n**关键绩效指标(KPI)**:\n- 为团队设定3-7个核心KPI\n- 确保KPI能真实反映团队价值\n- 包括结果指标和过程指标\n- 定期审查KPI的相关性\n\n**2. 持续反馈与沟通**\n\n**定期检查**:\n- 每周团队进度会议\n- 每月绩效回顾\n- 季度目标调整\n- 年度绩效评估\n\n**多渠道反馈**:\n- 管理者反馈\n- 同事反馈\n- 自我评估\n- 客户/利益相关者反馈\n\n**有效反馈原则**:\n- 及时性: 尽快提供反馈\n- 具体性: 针对具体行为而非人格\n- 平衡性: 既指出优点也指出改进空间\n- 发展性: 关注未来改进而非过去错误\n\n**3. 个人发展与团队成长**\n\n**个人发展计划**:\n- 识别每个成员的优势和发展空间\n- 制定个性化的发展目标\n- 提供必要的资源和支持\n- 定期跟进进展\n\n**团队能力建设**:\n- 识别团队整体的能力差距\n- 组织团队培训和学习活动\n- 鼓励知识分享和最佳实践交流\n- 建立学习型团队文化\n\n**4. 绩效问题处理**\n\n**识别绩效问题**:\n- 定期数据分析\n- 观察行为变化\n- 收集多方反馈\n\n**干预策略**:\n- 及时沟通和澄清期望\n- 提供必要的支持和资源\n- 制定具体的改进计划\n- 设定明确的跟进时间点\n\n**绩效改进计划**:\n- 明确改进目标\n- 具体行动步骤\n- 必要的支持措施\n- 明确的时间表和评估标准\n\n**5. 认可与奖励**\n\n**认可原则**:\n- 及时性: 尽快认可成就\n- 具体性: 明确指出贡献\n- 公开性: 在适当场合公开表彰\n- 真实性: 真诚而非敷衍\n\n**奖励机制**:\n- 财务奖励: 绩效奖金、加薪\n- 非财务奖励: 表彰、额外休假、发展机会\n- 团队奖励: 团队活动、共同庆祝\n- 个性化奖励: 基于个人偏好\n\n**6. 工具与技术支持**\n\n**绩效管理系统**:\n- 目标跟踪工具\n- 反馈收集平台\n- 数据分析仪表板\n- 一对一会议记录工具\n\n**数据驱动决策**:\n- 收集相关绩效数据\n- 分析趋势和模式\n- 基于数据调整策略\n- 透明地分享数据\n\n**7. 文化与环境**\n\n**绩效文化建设**:\n- 强调持续改进而非惩罚\n- 鼓励诚实和透明\n- 庆祝成功和学习\n- 容许适当的失败和创新\n\n**心理安全**:\n- 创造开放表达的环境\n- 鼓励建设性反馈\n- 将错误视为学习机会\n- 重视每个人的贡献\n\n**8. 实施案例**\n\n"在我管理的软件开发团队中，我实施了一套综合的绩效管理系统。首先，我们在季度初通过协作方式设定团队OKRs，确保每个人都理解并认同这些目标。\n\n我们建立了每周的团队站会和每月的绩效回顾会议。在月度会议中，我们不仅回顾KPI达成情况，还讨论工作中的挑战和学习。\n\n对于每个团队成员，我们制定了个性化的发展计划，包括技术培训和软技能提升。我每两周与每位成员进行一次一对一会谈，提供具体反馈并讨论发展进展。\n\n当团队中出现绩效问题时，我会及时干预，通过明确期望、提供必要支持和制定具体改进计划来帮助成员重回正轨。\n\n我们还建立了多层次的认可机制，包括每周的'明星贡献者'表彰、季度绩效奖金和年度团队旅行。\n\n这套系统帮助我们在一年内将团队生产力提高了30%，员工满意度提升了25%，同时团队流失率降低了15%。"',
          keywords: ['绩效管理', 'KPI', 'SMART目标', '反馈机制', '个人发展', '团队文化']
        },
        {
          id: 404,
          question: '作为团队领导，你如何处理一个表现不佳的团队成员？',
          answer: '处理表现不佳的团队成员是管理者面临的常见挑战，需要平衡团队效率、个人发展和组织文化。\n\n**1. 识别和分析问题**\n\n**问题识别**:\n- 收集具体的绩效数据和行为观察\n- 区分偶发性问题和持续性问题\n- 确认问题的严重程度和影响范围\n\n**根因分析**:\n- 技能不足: 缺乏必要的技能或知识\n- 动机问题: 缺乏工作积极性或投入\n- 沟通障碍: 误解期望或要求\n- 个人因素: 健康、家庭或其他个人问题\n- 环境因素: 工作环境、团队动态或资源限制\n- 角色匹配: 职位与个人能力和兴趣不匹配\n\n**2. 初步干预**\n\n**一对一沟通**:\n- 选择私密、不受干扰的环境\n- 以关心和支持的态度开始对话\n- 具体描述观察到的行为和影响\n- 避免指责性语言，使用"我"陈述\n- 积极倾听员工的观点和解释\n\n**明确期望**:\n- 重申岗位职责和绩效标准\n- 确保员工理解期望\n- 讨论当前表现与期望的差距\n\n**3. 制定改进计划**\n\n**共同制定计划**:\n- 设定具体、可衡量的改进目标\n- 确定明确的时间表和里程碑\n- 列出具体的行动步骤\n- 明确成功的标准\n\n**提供必要支持**:\n- 培训和技能发展\n- 指导和辅导\n- 调整工作环境或资源\n- 必要时提供个人支持（如EAP服务）\n\n**4. 持续跟进**\n\n**定期检查**:\n- 安排定期的一对一会议\n- 提供及时、具体的反馈\n- 认可进步和改进\n- 根据需要调整计划\n\n**文档记录**:\n- 记录所有会议和讨论\n- 记录绩效问题和改进情况\n- 记录提供的支持和资源\n\n**5. 评估结果**\n\n**改进情况**:\n- 评估是否达到设定的目标\n- 比较当前表现与基准表现\n- 收集团队反馈\n\n**决策点**:\n- 如果表现改善: 继续支持和强化\n- 如果有部分改善: 调整计划并继续\n- 如果没有改善: 考虑更严肃的干预\n\n**6. 进一步行动**\n\n**如果表现改善**:\n- 认可和庆祝进步\n- 继续提供支持和反馈\n- 考虑新的发展机会\n\n**如果表现未改善**:\n- 重新评估根本原因\n- 考虑角色调整或重新分配\n- 启动正式的绩效改进计划(PIP)\n- 必要时考虑终止雇佣关系（遵循HR流程）\n\n**7. 预防策略**\n\n**招聘和入职**:\n- 改进招聘流程，确保角色匹配\n- 完善入职培训\n- 设定明确的早期期望\n\n**团队文化**:\n- 建立持续反馈文化\n- 鼓励开放沟通\n- 定期进行团队健康检查\n\n**8. 案例分析**\n\n"在我管理的开发团队中，一位资深开发者开始出现代码质量下降、错过截止日期的情况。我安排了一次私下会谈，以关心的态度表达了我的观察，并询问是否有我可以提供帮助的地方。\n\n通过对话，我了解到他正在适应新的技术栈，同时也面临家庭压力。我们共同制定了一个90天的改进计划，包括：\n1. 安排他与团队技术专家进行每周一次的指导会议\n2. 临时减轻他的工作量，让他有时间学习新技术\n3. 提供更灵活的工作安排，帮助他平衡工作和家庭需求\n4. 设定每周检查点，评估进展\n\n在接下来的几周里，我看到了稳步改善。代码质量提高了，截止日期也开始按时完成。两个月后，他的表现恢复到了以前的水平，甚至在新技术方面成为了团队的资源。\n\n这次经历教会我，表现问题通常有多种因素，而不仅仅是动机或能力问题。通过同理心、明确的期望和适当的支持，大多数表现问题都可以得到有效解决。"',
          keywords: ['绩效管理', '根因分析', '改进计划', '反馈机制', '支持策略', '团队领导']
        },
        {
          id: 405,
          question: '如何在团队中推动创新文化？',
          answer: '在团队中推动创新文化需要系统性的方法，包括建立正确的环境、流程和激励机制。\n\n**1. 创建心理安全的环境**\n\n**建立心理安全**:\n- 鼓励开放表达想法和意见\n- 将失败视为学习机会而非惩罚对象\n- 尊重不同观点和建设性异议\n- 以身作则，承认自己的错误和不确定性\n\n**消除创新障碍**:\n- 减少官僚主义和不必要的审批\n- 打破"一直都是这样做的"思维定式\n- 挑战现状和假设\n- 消除对尝试新方法的恐惧\n\n**2. 建立创新流程和实践**\n\n**结构化创新活动**:\n- 定期头脑风暴会议\n- 创新工作坊和黑客马拉松\n- 创新挑战赛\n- 跨职能创新小组\n\n**时间和空间**:\n- 分配专门的创新时间（如谷歌的20%时间）\n- 创建物理或虚拟的创新空间\n- 允许自主探索和实验\n\n**创新方法论**:\n- 设计思维（Design Thinking）\n- 精益创业（Lean Startup）\n- 敏捷开发（Agile Development）\n- 快速原型和MVP（最小可行产品）\n\n**3. 培养创新能力和思维**\n\n**技能发展**:\n- 创造性思维培训\n- 问题解决技巧\n- 设计思维工作坊\n- 跨领域学习机会\n\n**多样性和包容性**:\n- 构建多元化团队\n- 鼓励不同背景和观点\n- 促进跨部门合作\n- 寻求外部视角和灵感\n\n**好奇心和学习文化**:\n- 鼓励持续学习和探索\n- 分享行业趋势和新技术\n- 建立学习资源库\n- 举办知识分享会议\n\n**4. 领导力和管理实践**\n\n**创新领导力**:\n- 明确创新的战略重要性\n- 为创新提供资源和支持\n- 容忍模糊性和不确定性\n- 平衡短期结果和长期创新\n\n**目标设定**:\n- 将创新纳入团队和个人目标\n- 设定挑战性但可实现的创新指标\n- 平衡效率目标和创新目标\n\n**决策过程**:\n- 基于证据而非层级做决策\n- 鼓励实验和测试假设\n- 采用快速决策和迭代方法\n\n**5. 认可和奖励创新**\n\n**激励机制**:\n- 认可和庆祝创新尝试，而非仅仅成功\n- 建立创新奖励计划\n- 将创新纳入绩效评估\n- 提供创新实施的资源\n\n**分享成功故事**:\n- 宣传创新案例和成功\n- 分享学习和见解\n- 创建创新展示平台\n\n**6. 衡量和评估创新**\n\n**创新指标**:\n- 创新尝试数量\n- 实施的创新想法比例\n- 创新对业务的影响\n- 团队参与度和多样性\n\n**反馈循环**:\n- 定期评估创新文化\n- 收集团队反馈\n- 持续改进创新流程\n\n**7. 实际案例**\n\n"在我领导的产品开发团队中，我实施了多项措施来培养创新文化：\n\n首先，我们引入了'创新星期五'，团队成员可以将20%的时间用于探索新想法。为了确保这不仅仅是口号，我亲自参与并展示了我的创新项目，同时确保团队成员不会因为参与创新活动而被其他工作压力所淹没。\n\n其次，我们建立了'快速实验'框架，简化了测试新想法的流程。任何团队成员都可以提出实验提案，只需要一页纸的计划和明确的学习目标。我们为这些实验分配了专门的预算和资源。\n\n第三，我们改变了对失败的态度。我开始在团队会议上分享'有价值的失败'，讨论我们从失败中学到的经验。我们还创建了'失败墙'，团队成员可以分享他们的尝试和学习。\n\n最后，我们将创新纳入绩效评估，不仅看结果，还看过程和学习。\n\n这些措施在18个月内带来了显著变化：团队提出的新想法增加了200%，其中30%被实施到产品中，客户满意度提高了25%，团队参与度提高了40%。最重要的是，团队成员开始主动挑战现状，提出改进建议，创新成为了团队DNA的一部分。"',
          keywords: ['创新文化', '心理安全', '设计思维', '实验精神', '多样性思维', '创新激励']
        }
      ],
      time: '35分钟',
      rating: 4.7,
      users: 420,
      description: '领导力、冲突解决、团队建设相关场景'
    }
  ]

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

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

  const startPractice = (questionSet) => {
    setActivePractice(questionSet)
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setShowAnswer(false)
    setPracticeStartTime(Date.now())
    setElapsedTime(0)
    setCompletedQuestions([])
    setPracticeScore(0)
    toast.success(`开始练习: ${questionSet.title}`)
  }

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast.error('请输入您的回答')
      return
    }

    // 简单评分算法
    const currentQuestion = activePractice.questions[currentQuestionIndex]
    const keywords = currentQuestion.keywords || []
    let score = 0
    let matchedKeywords = 0

    // 计算关键词匹配
    keywords.forEach(keyword => {
      if (userAnswer.toLowerCase().includes(keyword.toLowerCase())) {
        matchedKeywords++
      }
    })

    // 基于关键词匹配和答案长度计算分数
    if (keywords.length > 0) {
      score = Math.round((matchedKeywords / keywords.length) * 70)
    }

    // 答案长度加分
    if (userAnswer.length > 100) score += 10
    if (userAnswer.length > 300) score += 10
    if (userAnswer.length > 500) score += 10

    // 限制最高分为100
    score = Math.min(score, 100)

    // 更新完成的问题
    setCompletedQuestions([...completedQuestions, {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer,
      score,
      matchedKeywords,
      totalKeywords: keywords.length
    }])

    // 更新总分
    const newTotalScore = Math.round(
      ((practiceScore * completedQuestions.length) + score) / (completedQuestions.length + 1)
    )
    setPracticeScore(newTotalScore)

    // 显示答案
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < activePractice.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer('')
      setShowAnswer(false)
    } else {
      // 完成练习
      finishPractice()
    }
  }

  const finishPractice = () => {
    const totalTime = Math.floor((Date.now() - practiceStartTime) / 1000)
    
    // 保存练习记录
    addInterviewSession({
      sessionName: activePractice.title,
      sessionType: 'practice',
      category: activePractice.category,
      difficulty: activePractice.difficulty,
      totalQuestions: activePractice.questions.length,
      completedQuestions: completedQuestions.length,
      averageScore: practiceScore,
      totalTime,
      questions: completedQuestions
    })

    // 更新练习时间
    updatePracticeTime(Math.floor(totalTime / 60))

    toast.success(`练习完成！总分: ${practiceScore}`)
    
    // 重置状态
    setActivePractice(null)
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setShowAnswer(false)
    setPracticeStartTime(null)
    setElapsedTime(0)
    setCompletedQuestions([])
    setPracticeScore(0)
  }

  const exitPractice = () => {
    if (completedQuestions.length > 0) {
      const totalTime = Math.floor((Date.now() - practiceStartTime) / 1000)
      
      // 保存练习记录
      addInterviewSession({
        sessionName: activePractice.title,
        sessionType: 'practice',
        category: activePractice.category,
        difficulty: activePractice.difficulty,
        totalQuestions: activePractice.questions.length,
        completedQuestions: completedQuestions.length,
        averageScore: practiceScore,
        totalTime,
        questions: completedQuestions,
        completed: false
      })

      // 更新练习时间
      updatePracticeTime(Math.floor(totalTime / 60))
      
      toast.success(`已保存练习进度！`)
    }
    
    // 重置状态
    setActivePractice(null)
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setShowAnswer(false)
    setPracticeStartTime(null)
    setElapsedTime(0)
    setCompletedQuestions([])
    setPracticeScore(0)
  }

  // 渲染练习模式
  if (activePractice) {
    const currentQuestion = activePractice.questions[currentQuestionIndex]
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen py-8"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 练习头部 */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={exitPractice}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{activePractice.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(activePractice.difficulty)}`}>
                      {activePractice.difficulty}
                    </span>
                    <span>•</span>
                    <span>{activePractice.category === 'technical' ? '技术面试' : 
                           activePractice.category === 'behavioral' ? '行为面试' : 
                           activePractice.category === 'case' ? '案例分析' : '领导力'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{formatTime(elapsedTime)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {currentQuestionIndex + 1} / {activePractice.questions.length}
                  </span>
                </div>
                {completedQuestions.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{practiceScore}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 问题区域 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">问题 {currentQuestionIndex + 1}</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">{currentQuestion.question}</p>
            
            {/* 关键词提示 */}
            {currentQuestion.keywords && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="text-sm text-blue-700 font-medium mb-2">关键词提示:</div>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 用户回答区域 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                您的回答
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showAnswer}
                placeholder="请输入您的回答..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={8}
              />
              
              {!showAnswer && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2 inline" />
                    提交回答
                  </button>
                </div>
              )}
            </div>
            
            {/* 参考答案 */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">参考答案</h3>
                  
                  {completedQuestions.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">得分:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {completedQuestions[completedQuestions.length - 1].score}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="prose prose-sm max-w-none">
                    {currentQuestion.answer.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {/* 匹配的关键词 */}
                {completedQuestions.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-green-700 font-medium mb-2">
                      关键词匹配: {completedQuestions[completedQuestions.length - 1].matchedKeywords}/{completedQuestions[completedQuestions.length - 1].totalKeywords}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.keywords.map((keyword, index) => {
                        const isMatched = userAnswer.toLowerCase().includes(keyword.toLowerCase())
                        return (
                          <span 
                            key={index} 
                            className={`px-2 py-1 rounded text-xs ${
                              isMatched 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {keyword} {isMatched && <CheckCircle className="w-3 h-3 inline ml-1" />}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    {currentQuestionIndex < activePractice.questions.length - 1 ? (
                      <>
                        下一题
                        <ArrowRight className="w-4 h-4 ml-2 inline" />
                      </>
                    ) : (
                      <>
                        完成练习
                        <CheckCircle className="w-4 h-4 ml-2 inline" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* 进度条 */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">练习进度</span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestionIndex + 1) / activePractice.questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / activePractice.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    )
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
                    <span>{questionSet.questions.length} 题</span>
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
                  <button 
                    onClick={() => startPractice(questionSet)}
                    className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium rounded-lg transition-colors duration-200"
                  >
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
              <div 
                key={set.id} 
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => startPractice(set)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{set.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{set.questions.length} 题</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{set.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 练习统计 */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">练习统计</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">24</div>
              <div className="text-sm text-gray-500">已完成题目</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">85.2</div>
              <div className="text-sm text-gray-500">平均得分</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">12.5h</div>
              <div className="text-sm text-gray-500">总练习时长</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-500">已获得徽章</div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
              查看详细统计
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Practice