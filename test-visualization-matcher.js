const http = require('http');

const API_BASE = 'http://localhost:3001';

async function testAPI(endpoint, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n========================================');
  console.log('  开始测试可视化工具匹配功能');
  console.log('========================================\n');

  // 测试1: 获取所有可用工具
  console.log('\n【测试1】获取所有可用工具');
  console.log('----------------------------------------');
  try {
    const tools = await testAPI('/agent/visualize/tools', 'GET');
    console.log('✅ 成功获取工具列表');
    console.log(`   工具总数: ${tools.total}`);
    console.log('   前5个工具:');
    tools.tools.slice(0, 5).forEach(tool => {
      console.log(`   - ${tool.templateId} (${tool.category})`);
    });
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试2: 按类别获取工具 - 核心工具
  console.log('\n【测试2】按类别获取工具 - 核心工具');
  console.log('----------------------------------------');
  try {
    const coreTools = await testAPI('/agent/visualize/tools/category/核心工具', 'GET');
    console.log('✅ 成功获取核心工具');
    console.log(`   数量: ${coreTools.count}`);
    coreTools.tools.forEach(tool => {
      console.log(`   - ${tool.templateId}`);
    });
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试3: 按类别获取工具 - 重要方法
  console.log('\n【测试3】按类别获取工具 - 重要方法');
  console.log('----------------------------------------');
  try {
    const importantTools = await testAPI('/agent/visualize/tools/category/重要方法', 'GET');
    console.log('✅ 成功获取重要方法');
    console.log(`   数量: ${importantTools.count}`);
    importantTools.tools.forEach(tool => {
      console.log(`   - ${tool.templateId}`);
    });
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试4: 庞氏方格匹配
  console.log('\n【测试4】工具匹配 - 庞氏方格');
  console.log('----------------------------------------');
  try {
    const match1 = await testAPI('/agent/visualize/match-tool', 'POST', {
      question: 'Aa x Aa 杂交的后代基因型比例是多少？帮我画个庞氏方格图',
      userLevel: 'intermediate'
    });
    console.log('✅ 成功匹配');
    console.log(`   推荐工具: ${match1.result.toolId}`);
    console.log(`   置信度: ${match1.result.confidence.toFixed(2)}`);
    console.log(`   触发A2UI: ${match1.result.shouldTriggerA2UI}`);
    console.log(`   推理: ${match1.result.intentAnalysis.reasoning}`);
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试5: 系谱图匹配
  console.log('\n【测试5】工具匹配 - 系谱图');
  console.log('----------------------------------------');
  try {
    const match2 = await testAPI('/agent/visualize/match-tool', 'POST', {
      question: '这个家系图中，显性遗传还是隐性遗传？帮我分析一下',
      userLevel: 'beginner'
    });
    console.log('✅ 成功匹配');
    console.log(`   推荐工具: ${match2.result.toolId}`);
    console.log(`   置信度: ${match2.result.confidence.toFixed(2)}`);
    console.log(`   触发A2UI: ${match2.result.shouldTriggerA2UI}`);
    console.log(`   关键词: [${match2.result.intentAnalysis.keywords.join(', ')}]`);
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试6: 三点测交匹配
  console.log('\n【测试6】工具匹配 - 三点测交');
  console.log('----------------------------------------');
  try {
    const match3 = await testAPI('/agent/visualize/match-tool', 'POST', {
      question: '用三点测交方法定位这三个基因的顺序和距离',
      concept: '连锁遗传',
      userLevel: 'advanced'
    });
    console.log('✅ 成功匹配');
    console.log(`   推荐工具: ${match3.result.toolId}`);
    console.log(`   置信度: ${match3.result.confidence.toFixed(2)}`);
    console.log(`   触发A2UI: ${match3.result.shouldTriggerA2UI}`);
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试7: 卡方检验匹配
  console.log('\n【测试7】工具匹配 - 卡方检验');
  console.log('----------------------------------------');
  try {
    const match4 = await testAPI('/agent/visualize/match-tool', 'POST', {
      question: '实际观察数据是100个显性、50个隐性，这符合1:1的孟德尔比例吗？用卡方检验验证一下',
      concept: '概率统计'
    });
    console.log('✅ 成功匹配');
    console.log(`   推荐工具: ${match4.result.toolId}`);
    console.log(`   置信度: ${match4.result.confidence.toFixed(2)}`);
    console.log(`   触发A2UI: ${match4.result.shouldTriggerA2UI}`);
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试8: 无可视化需求的纯文本问题
  console.log('\n【测试8】工具匹配 - 无可视化需求');
  console.log('----------------------------------------');
  try {
    const match5 = await testAPI('/agent/visualize/match-tool', 'POST', {
      question: '什么是DNA？'
    });
    console.log('✅ 成功分析');
    console.log(`   是否匹配: ${match5.result.matched}`);
    console.log(`   需要可视化: ${match5.result.intentAnalysis.needsVisualization}`);
    console.log(`   置信度: ${match5.result.confidence.toFixed(2)}`);
    console.log(`   触发A2UI: ${match5.result.shouldTriggerA2UI}`);
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  // 测试9: 细菌接合匹配
  console.log('\n【测试9】工具匹配 - 细菌接合');
  console.log('----------------------------------------');
  try {
    const match6 = await testAPI('/agent/visualize/match-tool', 'POST', {
      question: '用中断杂交实验作图，显示基因转移的时间顺序',
      concept: '细菌遗传'
    });
    console.log('✅ 成功匹配');
    console.log(`   推荐工具: ${match6.result.toolId}`);
    console.log(`   置信度: ${match6.result.confidence.toFixed(2)}`);
    console.log(`   触发A2UI: ${match6.result.shouldTriggerA2UI}`);
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }

  console.log('\n========================================');
  console.log('  测试完成！');
  console.log('========================================\n');
}

runTests().catch(console.error);
