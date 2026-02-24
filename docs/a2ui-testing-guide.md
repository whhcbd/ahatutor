# A2UI 功能测试指南

本指南提供了全面的 A2UI（Agent-to-User Interface）功能测试方法，包括前端单元测试、后端 API 测试、端到端测试和手动测试。

## 测试环境准备

### 1. 依赖安装

```bash
# 根目录安装所有依赖
cd c:\trae_coding\AhaTutor
pnpm install

# 或单独安装前端依赖
cd c:\trae_coding\AhaTutor\src\frontend
npm install

# 单独安装后端依赖
cd c:\trae_coding\AhaTutor\src\backend
npm install
```

### 2. 环境配置

- 前端：复制 `.env.example` 为 `.env` 并配置必要的环境变量
- 后端：确保数据库和服务配置正确

## 一、前端单元测试

### 1. 测试框架

前端使用 **Vitest** 作为测试框架，已在 `package.json` 中配置。

### 2. 测试目录结构

建议创建以下测试目录结构：

```
src/frontend/src/
├── components/A2UI/
│   └── __tests__/          # A2UI 组件测试
├── utils/
│   └── __tests__/           # 工具函数测试
├── stores/
│   └── __tests__/           # 状态管理测试
└── __tests__/               # 集成测试
```

### 3. 测试用例示例

#### 3.1 A2UIRenderer 组件测试

```typescript
// src/components/A2UI/__tests__/A2UIRenderer.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { A2UIRenderer } from '../A2UIRenderer';
import type { A2UIPayload } from '@shared/types/a2ui.types';

describe('A2UIRenderer', () => {
  const mockPayload: A2UIPayload = {
    type: 'card',
    id: 'test-card',
    children: [
      {
        type: 'ahatutor-punnett-square',
        id: 'test-punnett',
        properties: {
          data: {
            parent1: { allele1: 'A', allele2: 'a' },
            parent2: { allele1: 'A', allele2: 'a' }
          }
        }
      }
    ]
  };

  it('should render A2UI payload correctly', () => {
    render(<A2UIRenderer payload={mockPayload} />);
    expect(screen.getByTestId('a2ui-renderer')).toBeInTheDocument();
  });

  it('should handle empty payload', () => {
    const emptyPayload: A2UIPayload = {
      type: 'card',
      id: 'empty-card',
      children: []
    };
    render(<A2UIRenderer payload={emptyPayload} />);
    expect(screen.getByTestId('a2ui-renderer')).toBeInTheDocument();
  });

  it('should handle component errors with fallback', () => {
    const errorPayload: A2UIPayload = {
      type: 'card',
      id: 'error-card',
      children: [
        {
          type: 'invalid-component-type',
          id: 'invalid-component',
          properties: {}
        }
      ]
    };
    render(<A2UIRenderer payload={errorPayload} />);
    expect(screen.getByText('Component failed to render')).toBeInTheDocument();
  });
});
```

#### 3.2 工具函数测试

```typescript
// src/utils/__tests__/a2ui-parser-enhanced.test.ts
import { describe, it, expect } from 'vitest';
import { parseA2UIDirectives } from '../a2ui-parser-enhanced';

describe('A2UI Parser', () => {
  it('should parse Punnett square directive', () => {
    const text = '[A2UI-PUNNETT_SQUARE]\nparent1=A,a\nparent2=A,a\n[/A2UI-PUNNETT_SQUARE]';
    const result = parseA2UIDirectives(text);
    expect(result.directives).toHaveLength(1);
    expect(result.directives[0].type).toBe('PUNNETT_SQUARE');
  });

  it('should parse inheritance path directive', () => {
    const text = '[A2UI-INHERITANCE_PATH]\ntraits=eye_color,blood_type\npath=grandparent->parent->child\n[/A2UI-INHERITANCE_PATH]';
    const result = parseA2UIDirectives(text);
    expect(result.directives).toHaveLength(1);
    expect(result.directives[0].type).toBe('INHERITANCE_PATH');
  });

  it('should handle multiple directives', () => {
    const text = '[A2UI-PUNNETT_SQUARE]\nparent1=A,a\nparent2=A,a\n[/A2UI-PUNNETT_SQUARE]\n\n[A2UI-PEDIGREE_CHART]\nfamily=A,B,C,D\nrelationships=A->B,A->C,B->D\n[/A2UI-PEDIGREE_CHART]';
    const result = parseA2UIDirectives(text);
    expect(result.directives).toHaveLength(2);
  });
});
```

