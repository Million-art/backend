import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/user/create-user.usecase';
import { GetUserUseCase } from './use-cases/user/get-user.usecase';
import { UpdateUserUseCase } from './use-cases/user/update-user.usecase';
import { UpgradeUserUseCase } from './use-cases/user/upgrade-user.usecase';
import { ConsumeTokensUseCase } from './use-cases/user/consume-tokens.usecase';
import { GetAllQuizzesUseCase } from './use-cases/quiz/get-all-quizzes.usecase';
import { GetQuizByIdUseCase } from './use-cases/quiz/get-quiz-by-id.usecase';
import { GetQuizQuestionsUseCase } from './use-cases/quiz/get-quiz-questions.usecase';
import { SubmitQuizAttemptUseCase } from './use-cases/quiz/submit-quiz-attempt.usecase';
import { GetAllMaterialsUseCase } from './use-cases/material/get-all-materials.usecase';
import { GetMaterialByIdUseCase } from './use-cases/material/get-material-by-id.usecase';
import { ViewMaterialUseCase } from './use-cases/material/view-material.usecase';
import { GetCategoriesUseCase } from './use-cases/material/get-categories.usecase';
import { GetTypesUseCase } from './use-cases/material/get-types.usecase';
import { GetDifficultiesUseCase } from './use-cases/material/get-difficulties.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    // User use cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    UpgradeUserUseCase,
    ConsumeTokensUseCase,
    // Quiz use cases
    GetAllQuizzesUseCase,
    GetQuizByIdUseCase,
    GetQuizQuestionsUseCase,
    SubmitQuizAttemptUseCase,
    // Material use cases
    GetAllMaterialsUseCase,
    GetMaterialByIdUseCase,
    ViewMaterialUseCase,
    GetCategoriesUseCase,
    GetTypesUseCase,
    GetDifficultiesUseCase,
  ],
  exports: [
    // User use cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    UpgradeUserUseCase,
    ConsumeTokensUseCase,
    // Quiz use cases
    GetAllQuizzesUseCase,
    GetQuizByIdUseCase,
    GetQuizQuestionsUseCase,
    SubmitQuizAttemptUseCase,
    // Material use cases
    GetAllMaterialsUseCase,
    GetMaterialByIdUseCase,
    ViewMaterialUseCase,
    GetCategoriesUseCase,
    GetTypesUseCase,
    GetDifficultiesUseCase,
  ],
})
export class ApplicationModule {}
