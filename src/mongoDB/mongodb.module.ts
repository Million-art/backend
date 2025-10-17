import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationModule } from '../postgreSQL/application/application.module';
import { User, UserSchema } from './schemas/user.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { StudentService } from './services/student.service';
import { PaymentService } from './services/payment.service';
import { StudentController } from './controllers/student.controller';
import { PaymentController } from './controllers/payment.controller';
import { StudentContentController } from './controllers/student-content.controller';
import { TelegramStarsProvider } from './providers/telegram-stars.provider';

import { ConversationSchema, Conversation } from './schemas/conversation.schema';

@Module({
  imports: [
    ApplicationModule, // Import PostgreSQL application module for use cases
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
      controllers: [StudentController, PaymentController, StudentContentController],
  providers: [
    StudentService,
    PaymentService,
    TelegramStarsProvider,

  ],
  exports: [StudentService, PaymentService, MongooseModule],
})
export class MongoModule {}
