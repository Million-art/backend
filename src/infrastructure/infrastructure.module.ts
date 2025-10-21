import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { Material, MaterialSchema } from './schemas/material.schema';
import { UserRepositoryImpl } from './repository/user.repository';
import { QuizRepository } from './repository/quiz.repository';
import { MaterialRepository } from './repository/material.repository';
import type { UserRepository } from '../domain/ports/user.repository';
import type { QuizRepository as IQuizRepository } from '../domain/ports/quiz.repository';
import type { MaterialRepository as IMaterialRepository } from '../domain/ports/material.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'QuizRepository',
      useClass: QuizRepository,
    },
    {
      provide: 'MaterialRepository',
      useClass: MaterialRepository,
    },
  ],
  exports: ['UserRepository', 'QuizRepository', 'MaterialRepository'],
})
export class InfrastructureModule {}
