import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 优化构建输出
function optimizeBuild() {
  const distPath = path.join(__dirname, '../dist')
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ 构建目录不存在，请先运行 npm run build')
    return
  }

  console.log('🔧 开始优化构建输出...')

  // 分析构建文件大小
  function analyzeFiles(dir, prefix = '') {
    const files = fs.readdirSync(dir)
    let totalSize = 0

    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        totalSize += analyzeFiles(filePath, prefix + file + '/')
      } else {
        const sizeKB = (stat.size / 1024).toFixed(2)
        console.log(`📄 ${prefix}${file}: ${sizeKB} KB`)
        totalSize += stat.size
      }
    })

    return totalSize
  }

  const totalSize = analyzeFiles(distPath)
  console.log(`📊 总构建大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

  // 生成构建报告
  const report = {
    timestamp: new Date().toISOString(),
    totalSize: totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    files: []
  }

  fs.writeFileSync(
    path.join(distPath, 'build-report.json'),
    JSON.stringify(report, null, 2)
  )

  console.log('✅ 构建优化完成！')
}

optimizeBuild()