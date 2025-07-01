import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')))

// API 路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AI Interview Assistant'
  })
})

// SPA 路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`🚀 AI智能面试助手服务器运行在 http://localhost:${port}`)
  console.log('📱 应用已准备就绪')
})