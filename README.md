# AI智能面试助手

一个基于React和Vite构建的现代化AI面试准备平台，帮助求职者提升面试技能和表现。

## ✨ 功能特性

- 🤖 **AI模拟面试** - 智能AI面试官，真实面试场景模拟
- 📚 **海量题库** - 分类练习，涵盖各行业各岗位
- 📊 **数据分析** - 详细的面试表现分析和改进建议
- 🎯 **个性化推荐** - 基于表现的针对性建议
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代化UI** - 基于Tailwind CSS的精美界面

## 🚀 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **动画库**: Framer Motion
- **图标库**: Lucide React
- **路由**: React Router DOM
- **语音识别**: React Speech Kit
- **Markdown渲染**: React Markdown

## 📦 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 启动生产服务器

```bash
npm start
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   └── Layout.jsx      # 布局组件
├── pages/              # 页面组件
│   ├── Home.jsx        # 首页
│   ├── Interview.jsx   # 面试页面
│   ├── Practice.jsx    # 练习页面
│   ├── Analytics.jsx   # 分析页面
│   ├── Profile.jsx     # 个人中心
│   └── NotFound.jsx    # 404页面
├── App.jsx             # 主应用组件
├── main.jsx           # 应用入口
└── index.css          # 全局样式
```

## 🎯 核心功能

### 1. AI模拟面试
- 真实面试环境模拟
- 智能问题生成
- 实时录音录像
- 面试进度跟踪

### 2. 题库练习
- 分类题库浏览
- 搜索和筛选功能
- 难度等级标识
- 用户评分系统

### 3. 数据分析
- 面试表现统计
- 技能分析雷达图
- 历史记录查看
- 改进建议生成

### 4. 个人中心
- 用户信息管理
- 应用设置配置
- 通知偏好设置
- 隐私控制选项

## 🔧 开发指南

### 代码规范

项目使用ESLint进行代码规范检查，主要规则：

- 使用ES6+语法
- 组件使用函数式组件和Hooks
- 遵循React最佳实践
- 保持代码简洁和可读性

### 样式指南

- 使用Tailwind CSS工具类
- 响应式设计优先
- 保持设计系统一致性
- 注重用户体验和可访问性

### 组件开发

- 组件应该是纯函数
- 使用TypeScript类型检查（可选）
- 编写可复用的组件
- 遵循单一职责原则

## 🚀 部署

### Netlify部署

1. 构建项目：`npm run build`
2. 将`dist`目录部署到Netlify
3. 配置重定向规则支持SPA路由

### 其他平台

项目支持部署到任何静态文件托管平台：

- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3

## 📈 性能优化

- 代码分割和懒加载
- 图片优化和压缩
- 缓存策略配置
- Bundle大小分析

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目地址: [GitHub Repository](https://github.com/your-username/ai-interview-assistant)
- 问题反馈: [Issues](https://github.com/your-username/ai-interview-assistant/issues)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！