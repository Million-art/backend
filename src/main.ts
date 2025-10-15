import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';
  const FRONTEND_URL = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: NODE_ENV === 'production' ? [FRONTEND_URL] : [FRONTEND_URL, 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Swagger setup (only in development)
  if (NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Maraki Backend API')
      .setDescription('API documentation for the Maraki Backend Service')
      .setVersion('1.0.0')
      .addTag('users', 'User management operations')
      .addTag('quizzes', 'Quiz management operations')
      .addTag('materials', 'Material management operations')
      .addServer('http://localhost:3000', 'Development server')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'Maraki Backend API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
      },
    });
  }

  // Root response middleware
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/' && req.method === 'GET') {
      return res.json({ 
        message: 'Maraki Backend API',
        version: '1.0.0',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  await app.listen(PORT);
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
}
bootstrap();
