import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PostgresModule } from './postgreSQL/postgres.module';
import { MongoModule } from './mongoDB/mongodb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3000),
        FRONTEND_URL: Joi.string().default('http://localhost:5173'),
        MONGO_URI: Joi.string().required(), // MongoDB connection for students
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('24h'),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().optional(),
        RESEND_API_KEY: Joi.string().required(),
        FROM_EMAIL: Joi.string().default('Maraki <noreply@techsphareet.com>'),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        // Payment Provider Configurations (only Telegram Stars for now)
        // Future payment provider configurations will be added here when needed
        // CHAPA_API_KEY: Joi.string().optional(),
        // CHAPA_BASE_URL: Joi.string().default('https://api.chapa.co/v1'),
        // TELE_BIRR_API_KEY: Joi.string().optional(),
        // TELE_BIRR_BASE_URL: Joi.string().default('https://api.telebirr.com/v1'),
        // TON_API_KEY: Joi.string().optional(),
        // TON_BASE_URL: Joi.string().default('https://toncenter.com/api/v2'),
        // TON_WALLET_ADDRESS: Joi.string().optional(),
        // STRIPE_SECRET_KEY: Joi.string().optional(),
        // STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
        // PAYPAL_CLIENT_ID: Joi.string().optional(),
        // PAYPAL_CLIENT_SECRET: Joi.string().optional(),
        BACKEND_URL: Joi.string().default('http://localhost:3000'),
      }),
    }),
    PostgresModule,  // Admin functionality (PostgreSQL)
    MongoModule,     // Student functionality (MongoDB)
  ],
})
export class AppModule {}
