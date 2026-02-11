import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api');

  // 启用 CORS
  const frontendPort = process.env.FRONTEND_PORT || '5173';
  app.enableCors({
    origin: [
      `http://localhost:${frontendPort}`,
      `http://127.0.0.1:${frontendPort}`,
      `http://localhost:5173`,
      `http://127.0.0.1:5173`,
      `http://localhost:5174`,
      `http://localhost:5175`,
      `http://localhost:5176`,
      `http://localhost:5177`,
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('AhaTutor API')
    .setDescription('遗传学可视化交互解答平台 API')
    .setVersion('0.1.0')
    .addApiKey(
      { type: 'apiKey', name: 'Authorization', in: 'header' },
      'api-key',
    )
    .addTag('auth', '认证相关')
    .addTag('rag', 'RAG 检索相关')
    .addTag('llm', 'LLM 对话相关')
    .addTag('agent', 'Agent 服务相关')
    .addTag('quiz', '题目相关')
    .addTag('mistake', '错题相关')
    .addTag('report', '学情报告相关')
    .addTag('graph', '知识图谱相关')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
    🚀 AhaTutor Backend API is running!
    📝 API Documentation: http://localhost:${port}/api/docs
    🌐 Server URL: http://localhost:${port}
  `);
}

bootstrap();
