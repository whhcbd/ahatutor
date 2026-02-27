import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('maxHttpBufferSize', 52428800);
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });

  app.setGlobalPrefix('api');

  const frontendPort = process.env.FRONTEND_PORT || '5173';
  app.enableCors({
    origin: [
      `http://localhost:${frontendPort}`,
      `http://127.0.0.1:${frontendPort}`,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Last-Event-ID, Cache-Control',
    exposedHeaders: 'Content-Type, Cache-Control, Last-Event-ID',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

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
