import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { SharedModule } from './shared/shared.module';
import { User, UserSchema } from './infrastructure/schemas/user.schema';
import { Payment, PaymentSchema } from './infrastructure/schemas/payment.schema';
import { Conversation, ConversationSchema } from './infrastructure/schemas/conversation.schema';
import { Quiz, QuizSchema } from './infrastructure/schemas/quiz.schema';
import { Material, MaterialSchema } from './infrastructure/schemas/material.schema';
import { ChapaProvider } from './providers/chapa.provider';

@Module({
  imports: [
    // Load and validate environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        FRONTEND_URL: Joi.string().default('http://localhost:5173'),
        MONGO_URI: Joi.string().required(),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().optional(),
        CHAPA_API_KEY: Joi.string().required(),
        CHAPA_BASE_URL: Joi.string().default('https://api.chapa.co/v1'),
      }),
    }),

    // Mongo connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // Mongo schemas
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),

      // Application layers
      SharedModule,
      ApplicationModule,
      PresentationModule,
  ],
  providers: [ChapaProvider],
  exports: [MongooseModule],
})
export class AppModule {}
