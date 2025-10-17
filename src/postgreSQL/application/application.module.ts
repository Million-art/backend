import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/users/create-user.usecase';
import { GetUserUseCase } from './use-cases/users/get-user-usecase';
import { GetAllUsersUseCase } from './use-cases/users/get-all-users-usecase';
import { DeleteUserUseCase } from './use-cases/users/delete-user.usecase';
import { UpdateUserUseCase } from './use-cases/users/update-user-usecase';
import { CreateQuizUseCase } from './use-cases/quize/create-quiz.usecase';
import { GetQuizUseCase } from './use-cases/quize/get-quiz.usecase';
import { GetAllQuizzesUseCase } from './use-cases/quize/get-all-quizzes-usecase';
import { DeleteQuizUseCase } from './use-cases/quize/delete-quiz.usecase';
import { UpdateQuizUseCase } from './use-cases/quize/update-quiz.usecase';
import { ActivateQuizUseCase } from './use-cases/quize/activate-quiz.usecase';
import { DeactivateQuizUseCase } from './use-cases/quize/deactivate-quiz.usecase';
import { CreateMaterialUseCase } from './use-cases/materials/create-material.usecase';
import { GetMaterialUseCase } from './use-cases/materials/get-material.usecase';
import { GetAllMaterialsUseCase } from './use-cases/materials/get-all-materials.usecase';
import { GetMaterialsWithFiltersUseCase } from './use-cases/materials/get-materials-with-filters.usecase';
import { DeleteMaterialUseCase } from './use-cases/materials/delete-material.usecase';
import { UpdateMaterialUseCase } from './use-cases/materials/update-material.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SharedModule } from '../../shared/shared.module';
import { EmailModule } from '../../shared/email/email.module';
 
@Module({
  imports: [InfrastructureModule, SharedModule, EmailModule],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    CreateQuizUseCase,
    GetQuizUseCase,
    GetAllQuizzesUseCase,
    DeleteQuizUseCase,
    UpdateQuizUseCase,
    ActivateQuizUseCase,
    DeactivateQuizUseCase,
    CreateMaterialUseCase,
    GetMaterialUseCase,
    GetAllMaterialsUseCase,
    GetMaterialsWithFiltersUseCase,
    DeleteMaterialUseCase,
    UpdateMaterialUseCase,
    
  ],
  exports: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    CreateQuizUseCase,
    GetQuizUseCase,
    GetAllQuizzesUseCase,
    DeleteQuizUseCase,
    UpdateQuizUseCase,
    ActivateQuizUseCase,
    DeactivateQuizUseCase,
    CreateMaterialUseCase,
    GetMaterialUseCase,
    GetAllMaterialsUseCase,
    GetMaterialsWithFiltersUseCase,
    DeleteMaterialUseCase,
    UpdateMaterialUseCase,
  ],
})
export class ApplicationModule {}