#### 3.3 状态管理测试

```typescript
// src/stores/__tests__/a2uiStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useA2UIStore } from '../a2uiStore';
import type { A2UIPayload } from '@shared/types/a2ui.types';

describe('A2UI Store', () => {
  beforeEach(() => {
    // 重置 store 状态
    const { reset } = useA2UIStore.getState();
    reset();
  });

  it('should initialize with default state', () => {
    const state = useA2UIStore.getState();
    expect(state.currentPayload).toBeNull();
    expect(state.isStreaming).toBe(false);
    expect(state.registeredComponents).toEqual({});
  });

  it('should set current payload', () => {
    const testPayload: A2UIPayload = {
      type: 'card',
      id: 'test',
      children: []
    };
    
    const { setCurrentPayload } = useA2UIStore.getState();
    setCurrentPayload(testPayload);
    
    const state = useA2UIStore.getState();
    expect(state.currentPayload).toEqual(testPayload);
  });

  it('should register components', () => {
    const { registerComponent } = useA2UIStore.getState();
    registerComponent('test-component');
    
    const state = useA2UIStore.getState();
    expect(state.registeredComponents['test-component']).toBe(true);
  });
});
```

### 4. 运行测试

```bash
# 运行所有前端测试
cd c:\trae_coding\AhaTutor\src\frontend
npm test

# 运行特定测试文件
npm test src/components/A2UI/__tests__/A2UIRenderer.test.tsx

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

## 二、后端 API 测试

### 1. 测试框架

后端使用 **NestJS 内置测试工具**，基于 Jest。

### 2. 测试目录结构

建议在后端创建以下测试目录：

```
src/backend/src/
├── modules/agents/
│   └── __tests__/          # Agent 模块测试
└── __tests__/               # 集成测试
```

### 3. 测试用例示例

#### 3.1 A2UI 适配器服务测试

```typescript
// src/modules/agents/__tests__/a2ui-adapter.service.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { A2UIAdapterService } from '../a2ui-adapter.service';
import type { A2UIPayload } from '@shared/types/a2ui.types';

