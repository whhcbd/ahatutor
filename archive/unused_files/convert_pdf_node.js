const { MinerUService } = require('./src/backend/src/modules/mineru/mineru.service');
const { ConfigService } = require('@nestjs/config');

// 创建配置服务
const configService = new ConfigService();

// 创建 MinerU 服务实例
const minerUService = new MinerUService(configService);

// PDF 文件路径
const pdfPath = 'C:\\Users\\16244\\MinerU\\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf';

// 输出目录
const outputDir = 'C:\\trae_coding\\newfile';

async function convertPDF() {
  console.log('🚀 开始 PDF 转换流程...');
  console.log(`📄 PDF 文件路径: ${pdfPath}`);
  console.log(`📁 输出目录: ${outputDir}`);
  
  try {
    // 检查 MinerU 服务健康状态
    console.log('🔍 检查 MinerU 服务健康状态...');
    const healthStatus = await minerUService.healthCheck();
    console.log(`✅ MinerU 服务状态: ${healthStatus.healthy ? '健康' : '不健康'}`);
    if (!healthStatus.healthy) {
      console.error(`❌ MinerU 服务健康检查失败: ${healthStatus.error}`);
      return;
    }
    
    // 解析 PDF 文件
    console.log('📤 正在上传并解析 PDF 文件...');
    console.log('⏰ 这可能需要几分钟时间，请耐心等待...');
    
    const result = await minerUService.parsePDF(pdfPath, {
      timeout: 3600000, // 1 小时超时
      outputPath: outputDir,
      keepZip: false
    });
    
    console.log('✅ PDF 转换成功！');
    console.log(`📦 生成的 Markdown 文件: ${result.metadata.filename}.md`);
    console.log(`🖼️  提取的图片数量: ${result.images.length}`);
    console.log(`📄 提取的布局图片数量: ${result.layouts.length}`);
    console.log(`📁 输出目录: ${outputDir}`);
    
    // 显示输出目录中的文件
    console.log('\n📁 输出目录文件列表:');
    const fs = require('fs');
    const path = require('path');
    
    function listFiles(dir, indent = 0) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const prefix = '  '.repeat(indent);
        if (stats.isDirectory()) {
          console.log(`${prefix}📁 ${file}/`);
          listFiles(fullPath, indent + 1);
        } else {
          const size = (stats.size / 1024).toFixed(2);
          console.log(`${prefix}📄 ${file} (${size} KB)`);
        }
      });
    }
    
    listFiles(outputDir);
    
  } catch (error) {
    console.error('❌ PDF 转换失败:', error);
  }
}

// 运行转换函数
convertPDF();
