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
          answer: `闭包是指一个函数能够访问其词法作用域之外的变量的能力。当函数被定义时，它会保留对其所在词法作用域的引用，即使该函数在其他作用域中被调用，它仍然能够访问其原始作用域中的变量。

实际应用场景：
1. 数据封装和私有变量
2. 函数工厂
3. 事件处理器和回调
4. 模块模式

示例代码：
\`\`\`javascript
function createCounter() {
  let count = 0; // 私有变量
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
\`\`\`

在这个例子中，\`count\`变量对外部代码是不可访问的，只能通过返回的方法来操作，这就是闭包的实际应用。`,
          keywords: ['闭包', '词法作用域', '私有变量', '函数工厂', '模块模式']
        },
        {
          id: 102,
          question: '解释JavaScript中的原型链和继承机制。',
          answer: `JavaScript中的原型链是实现继承的主要机制。每个JavaScript对象都有一个原型对象，对象从其原型继承属性和方法。当访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript引擎会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的末端（null）。

继承机制：
1. 原型继承：通过设置一个对象的原型为另一个对象，实现继承
2. 构造函数继承：使用call或apply方法在子类构造函数中调用父类构造函数
3. 组合继承：结合原型继承和构造函数继承
4. ES6 class继承：使用class和extends关键字

示例代码：
\`\`\`javascript
// ES6 class继承
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a noise.\`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }
  
  speak() {
    console.log(\`\${this.name} barks!\`);
  }
  
  getBreed() {
    return this.breed;
  }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // "Rex barks!"
console.log(dog.getBreed()); // "German Shepherd"
\`\`\`

这个例子展示了ES6 class语法下的继承，Dog类继承了Animal类的属性和方法，并可以重写父类方法。`,
          keywords: ['原型链', '继承', '构造函数', 'class', 'extends', 'super']
        },
        {
          id: 103,
          question: '解释JavaScript中的事件循环机制，以及宏任务和微任务的区别。',
          answer: `JavaScript的事件循环是一种处理异步操作的机制。JavaScript是单线程的，事件循环允许它执行非阻塞操作，通过将操作推送到事件队列中，并在主线程空闲时处理这些操作。

事件循环的基本流程：
1. 执行同步代码（主线程上的代码）
2. 检查微任务队列，执行所有微任务
3. 执行一个宏任务
4. 再次检查微任务队列，执行所有微任务
5. 重复步骤3和4

宏任务和微任务的区别：
- 宏任务（MacroTask）：包括setTimeout、setInterval、setImmediate、I/O操作、UI渲染等
- 微任务（MicroTask）：包括Promise.then/catch/finally、process.nextTick、MutationObserver等

关键区别是微任务总是在当前宏任务执行完毕后立即执行，而下一个宏任务则要等到所有微任务执行完毕后才会执行。

示例代码：
\`\`\`javascript
console.log('1 - 同步代码');

setTimeout(() => {
  console.log('2 - 宏任务');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - 微任务');
});

console.log('4 - 同步代码');

// 输出顺序：
// 1 - 同步代码
// 4 - 同步代码
// 3 - 微任务
// 2 - 宏任务
\`\`\`

这个例子展示了事件循环的执行顺序：先执行同步代码，然后执行微任务，最后执行宏任务。`,
          keywords: ['事件循环', '宏任务', '微任务', 'Promise', 'setTimeout', '异步']
        },
        {
          id: 104,
          question: '解释React中的虚拟DOM及其工作原理。',
          answer: `虚拟DOM（Virtual DOM）是React的核心概念之一，它是一种编程概念，其中UI的理想或"虚拟"表示保存在内存中，并通过ReactDOM等库与"真实"DOM同步。这个过程称为协调（Reconciliation）。

工作原理：
1. 当组件的状态或属性发生变化时，React会创建一个新的虚拟DOM树
2. React比较（diff）新旧虚拟DOM树的差异
3. 计算出需要更新的最小操作集
4. 批量执行这些操作，只更新真实DOM中需要变化的部分

虚拟DOM的优势：
- 性能优化：最小化DOM操作，减少重排和重绘
- 跨平台：虚拟DOM是平台无关的，可以渲染到不同环境（Web、Native等）
- 声明式编程：开发者只需关注状态变化，而不是DOM操作

示例：
\`\`\`jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

当点击按钮时，React会：
1. 创建一个新的虚拟DOM树，其中count值增加了1
2. 比较新旧虚拟DOM树
3. 发现只有p标签的文本内容发生了变化
4. 只更新真实DOM中的那个文本节点，而不是重新渲染整个组件`,
          keywords: ['虚拟DOM', '协调', 'diff算法', '性能优化', '批量更新', 'React']
        },
        {
          id: 105,
          question: '解释JavaScript中的Promise及其异步处理方式。',
          answer: `Promise是JavaScript中处理异步操作的一种对象，它代表了一个异步操作的最终完成（或失败）及其结果值。Promise有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。

Promise的基本用法：
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  const success = true;
  if (success) {
    resolve('操作成功');
  } else {
    reject('操作失败');
  }
});

promise
  .then(result => {
    console.log(result); // 操作成功
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
\`\`\`

Promise链：
\`\`\`javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return processData(data);
  })
  .then(processedData => {
    console.log(processedData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
\`\`\`

Promise.all和Promise.race：
\`\`\`javascript
// 所有Promise都完成时才完成
Promise.all([
  fetch('https://api.example.com/data1').then(r => r.json()),
  fetch('https://api.example.com/data2').then(r => r.json()),
  fetch('https://api.example.com/data3').then(r => r.json())
])
.then(([data1, data2, data3]) => {
  console.log(data1, data2, data3);
})
.catch(error => {
  console.error('At least one request failed', error);
});

// 任何一个Promise完成就完成
Promise.race([
  fetch('https://api.example.com/data1').then(r => r.json()),
  fetch('https://api.example.com/data2').then(r => r.json())
])
.then(firstData => {
  console.log('First to complete:', firstData);
});
\`\`\`

Async/Await（基于Promise的语法糖）：
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();
\`\`\`

Promise的优势：
- 链式调用，避免回调地狱
- 更好的错误处理
- 支持并行操作
- 与async/await结合使用更加优雅`,
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
          answer: `一个成功的产品经理应该能够清晰地描述产品开发的完整流程，从市场调研、需求分析、产品规划到最终发布。

优秀答案应包含：
1. 明确的产品背景和目标
2. 数据驱动的决策过程
3. 跨团队协作的具体案例
4. 遇到的挑战及解决方案
5. 产品发布后的效果评估
6. 个人在过程中的具体贡献

回答这个问题时，应该使用STAR法则（情境-任务-行动-结果）来结构化你的回答，确保逻辑清晰，重点突出。`,
          keywords: ['产品开发', '跨团队协作', '数据驱动', '项目管理', 'STAR法则']
        },
        {
          id: 202,
          question: '描述一次你需要在有限资源下做出产品优先级决策的情况。你是如何做决策的？',
          answer: `资源有限是产品经理常见的挑战，优秀的产品经理能够建立清晰的优先级框架。

优秀答案应包含：
1. 使用的优先级框架（如RICE模型：Reach影响范围、Impact影响程度、Confidence信心度、Effort工作量）
2. 如何收集和分析数据来支持决策
3. 与利益相关者的沟通过程
4. 如何处理不同团队的期望和压力
5. 决策结果及其影响

具体例子：
"在X项目中，我们面临时间和开发资源有限的情况，需要决定哪些功能进入首个版本。我使用RICE模型对所有功能进行评分，并结合用户调研数据和业务目标，最终确定了核心功能集。虽然这意味着推迟了一些团队成员期待的功能，但我通过数据支持的透明决策过程获得了团队的理解和支持。首个版本发布后，我们的核心指标提升了30%，验证了这一决策的正确性。"`,
          keywords: ['优先级', 'RICE模型', '资源分配', '数据分析', '决策框架']
        },
        {
          id: 203,
          question: '请分享一次你与工程团队有分歧的经历，以及你是如何解决的。',
          answer: `产品经理与工程团队的合作至关重要，处理分歧的能力直接影响产品开发效率。

优秀答案应包含：
1. 分歧的具体内容和背景
2. 你如何理解工程团队的顾虑
3. 沟通策略和方法
4. 如何找到平衡点或妥协方案
5. 最终解决方案及其结果
6. 从这次经历中学到的经验

回答示例：
"在开发X功能时，工程团队认为我提出的实现方案技术难度大且时间紧张。首先，我安排了一次非正式会议，真诚地听取他们的顾虑。然后，我邀请设计师和工程师一起进行头脑风暴，寻找替代方案。我们最终达成了一个分阶段实现的方案：先实现核心功能满足用户基本需求，后续迭代中再逐步完善。这个过程中，我学会了在产品愿景和技术现实之间寻找平衡，并且意识到提前让工程团队参与产品规划的重要性。"`,
          keywords: ['跨团队协作', '冲突解决', '沟通技巧', '妥协', '团队合作']
        },
        {
          id: 204,
          question: '你如何收集和分析用户反馈来改进产品？请举一个具体例子。',
          answer: `用户反馈是产品迭代的重要依据，优秀的产品经理应该有系统化的方法收集和分析用户反馈。

优秀答案应包含：
1. 多渠道的用户反馈收集方法
2. 定性和定量分析相结合
3. 如何区分用户"想要的"和"需要的"
4. 如何将反馈转化为可执行的产品改进
5. 如何验证改进的效果

回答示例：
"在负责X产品时，我建立了多渠道的用户反馈系统：应用内反馈、用户访谈、使用数据分析和NPS调查。我发现用户在完成核心流程时遇到了困难，但直接询问时他们往往难以准确描述问题。

我采用了用户行为录制工具，分析了100个用户会话，识别出关键卡点。同时，我进行了10次深度用户访谈，了解用户的真实需求和痛点。

基于这些发现，我提出了界面简化方案，并通过A/B测试验证。新版本将流程步骤从6步减少到4步，完成率提升了35%，用户满意度提高了20%。这个过程教会我，有效的用户反馈分析需要结合定量数据和定性研究，并且要关注用户行为而非仅仅是用户说的话。"`,
          keywords: ['用户反馈', '数据分析', '用户研究', 'A/B测试', '产品迭代']
        },
        {
          id: 205,
          question: '请描述你如何与设计师合作，确保产品既满足用户需求又具有良好的用户体验。',
          answer: `产品经理与设计师的良好合作是创造优秀产品体验的关键。

优秀答案应包含：
1. 如何在产品需求阶段就让设计师参与
2. 如何清晰地传达产品目标和用户需求
3. 如何平衡业务目标和用户体验
4. 如何处理设计评审和反馈
5. 如何支持设计师的创意同时确保产品方向一致

回答示例：
"我认为与设计师的合作应该从产品构思阶段就开始，而不是简单地提出需求后等待设计稿。在X项目中，我邀请设计师参与了用户研究和需求分析的全过程。

我会通过用户旅程图和用户故事清晰地传达产品目标和用户痛点，而不是直接规定UI解决方案。我们建立了每周设计评审会议，团队成员可以基于用户目标和业务目标给出建设性反馈。

当设计与业务目标出现冲突时，我会协助设计师理解业务约束，同时也会向其他利益相关者解释良好用户体验的长期价值。例如，在简化注册流程的项目中，我们通过用户测试数据证明了简化后的设计不仅提升了用户体验，还提高了转化率，最终说服了市场团队接受这一变更。

我认为成功的产品经理应该是设计师的合作伙伴而非指挥官，我的角色是确保设计方向与产品愿景一致，同时给予设计师足够的创意空间。"`,
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
          answer: `设计Twitter类系统需要考虑高并发、大数据量和实时性等挑战。

**1. 系统需求分析**
- 发布和查看推文
- 关注其他用户
- 时间线展示
- 搜索功能
- 通知系统

**2. 架构设计**

**前端**:
- Web应用 (React/Vue)
- 移动应用 (iOS/Android)

**后端**:
- API网关层: 负责请求路由、认证、限流
- 应用服务层: 微服务架构
  - 用户服务: 处理用户注册、认证、资料
  - 推文服务: 处理推文的创建、读取
  - 关注服务: 处理用户关系
  - 时间线服务: 生成用户时间线
  - 搜索服务: 提供搜索功能
  - 通知服务: 处理实时通知

**数据存储**:
- 关系型数据库 (MySQL/PostgreSQL): 用户数据、关系数据
- NoSQL数据库 (MongoDB): 推文内容
- 缓存 (Redis): 热门推文、用户时间线
- 搜索引擎 (Elasticsearch): 推文搜索
- 消息队列 (Kafka): 事件处理、数据流

**3. 数据模型**

**用户表**:
\`\`\`sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  profile_image_url VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
\`\`\`

**推文表**:
\`\`\`sql
CREATE TABLE tweets (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  content TEXT,
  media_urls JSON,
  created_at TIMESTAMP,
  likes_count INT DEFAULT 0,
  retweets_count INT DEFAULT 0,
  replies_count INT DEFAULT 0
);
\`\`\`

**关注关系表**:
\`\`\`sql
CREATE TABLE follows (
  follower_id BIGINT REFERENCES users(id),
  followee_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id)
);
\`\`\`

**4. 关键技术挑战与解决方案**

**时间线生成**:
- 问题: 如何高效生成用户时间线
- 解决方案: 采用推拉结合模式
  - 推模式: 当用户发推文时，将推文ID推送到所有粉丝的时间线缓存中
  - 拉模式: 对于粉丝数量特别多的用户，采用拉模式，在用户查看时间线时才获取

**读写分离与分片**:
- 使用主从复制实现读写分离
- 按用户ID对数据进行水平分片

**缓存策略**:
- 热门推文和活跃用户的时间线缓存
- 使用Redis实现计数器(点赞、转发数)

**搜索优化**:
- 使用Elasticsearch建立推文索引
- 实现实时搜索和趋势话题分析

**5. 扩展性考虑**

**水平扩展**:
- 无状态服务便于水平扩展
- 数据分片策略随用户增长调整

**CDN**:
- 使用CDN分发静态资源和媒体文件

**全球化部署**:
- 多区域部署减少延迟
- 数据同步和一致性策略

**6. 监控与可靠性**

**监控指标**:
- 服务响应时间
- 错误率
- 系统资源使用率
- 用户活跃度

**故障恢复**:
- 服务降级策略
- 数据备份与恢复方案

这个设计方案考虑了Twitter类系统的核心功能和技术挑战，采用了微服务架构和多种数据存储技术来满足高并发、大数据量和实时性的需求。`,
          keywords: ['微服务', '数据分片', '缓存策略', '读写分离', '推拉模型', '水平扩展']
        },
        {
          id: 302,
          question: '设计一个分布式文件存储系统，类似Google Drive或Dropbox。',
          answer: `设计分布式文件存储系统需要考虑数据一致性、可靠性、性能和安全性等多方面因素。

**1. 系统需求**
- 文件上传、下载、删除和共享
- 文件版本控制
- 多设备同步
- 访问控制和权限管理
- 高可用性和数据持久性

**2. 系统架构**

**客户端**:
- Web客户端
- 桌面客户端(Windows/Mac/Linux)
- 移动客户端(iOS/Android)

**服务端**:
- API网关: 请求路由、认证、限流
- 元数据服务: 管理文件元数据(路径、大小、类型等)
- 存储服务: 管理实际文件内容
- 同步服务: 处理文件变更和冲突解决
- 认证授权服务: 用户认证和权限控制
- 通知服务: 推送文件变更通知

**存储层**:
- 元数据存储: 关系型数据库(PostgreSQL)
- 文件内容存储: 对象存储(S3兼容)
- 缓存层: Redis集群
- 消息队列: Kafka

**3. 关键技术设计**

**文件存储策略**:
- 文件分块: 将大文件分割成固定大小的块(如4MB)
- 内容寻址存储: 使用文件内容哈希作为标识符
- 重复数据删除: 相同内容的文件只存储一次
- 增量同步: 只传输变更的文件块

**元数据设计**:
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  storage_quota BIGINT,
  used_storage BIGINT
);

CREATE TABLE files (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  parent_id UUID REFERENCES folders(id),
  owner_id UUID REFERENCES users(id),
  size BIGINT,
  content_hash VARCHAR(64),
  mime_type VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE file_versions (
  id UUID PRIMARY KEY,
  file_id UUID REFERENCES files(id),
  content_hash VARCHAR(64),
  size BIGINT,
  created_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

CREATE TABLE file_blocks (
  content_hash VARCHAR(64),
  block_index INT,
  block_hash VARCHAR(64),
  PRIMARY KEY (content_hash, block_index)
);

CREATE TABLE shares (
  id UUID PRIMARY KEY,
  file_id UUID REFERENCES files(id),
  user_id UUID REFERENCES users(id),
  permission VARCHAR(20),
  created_at TIMESTAMP
);
\`\`\`

**同步机制**:
- 长轮询或WebSocket实现实时通知
- 版本向量(Vector Clock)处理并发修改
- 冲突检测与自动解决策略

**安全设计**:
- 端到端加密
- 传输层安全(TLS)
- 细粒度的访问控制
- 文件加密密钥管理

**4. 扩展性设计**

**水平扩展**:
- 元数据服务分片: 按用户ID或文件路径前缀
- 存储节点扩展: 一致性哈希分配文件块

**缓存策略**:
- 热门文件元数据缓存
- 文件内容块缓存
- 用户权限缓存

**负载均衡**:
- API网关层负载均衡
- 存储节点间负载均衡

**5. 可靠性设计**

**数据冗余**:
- 文件块多副本存储(至少3副本)
- 地理分布式复制

**故障检测与恢复**:
- 心跳机制检测节点健康
- 自动故障转移
- 数据修复机制

**备份策略**:
- 定期全量备份
- 连续增量备份
- 时间点恢复能力

**6. 性能优化**

**上传优化**:
- 客户端计算文件哈希，避免上传重复内容
- 并行上传多个文件块
- 断点续传

**下载优化**:
- CDN分发热门文件
- 预读取策略
- 智能缓存

**7. 监控与运维**

**关键指标**:
- 存储使用率
- 文件操作延迟
- 同步成功率
- 系统可用性

**日志与审计**:
- 详细的操作日志
- 访问审计
- 异常行为检测

这个设计方案考虑了分布式文件存储系统的核心需求和技术挑战，采用了现代云原生架构和最佳实践，可以支持高可用、高性能的文件存储服务。`,
          keywords: ['分布式存储', '文件分块', '元数据管理', '同步机制', '冗余备份', '内容寻址']
        },
        {
          id: 303,
          question: '设计一个高并发的电子商务网站的后端系统。',
          answer: `设计高并发电商系统需要考虑可扩展性、可用性、一致性和性能等多方面因素。

**1. 系统需求**
- 商品浏览和搜索
- 用户账户管理
- 购物车功能
- 订单处理
- 支付集成
- 库存管理
- 促销和优惠券

**2. 系统架构**

**前端**:
- Web前端 (React/Vue)
- 移动应用 (iOS/Android)

**后端**:
- API网关: 请求路由、认证、限流、缓存
- 微服务集群:
  - 用户服务: 账户管理、认证
  - 商品服务: 商品信息、分类、搜索
  - 购物车服务: 购物车管理
  - 订单服务: 订单创建和管理
  - 支付服务: 支付处理和集成
  - 库存服务: 库存管理和预留
  - 促销服务: 优惠券和促销规则
  - 搜索服务: 商品搜索和推荐
  - 通知服务: 邮件、短信、推送

**数据层**:
- 关系型数据库 (MySQL集群): 用户、订单、支付等事务性数据
- NoSQL数据库 (MongoDB): 商品信息、用户行为等
- 搜索引擎 (Elasticsearch): 商品搜索
- 缓存 (Redis): 商品信息、用户会话、购物车
- 消息队列 (Kafka): 服务间通信、事件驱动

**3. 数据模型设计**

**用户相关**:
\`\`\`sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE addresses (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  name VARCHAR(100),
  phone VARCHAR(20),
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  detail VARCHAR(255),
  is_default BOOLEAN
);
\`\`\`

**商品相关**:
\`\`\`sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  category_id BIGINT,
  brand_id BIGINT,
  status VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE product_inventory (
  product_id BIGINT PRIMARY KEY,
  quantity INT,
  reserved_quantity INT,
  updated_at TIMESTAMP
);
\`\`\`

**订单相关**:
\`\`\`sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  status VARCHAR(20),
  total_amount DECIMAL(10,2),
  address_id BIGINT REFERENCES addresses(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  product_id BIGINT REFERENCES products(id),
  quantity INT,
  price DECIMAL(10,2)
);

CREATE TABLE payments (
  id BIGINT PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  status VARCHAR(20),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP
);
\`\`\`

**4. 高并发解决方案**

**读写分离**:
- 主库负责写操作
- 多个从库负责读操作
- 使用中间件自动路由读写请求

**数据分片**:
- 按用户ID分片用户数据
- 按商品ID分片商品数据
- 按订单ID分片订单数据

**缓存策略**:
- 多级缓存: 本地缓存 + 分布式缓存
- 热点商品缓存
- 用户会话缓存
- 购物车缓存

**库存管理**:
- 预扣库存机制
- 库存缓存与定时同步
- 分布式锁防止超卖

**5. 秒杀与高峰应对**

**秒杀系统**:
- 独立部署的秒杀服务
- 商品页面静态化
- 请求入队列，异步处理
- 限流和熔断机制

**流量削峰**:
- 排队机制
- 令牌桶限流
- CDN分发静态资源

**6. 事务与一致性**

**分布式事务**:
- Saga模式: 补偿事务
- 最终一致性
- 事件溯源

**订单状态机**:
- 明确的状态转换
- 幂等操作
- 失败重试机制

**7. 安全性设计**

**支付安全**:
- 支付信息加密
- 防重复提交
- 风控系统

**数据安全**:
- 敏感数据加密
- 权限细粒度控制
- 操作审计日志

**8. 监控与可观测性**

**监控指标**:
- 服务响应时间
- 错误率
- 吞吐量
- 资源使用率

**链路追踪**:
- 分布式追踪系统
- 请求ID贯穿全链路
- 性能瓶颈分析

**9. 部署与扩展**

**容器化部署**:
- Kubernetes编排
- 自动扩缩容
- 蓝绿部署

**多区域部署**:
- 就近接入
- 数据同步策略
- 灾备方案

这个设计方案考虑了高并发电商系统的核心需求和技术挑战，采用了微服务架构、数据分片、多级缓存等技术来应对高并发场景，同时保证了系统的可靠性和一致性。`,
          keywords: ['微服务', '读写分离', '数据分片', '缓存策略', '秒杀系统', '分布式事务']
        },
        {
          id: 304,
          question: '设计一个实时聊天系统，支持单聊和群聊功能。',
          answer: `设计实时聊天系统需要考虑实时性、可靠性、扩展性和消息一致性等多方面因素。

**1. 系统需求**
- 一对一聊天
- 群组聊天
- 消息实时推送
- 消息历史记录
- 在线状态显示
- 已读回执
- 多设备同步
- 媒体文件传输

**2. 系统架构**

**客户端**:
- Web客户端 (React/Vue)
- 移动客户端 (iOS/Android)
- 桌面客户端 (Electron)

**服务端**:
- 接入层: WebSocket服务器集群
- 业务层:
  - 用户服务: 用户管理、认证
  - 消息服务: 消息处理和路由
  - 群组服务: 群组管理
  - 通知服务: 推送通知
  - 存储服务: 消息持久化
  - 状态服务: 在线状态管理

**数据层**:
- 关系型数据库 (PostgreSQL): 用户信息、群组信息
- NoSQL数据库 (MongoDB): 消息历史
- 缓存 (Redis): 在线状态、最近消息
- 消息队列 (Kafka): 消息分发
- 对象存储 (S3): 媒体文件

**3. 关键技术设计**

**实时通信**:
- WebSocket长连接
- 心跳机制保持连接
- 断线重连策略
- 消息ACK机制

**消息流设计**:
\`\`\`
客户端A -> 接入服务器 -> 消息服务 -> Kafka -> 消息分发服务 -> 接入服务器 -> 客户端B
\`\`\`

**数据模型**:
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  avatar_url VARCHAR(255),
  status VARCHAR(20),
  last_active TIMESTAMP
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  type VARCHAR(10), -- 'single' or 'group'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE conversation_members (
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(20), -- 'admin', 'member'
  joined_at TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  content_type VARCHAR(20), -- 'text', 'image', 'video', etc.
  sent_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE message_receipts (
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES users(id),
  is_delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  PRIMARY KEY (message_id, user_id)
);
\`\`\`

**4. 扩展性设计**

**水平扩展**:
- WebSocket服务器集群，使用负载均衡
- 消息服务分片，按会话ID路由

**消息分发优化**:
- 发布-订阅模式
- 消息批处理

**多设备同步**:
- 消息ID和时间戳确保顺序
- 增量同步机制
- 设备间状态同步

**5. 可靠性设计**

**消息可靠性**:
- 消息持久化
- 消息重传机制
- 幂等处理避免重复

**高可用性**:
- 服务冗余部署
- 自动故障转移
- 区域级容灾

**6. 性能优化**

**连接优化**:
- 连接池管理
- 长轮询降级方案
- 连接多路复用

**消息优化**:
- 消息压缩
- 批量获取历史消息
- 增量更新

**7. 特殊功能实现**

**已读回执**:
- 客户端发送已读确认
- 服务端更新消息状态
- 向发送者推送已读通知

**在线状态**:
- 心跳包更新状态
- Redis存储在线状态
- 状态变更广播

**群聊优化**:
- 大群消息扇出优化
- 消息分页加载
- 群成员缓存

**8. 安全性设计**

**消息加密**:
- 端到端加密
- 传输层加密(TLS)

**认证与授权**:
- JWT认证
- 细粒度权限控制

**防护措施**:
- 消息频率限制
- 内容审核
- 防盗号机制

**9. 监控与运维**

**关键指标**:
- 消息延迟
- 连接数
- 消息吞吐量
- 错误率

**日志与分析**:
- 分布式日志收集
- 实时监控告警
- 性能瓶颈分析

这个设计方案考虑了实时聊天系统的核心需求和技术挑战，采用了WebSocket长连接、消息队列、多级存储等技术来实现高性能、高可靠的聊天功能。`,
          keywords: ['WebSocket', '消息队列', '实时推送', '状态同步', '端到端加密', '水平扩展']
        },
        {
          id: 305,
          question: '设计一个视频流媒体服务，如YouTube或Netflix。',
          answer: `设计视频流媒体服务需要考虑内容存储、转码、分发和用户体验等多方面因素。

**1. 系统需求**
- 视频上传和存储
- 视频转码和处理
- 视频流式传输
- 用户账户和订阅
- 内容推荐
- 搜索功能
- 评论和互动
- 内容管理和审核

**2. 系统架构**

**客户端**:
- Web客户端
- 移动应用
- 智能电视应用

**后端服务**:
- API网关: 请求路由、认证、限流
- 用户服务: 账户管理、认证、订阅
- 内容服务: 视频元数据管理
- 上传服务: 处理视频上传
- 转码服务: 视频格式转换和质量适配
- 流媒体服务: 视频流传输
- 推荐服务: 内容个性化推荐
- 搜索服务: 视频搜索
- 互动服务: 评论、点赞、分享
- 分析服务: 用户行为分析

**存储层**:
- 对象存储: 原始视频文件和转码后的视频
- CDN: 视频内容分发
- 关系型数据库: 用户数据、视频元数据
- NoSQL数据库: 用户行为、推荐数据
- 搜索引擎: 视频搜索索引
- 缓存: 热门视频元数据、用户会话

**3. 视频处理流程**

**上传流程**:
1. 用户上传视频
2. 上传服务接收并存储原始文件
3. 触发转码任务
4. 转码服务将视频转换为多种格式和质量
5. 转码完成后更新视频状态
6. 将转码后的视频分发到CDN

**转码策略**:
- 自适应比特率流(ABR): 同一视频多种质量(240p, 360p, 480p, 720p, 1080p, 4K)
- 多格式支持: HLS, DASH, MP4
- 支持不同设备: 移动设备、桌面、智能电视

**4. 内容分发网络(CDN)**

**全球分发**:
- 多区域CDN节点
- 就近访问原则
- 边缘缓存策略

**智能路由**:
- 基于用户地理位置
- 基于网络质量
- 负载均衡

**5. 流媒体技术**

**协议选择**:
- HLS (HTTP Live Streaming): iOS设备和大多数浏览器
- DASH (Dynamic Adaptive Streaming over HTTP): Android和现代浏览器
- RTMP/RTSP: 低延迟直播场景

**自适应流**:
- 根据网络条件动态调整视频质量
- 缓冲策略优化
- 预加载机制

**6. 数据模型**

**视频元数据**:
\`\`\`sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  creator_id UUID REFERENCES users(id),
  duration INT, -- in seconds
  category VARCHAR(50),
  tags TEXT[],
  visibility VARCHAR(20), -- public, private, unlisted
  upload_status VARCHAR(20),
  created_at TIMESTAMP,
  published_at TIMESTAMP,
  view_count BIGINT DEFAULT 0,
  like_count INT DEFAULT 0,
  dislike_count INT DEFAULT 0
);

CREATE TABLE video_assets (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  quality VARCHAR(10), -- 240p, 360p, 480p, 720p, 1080p, 4K
  format VARCHAR(10), -- HLS, DASH, MP4
  file_size BIGINT,
  url VARCHAR(255),
  created_at TIMESTAMP
);
\`\`\`

**用户互动**:
\`\`\`sql
CREATE TABLE video_views (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  user_id UUID REFERENCES users(id),
  watched_duration INT, -- in seconds
  watched_percentage FLOAT,
  device_type VARCHAR(50),
  ip_address VARCHAR(45),
  viewed_at TIMESTAMP
);

CREATE TABLE comments (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  user_id UUID REFERENCES users(id),
  content TEXT,
  parent_id UUID REFERENCES comments(id), -- for replies
  created_at TIMESTAMP,
  like_count INT DEFAULT 0
);
\`\`\`

**7. 推荐系统**

**数据收集**:
- 观看历史
- 点赞和评论
- 完成率
- 搜索历史
- 用户画像

**推荐算法**:
- 协同过滤
- 内容基于推荐
- 深度学习模型
- 实时个性化

**8. 扩展性设计**

**视频存储扩展**:
- 分布式对象存储
- 冷热数据分离

**转码服务扩展**:
- 弹性转码集群
- 任务优先级队列

**流量应对**:
- 多层缓存
- 流量预测和资源预留

**9. 监控与分析**

**用户体验监控**:
- 缓冲率
- 启动时间
- 播放错误率
- 切换质量频率

**系统监控**:
- CDN性能
- 转码队列长度
- 存储使用率
- API响应时间

**10. 安全性设计**

**内容保护**:
- DRM (数字版权管理)
- 视频水印
- 防盗链措施

**用户安全**:
- 内容过滤和审核
- 版权检测
- 隐私保护

这个设计方案考虑了视频流媒体服务的核心需求和技术挑战，采用了分布式架构、CDN内容分发、自适应流媒体等技术来实现高性能、高可用的视频服务。`,
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
          answer: `处理团队成员冲突是管理者的重要职责，尤其是当冲突发生在核心成员之间时，可能会影响整个团队的氛围和效率。

**处理步骤**:

**1. 了解情况**
- 与双方分别进行一对一谈话
- 客观收集事实，避免主观判断
- 了解冲突的根本原因（工作方式差异、沟通不畅、资源竞争等）
- 评估冲突对团队的影响程度

**2. 促进沟通**
- 安排适当的时间和私密空间
- 设定明确的会谈目标和规则
- 鼓励双方表达感受和观点
- 使用"我"陈述而非指责性语言
- 确保双方都有平等的发言机会

**3. 寻找共识**
- 引导双方关注共同目标
- 识别双方的共同点
- 讨论不同观点背后的价值和关切
- 寻找双方都能接受的解决方案

**4. 制定行动计划**
- 明确具体的改进措施
- 设定清晰的期望和界限
- 建立定期检查机制
- 必要时调整工作安排或责任分配

**5. 后续跟进**
- 定期检查情况改善程度
- 及时给予积极反馈
- 必要时进行调整

**管理原则**:

- **保持中立**: 不偏袒任何一方
- **聚焦问题而非人**: 将讨论重点放在行为和影响上
- **尊重隐私**: 避免在团队中公开讨论冲突
- **树立榜样**: 展示健康的冲突解决方式
- **预防胜于解决**: 建立开放的沟通文化

**情境示例**:

"在我管理的开发团队中，技术负责人和产品负责人在项目优先级上产生了严重分歧。技术负责人坚持先解决技术债务，而产品负责人则强调新功能的市场时机。

我首先与双方分别交谈，了解各自的顾虑。然后安排了一次三方会议，设定了明确的议程：理解彼此的优先事项，找出共同目标，制定平衡的解决方案。

在会议中，我引导双方认识到我们的共同目标是产品的长期成功。通过讨论，我们达成了折中方案：将技术债务工作分解为小块，穿插在新功能开发中，并建立了明确的技术健康度指标。

我们还建立了每周的技术-产品同步会议，提前讨论可能的冲突点。三个月后，这种方式不仅解决了当前冲突，还显著改善了技术和产品团队的协作关系。"`,
          keywords: ['冲突管理', '沟通技巧', '团队协作', '问题解决', '领导力']
        },
        {
          id: 402,
          question: '你如何激励一个士气低落的团队？',
          answer: `激励士气低落的团队是管理者面临的常见挑战，需要综合运用多种策略来重建团队信心和动力。

**诊断阶段**:

**1. 了解根本原因**
- 进行一对一谈话和团队匿名调查
- 识别士气低落的具体原因：
  - 工作压力过大
  - 缺乏认可和成就感
  - 职业发展受限
  - 团队内部冲突
  - 目标不明确或不认同
  - 工作环境问题
  - 组织变革带来的不确定性

**2. 评估团队状态**
- 团队凝聚力
- 工作满意度
- 成员参与度
- 信任水平

**解决策略**:

**1. 重建目标和意义**
- 明确团队使命和愿景
- 将团队工作与更大的组织目标联系起来
- 强调工作的意义和影响
- 设定可实现的短期目标，创造"小胜利"

**2. 改善沟通**
- 增加透明度，分享公司信息
- 建立定期的团队会议和反馈机制
- 创造开放的沟通环境
- 积极倾听团队成员的意见和建议

**3. 认可和奖励**
- 公开表彰团队和个人成就
- 建立正式和非正式的认可机制
- 确保奖励公平且有意义
- 个性化认可（了解每个人的偏好）

**4. 职业发展**
- 提供学习和成长机会
- 制定个人发展计划
- 指导和辅导
- 创造内部晋升和轮岗机会

**5. 团队建设**
- 组织团队建设活动
- 促进团队成员之间的联系
- 庆祝团队成就和里程碑
- 创造共同经历

**6. 工作环境改善**
- 解决工作场所的物理问题
- 优化工作流程和减少障碍
- 提供必要的资源和工具
- 平衡工作负载

**7. 以身作则**
- 展示积极的态度
- 保持高能量和热情
- 分享个人挑战和克服方法
- 实践你所宣扬的价值观

**实施计划**:

**短期行动** (1-2周)
- 召开团队会议，坦诚讨论现状
- 设定2-3个可立即实现的小目标
- 解决最紧迫的环境或资源问题
- 开始一对一谈话

**中期行动** (1-3个月)
- 实施认可和奖励计划
- 组织团队建设活动
- 开始改进工作流程
- 提供培训和发展机会

**长期行动** (3-6个月)
- 重新定义团队使命和目标
- 建立持续的职业发展路径
- 创建可持续的团队文化
- 定期评估进展和调整策略

**情境示例**:

"我曾接手一个因连续项目失败而士气低落的开发团队。通过一对一谈话，我发现团队成员感到他们的努力没有得到认可，技术债务积累严重，且对产品方向缺乏信心。

我首先解决了最紧迫的技术债务问题，给团队创造了"喘息空间"。然后，我们一起重新定义了团队的技术愿景，并将大目标分解为可管理的小任务。

我引入了每周的"胜利时刻"，庆祝团队的进步和成就，无论大小。同时，我与产品团队合作，确保开发团队早期参与产品决策，增强他们的主人翁意识。

我还为每位团队成员创建了个性化的成长计划，包括技术培训和领导力发展机会。三个月后，团队完成了一个关键项目，比预期提前一周，质量超出预期。六个月后，这个曾经士气低落的团队成为了公司内部最受欢迎的团队之一，团队成员满意度提高了40%。"`,
          keywords: ['团队激励', '士气管理', '沟通策略', '团队建设', '认可机制', '职业发展']
        },
        {
          id: 403,
          question: '如何有效地进行团队绩效管理？',
          answer: `有效的团队绩效管理是组织成功的关键，它需要系统化的方法来设定目标、监控进展、提供反馈并持续改进。

**1. 建立明确的绩效管理框架**

**目标设定**:
- 使用SMART原则(具体、可衡量、可实现、相关、有时限)
- 将团队目标与组织目标对齐
- 确保团队成员理解并认同目标
- 平衡定量和定性目标

**关键绩效指标(KPI)**:
- 为团队设定3-7个核心KPI
- 确保KPI能真实反映团队价值
- 包括结果指标和过程指标
- 定期审查KPI的相关性

**2. 持续反馈与沟通**

**定期检查**:
- 每周团队进度会议
- 每月绩效回顾
- 季度目标调整
- 年度绩效评估

**多渠道反馈**:
- 管理者反馈
- 同事反馈
- 自我评估
- 客户/利益相关者反馈

**有效反馈原则**:
- 及时性: 尽快提供反馈
- 具体性: 针对具体行为而非人格
- 平衡性: 既指出优点也指出改进空间
- 发展性: 关注未来改进而非过去错误

**3. 个人发展与团队成长**

**个人发展计划**:
- 识别每个成员的优势和发展空间
- 制定个性化的发展目标
- 提供必要的资源和支持
- 定期跟进进展

**团队能力建设**:
- 识别团队整体的能力差距
- 组织团队培训和学习活动
- 鼓励知识分享和最佳实践交流
- 建立学习型团队文化

**4. 绩效问题处理**

**识别绩效问题**:
- 定期数据分析
- 观察行为变化
- 收集多方反馈

**干预策略**:
- 及时沟通和澄清期望
- 提供必要的支持和资源
- 制定具体的改进计划
- 设定明确的跟进时间点

**绩效改进计划**:
- 明确改进目标
- 具体行动步骤
- 必要的支持措施
- 明确的时间表和评估标准

**5. 认可与奖励**

**认可原则**:
- 及时性: 尽快认可成就
- 具体性: 明确指出贡献
- 公开性: 在适当场合公开表彰
- 真实性: 真诚而非敷衍

**奖励机制**:
- 财务奖励: 绩效奖金、加薪
- 非财务奖励: 表彰、额外休假、发展机会
- 团队奖励: 团队活动、共同庆祝
- 个性化奖励: 基于个人偏好

**6. 工具与技术支持**

**绩效管理系统**:
- 目标跟踪工具
- 反馈收集平台
- 数据分析仪表板
- 一对一会议记录工具

**数据驱动决策**:
- 收集相关绩效数据
- 分析趋势和模式
- 基于数据调整策略
- 透明地分享数据

**7. 文化与环境**

**绩效文化建设**:
- 强调持续改进而非惩罚
- 鼓励诚实和透明
- 庆祝成功和学习
- 容许适当的失败和创新

**心理安全**:
- 创造开放表达的环境
- 鼓励建设性反馈
- 将错误视为学习机会
- 重视每个人的贡献

**8. 实施案例**

"在我管理的软件开发团队中，我实施了一套综合的绩效管理系统。首先，我们在季度初通过协作方式设定团队OKRs，确保每个人都理解并认同这些目标。

我们建立了每周的团队站会和每月的绩效回顾会议。在月度会议中，我们不仅回顾KPI达成情况，还讨论工作中的挑战和学习。

对于每个团队成员，我们制定了个性化的发展计划，包括技术培训和软技能提升。我每两周与每位成员进行一次一对一会谈，提供具体反馈并讨论发展进展。

当团队中出现绩效问题时，我会及时干预，通过明确期望、提供必要支持和制定具体改进计划来帮助成员重回正轨。

我们还建立了多层次的认可机制，包括每周的'明星贡献者'表彰、季度绩效奖金和年度团队旅行。

这套系统帮助我们在一年内将团队生产力提高了30%，员工满意度提升了25%，同时团队流失率降低了15%。"`,
          keywords: ['绩效管理', 'KPI', 'SMART目标', '反馈机制', '个人发展', '团队文化']
        },
        {
          id: 404,
          question: '作为团队领导，你如何处理一个表现不佳的团队成员？',
          answer: `处理表现不佳的团队成员是管理者面临的常见挑战，需要平衡团队效率、个人发展和组织文化。

**1. 识别和分析问题**

**问题识别**:
- 收集具体的绩效数据和行为观察
- 区分偶发性问题和持续性问题
- 确认问题的严重程度和影响范围

**根因分析**:
- 技能不足: 缺乏必要的技能或知识
- 动机问题: 缺乏工作积极性或投入
- 沟通障碍: 误解期望或要求
- 个人因素: 健康、家庭或其他个人问题
- 环境因素: 工作环境、团队动态或资源限制
- 角色匹配: 职位与个人能力和兴趣不匹配

**2. 初步干预**

**一对一沟通**:
- 选择私密、不受干扰的环境
- 以关心和支持的态度开始对话
- 具体描述观察到的行为和影响
- 避免指责性语言，使用"我"陈述
- 积极倾听员工的观点和解释

**明确期望**:
- 重申岗位职责和绩效标准
- 确保员工理解期望
- 讨论当前表现与期望的差距

**3. 制定改进计划**

**共同制定计划**:
- 设定具体、可衡量的改进目标
- 确定明确的时间表和里程碑
- 列出具体的行动步骤
- 明确成功的标准

**提供必要支持**:
- 培训和技能发展
- 指导和辅导
- 调整工作环境或资源
- 必要时提供个人支持（如EAP服务）

**4. 持续跟进**

**定期检查**:
- 安排定期的一对一会议
- 提供及时、具体的反馈
- 认可进步和改进
- 根据需要调整计划

**文档记录**:
- 记录所有会议和讨论
- 记录绩效问题和改进情况
- 记录提供的支持和资源

**5. 评估结果**

**改进情况**:
- 评估是否达到设定的目标
- 比较当前表现与基准表现
- 收集团队反馈

**决策点**:
- 如果表现改善: 继续支持和强化
- 如果有部分改善: 调整计划并继续
- 如果没有改善: 考虑更严肃的干预

**6. 进一步行动**

**如果表现改善**:
- 认可和庆祝进步
- 继续提供支持和反馈
- 考虑新的发展机会

**如果表现未改善**:
- 重新评估根本原因
- 考虑角色调整或重新分配
- 启动正式的绩效改进计划(PIP)
- 必要时考虑终止雇佣关系（遵循HR流程）

**7. 预防策略**

**招聘和入职**:
- 改进招聘流程，确保角色匹配
- 完善入职培训
- 设定明确的早期期望

**团队文化**:
- 建立持续反馈文化
- 鼓励开放沟通
- 定期进行团队健康检查

**8. 案例分析**

"在我管理的开发团队中，一位资深开发者开始出现代码质量下降、错过截止日期的情况。我安排了一次私下会谈，以关心的态度表达了我的观察，并询问是否有我可以提供帮助的地方。

通过对话，我了解到他正在适应新的技术栈，同时也面临家庭压力。我们共同制定了一个90天的改进计划，包括：
1. 安排他与团队技术专家进行每周一次的指导会议
2. 临时减轻他的工作量，让他有时间学习新技术
3. 提供更灵活的工作安排，帮助他平衡工作和家庭需求
4. 设定每周检查点，评估进展

在接下来的几周里，我看到了稳步改善。代码质量提高了，截止日期也开始按时完成。两个月后，他的表现恢复到了以前的水平，甚至在新技术方面成为了团队的资源。

这次经历教会我，表现问题通常有多种因素，而不仅仅是动机或能力问题。通过同理心、明确的期望和适当的支持，大多数表现问题都可以得到有效解决。"`,
          keywords: ['绩效管理', '根因分析', '改进计划', '反馈机制', '支持策略', '团队领导']
        },
        {
          id: 405,
          question: '如何在团队中推动创新文化？',
          answer: `在团队中推动创新文化需要系统性的方法，包括建立正确的环境、流程和激励机制。

**1. 创建心理安全的环境**

**建立心理安全**:
- 鼓励开放表达想法和意见
- 将失败视为学习机会而非惩罚对象
- 尊重不同观点和建设性异议
- 以身作则，承认自己的错误和不确定性

**消除创新障碍**:
- 减少官僚主义和不必要的审批
- 打破"一直都是这样做的"思维定式
- 挑战现状和假设
- 消除对尝试新方法的恐惧

**2. 建立创新流程和实践**

**结构化创新活动**:
- 定期头脑风暴会议
- 创新工作坊和黑客马拉松
- 创新挑战赛
- 跨职能创新小组

**时间和空间**:
- 分配专门的创新时间（如谷歌的20%时间）
- 创建物理或虚拟的创新空间
- 允许自主探索和实验

**创新方法论**:
- 设计思维（Design Thinking）
- 精益创业（Lean Startup）
- 敏捷开发（Agile Development）
- 快速原型和MVP（最小可行产品）

**3. 培养创新能力和思维**

**技能发展**:
- 创造性思维培训
- 问题解决技巧
- 设计思维工作坊
- 跨领域学习机会

**多样性和包容性**:
- 构建多元化团队
- 鼓励不同背景和观点
- 促进跨部门合作
- 寻求外部视角和灵感

**好奇心和学习文化**:
- 鼓励持续学习和探索
- 分享行业趋势和新技术
- 建立学习资源库
- 举办知识分享会议

**4. 领导力和管理实践**

**创新领导力**:
- 明确创新的战略重要性
- 为创新提供资源和支持
- 容忍模糊性和不确定性
- 平衡短期结果和长期创新

**目标设定**:
- 将创新纳入团队和个人目标
- 设定挑战性但可实现的创新指标
- 平衡效率目标和创新目标

**决策过程**:
- 基于证据而非层级做决策
- 鼓励实验和测试假设
- 采用快速决策和迭代方法

**5. 认可和奖励创新**

**激励机制**:
- 认可和庆祝创新尝试，而非仅仅成功
- 建立创新奖励计划
- 将创新纳入绩效评估
- 提供创新实施的资源

**分享成功故事**:
- 宣传创新案例和成功
- 分享学习和见解
- 创建创新展示平台

**6. 衡量和评估创新**

**创新指标**:
- 创新尝试数量
- 实施的创新想法比例
- 创新对业务的影响
- 团队参与度和多样性

**反馈循环**:
- 定期评估创新文化
- 收集团队反馈
- 持续改进创新流程

**7. 实际案例**

"在我领导的产品开发团队中，我实施了多项措施来培养创新文化：

首先，我们引入了'创新星期五'，团队成员可以将20%的时间用于探索新想法。为了确保这不仅仅是口号，我亲自参与并展示了我的创新项目，同时确保团队成员不会因为参与创新活动而被其他工作压力所淹没。

其次，我们建立了'快速实验'框架，简化了测试新想法的流程。任何团队成员都可以提出实验提案，只需要一页纸的计划和明确的学习目标。我们为这些实验分配了专门的预算和资源。

第三，我们改变了对失败的态度。我开始在团队会议上分享'有价值的失败'，讨论我们从失败中学到的经验。我们还创建了'失败墙'，团队成员可以分享他们的尝试和学习。

最后，我们将创新纳入绩效评估，不仅看结果，还看过程和学习。

这些措施在18个月内带来了显著变化：团队提出的新想法增加了200%，其中30%被实施到产品中，客户满意度提高了25%，团队参与度提高了40%。最重要的是，团队成员开始主动挑战现状，提出改进建议，创新成为了团队DNA的一部分。"`,
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