describe('A2UIAdapterService', () => {
  let service: A2UIAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [A2UIAdapterService],
    }).compile();

    service = module.get<A2UIAdapterService>(A2UIAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate A2UI payload for Punnett square', async () => {
    const payload = await service.generateA2UI('punnett_square_v1', {
      parent1: { allele1: 'A', allele2: 'a' },
      parent2: { allele1: 'A', allele2: 'a' }
    });
    
    expect(payload).toBeDefined();
    expect(payload.type).toBe('card');
    expect(payload.children).toHaveLength(1);
    expect(payload.children[0].type).toBe('ahatutor-punnett-square');
  });

  it('should handle invalid template', async () => {
    await expect(
      service.generateA2UI('invalid_template', {})
    ).rejects.toThrow('Template not found');
  });

  it('should validate data against schema', async () => {
    await expect(
      service.generateA2UI('punnett_square_v1', {})
    ).rejects.toThrow('Data validation failed');
  });
});
```

#### 3.2 API 端点测试

```typescript
// src/modules/agents/__tests__/agent.controller.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from '../agent.controller';
import { A2UIAdapterService } from '../a2ui-adapter.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Agent Controller - A2UI', () => {
  let app: INestApplication;
  let a2uiService: A2UIAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: A2UIAdapterService,
          useValue: {
            generateA2UI: jest.fn().mockResolvedValue({
              type: 'card',
              id: 'test',
              children: []
            })
          }
        }
      ],
    }).compile();

    app = module.createNestApplication();
    a2uiService = module.get<A2UIAdapterService>(A2UIAdapterService);
    await app.init();
  });

  it('should generate A2UI via API', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/agent/a2ui/generate')
      .send({
        templateId: 'punnett_square_v1',
        data: {
          parent1: { allele1: 'A', allele2: 'a' },
          parent2: { allele1: 'A', allele2: 'a' }
        }
      })
      .expect(200);

    expect(response.body).toHaveProperty('type', 'card');
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### 4. 运行后端测试

```bash
# 运行后端测试
cd c:\trae_coding\AhaTutor\src\backend
npm test

# 运行特定测试文件
npm test src/modules/agents/__tests__/a2ui-adapter.service.test.ts

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

## 三、端到端测试

### 1. 测试工具

建议使用 **Playwright** 或 **Cypress** 进行端到端测试。

### 2. Playwright 安装

```bash
# 安装 Playwright
cd c:\trae_coding\AhaTutor\src\frontend
npm install -D @playwright/test

# 安装浏览器
npx playwright install
```

### 3. 测试配置

创建 `playwright.config.ts` 文件：

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  reporter: [['html']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### 4. 测试用例示例

```typescript
// e2e/a2ui-flow.test.ts
import { test, expect } from '@playwright/test';

test('A2UI conversation flow', async ({ page }) => {
  // 导航到聊天页面
  await page.goto('/');
  
  // 输入问题
  await page.fill('textarea[id="chat-input"]', 'What is a Punnett square?');
  await page.click('button[id="send-button"]');
  
  // 等待回复
  await page.waitForSelector('.a2ui-renderer', { timeout: 30000 });
  
  // 验证 A2UI 组件渲染
  const renderer = await page.locator('.a2ui-renderer');
  await expect(renderer).toBeVisible();
  
  // 验证 Punnett square 组件存在
  const punnettSquare = await page.locator('[data-testid="punnett-square"]');
  await expect(punnettSquare).toBeVisible();
  
  // 测试流式输出
  await page.fill('textarea[id="chat-input"]', 'Show me a complex genetic cross');
  await page.click('button[id="send-button"]');
  
  // 等待流式内容
  await page.waitForFunction(() => {
    return document.querySelector('.streaming-content');
  }, { timeout: 20000 });
});
```

### 5. 运行端到端测试

```bash
# 运行 Playwright 测试
npx playwright test

# 运行特定测试文件
npx playwright test e2e/a2ui-flow.test.ts

# 查看测试报告
npx playwright show-report
```

## 四、手动测试

### 1. 启动服务

```bash
# 启动后端服务
cd c:\trae_coding\AhaTutor\src\backend
npm run start:dev

# 启动前端开发服务器
cd c:\trae_coding\AhaTutor\src\frontend
npm run dev
```

### 2. 测试场景

#### 场景 1: 基础 A2UI 渲染

1. **测试步骤**：
   - 访问前端应用（通常为 http://localhost:5173）
   - 进入聊天页面
   - 发送包含 A2UI 指令的消息，例如：
     ```
     [A2UI-PUNNETT_SQUARE]
     parent1=A,a
     parent2=A,a
     [/A2UI-PUNNETT_SQUARE]
     ```

2. **验证点**：
   - Punnett square 组件是否正确渲染
   - 组件交互是否正常
   - 响应速度是否合理

#### 场景 2: 流式输出测试

1. **测试步骤**：
   - 发送需要复杂计算的问题，例如：
     "Show me the inheritance pattern for cystic fibrosis with both parents as carriers"

2. **验证点**：
   - 是否显示流式加载动画
   - 内容是否逐步显示
   - 最终是否完整渲染 A2UI 组件

#### 场景 3: 错误处理测试

1. **测试步骤**：
   - 发送无效的 A2UI 指令
   - 网络中断测试（断开网络后发送请求）

2. **验证点**：
   - 是否显示友好的错误信息
   - 是否提供重试选项
   - 应用是否保持稳定

#### 场景 4: 降级策略测试

1. **测试步骤**：
   - 在不同浏览器中测试
   - 禁用 JavaScript 测试
   - 模拟低性能设备

2. **验证点**：
   - 是否根据浏览器能力降级
   - 核心功能是否仍然可用
   - 降级体验是否合理

### 3. 浏览器兼容性测试

测试 A2UI 在以下浏览器中的表现：

- ✅ Chrome (最新版本)
- ✅ Firefox (最新版本)
- ✅ Safari (最新版本)
- ✅ Edge (最新版本)
- ⚠️ IE11 (基本功能)

### 4. 性能测试

1. **测试工具**：
   - Chrome DevTools Performance 面板
   - Lighthouse
   - WebPageTest

2. **测试指标**：
   - 首次渲染时间
   - 组件渲染性能
   - 内存使用情况
   - 响应时间

## 五、测试覆盖率建议

### 核心功能测试

| 功能模块 | 测试类型 | 优先级 |
|---------|---------|--------|
| A2UIRenderer | 单元测试 | 高 |
| A2UIAdapterService | 单元测试 + API 测试 | 高 |
| a2ui-parser | 单元测试 | 高 |
| streamingProcessor | 单元测试 | 中 |
| fallbackStrategy | 单元测试 | 中 |
| browserCompatibility | 单元测试 | 中 |
| AIConversationFlow | 集成测试 | 高 |
| a2uiStore | 单元测试 | 高 |

### 集成测试场景

1. **完整 A2UI 流程**：前端输入 → 后端处理 → 前端渲染
2. **流式输出**：长内容的流式处理
3. **错误恢复**：组件失败后的恢复机制
4. **性能边界**：大量组件的渲染性能

## 六、CI/CD 集成

### GitHub Actions 配置示例

```yaml
# .github/workflows/a2ui-tests.yml
name: A2UI Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd src/frontend && npm install
      - name: Run frontend tests
        run: cd src/frontend && npm test

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd src/backend && npm install
      - name: Run backend tests
        run: cd src/backend && npm test
```

## 七、测试数据

### 1. 测试模板数据

使用 `a2ui-templates.data.ts` 中定义的模板进行测试：

- `punnett_square_v1` - 基础 Punnett 方格
- `inheritance_path_v1` - 遗传路径
- `pedigree_chart_v1` - 系谱图
- `chromosome_behavior_v1` - 染色体行为
- `dna_replication_v1` - DNA 复制
- `transcription_v1` - 转录
- `translation_v1` - 翻译
- `gene_structure_v1` - 基因结构
- `crispr_v1` - CRISPR
- `trisomy_v1` - 三体综合征
- `mitosis_v1` - 有丝分裂
- `allele_v1` - 等位基因

### 2. 示例测试数据

```typescript
// Punnett Square 测试数据
const punnettTestData = {
  parent1: { allele1: 'A', allele2: 'a' },
  parent2: { allele1: 'A', allele2: 'a' }
};

// 系谱图测试数据
const pedigreeTestData = {
  individuals: [
    { id: 'I1', gender: 'male', affected: false },
    { id: 'I2', gender: 'female', affected: false },
    { id: 'II1', gender: 'male', affected: true },
    { id: 'II2', gender: 'female', affected: false }
  ],
  relationships: [
    { parent1: 'I1', parent2: 'I2', children: ['II1', 'II2'] }
  ]
};
```

## 八、常见问题与排查

### 1. 前端测试问题

| 问题 | 可能原因 | 解决方案 |
|------|---------|----------|
| 组件渲染失败 | 依赖未正确模拟 | 使用 `jest.mock` 模拟依赖 |
| 状态管理测试失败 | Store 未重置 | 在 beforeEach 中调用 reset() |
| 异步测试超时 | API 调用未模拟 | 使用 `mockResolvedValue` 模拟异步操作 |

### 2. 后端测试问题

| 问题 | 可能原因 | 解决方案 |
|------|---------|----------|
| 数据库连接失败 | 测试环境配置 | 使用内存数据库或测试配置 |
| 服务依赖失败 | 依赖未注入 | 使用 `useValue` 或 `useFactory` 模拟 |
| 认证失败 | JWT 配置 | 跳过认证或使用测试 token |

### 3. 端到端测试问题

| 问题 | 可能原因 | 解决方案 |
|------|---------|----------|
| 测试超时 | 服务启动慢 | 增加超时时间或优化启动 |
| 选择器未找到 | DOM 结构变化 | 使用更稳定的选择器 |
| 环境不一致 | 配置差异 | 使用统一的测试环境 |

## 九、测试最佳实践

1. **测试隔离**：每个测试用例应独立运行
2. **模拟依赖**：使用 mock 减少外部依赖
3. **测试边界**：测试正常、异常和边界情况
4. **持续集成**：集成到 CI/CD 流程
5. **性能监控**：定期运行性能测试
6. **用户体验测试**：关注实际用户体验
7. **可维护性**：测试代码应易于理解和维护

## 十、总结

A2UI 功能测试应覆盖：

- **单元测试**：验证各个模块的独立功能
- **集成测试**：验证模块间的协作
- **端到端测试**：验证完整用户流程
- **手动测试**：验证用户体验和边界情况
- **性能测试**：确保良好的性能表现
- **兼容性测试**：确保跨浏览器兼容性

通过全面的测试策略，可以确保 A2UI 功能的稳定性、可靠性和良好的用户体验。

---

**测试是质量保证的关键**，建议建立自动化测试流程，定期运行测试套件，及时发现和解决问题，确保 A2UI 功能的持续改进。