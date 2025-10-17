import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.usecase';
import { GetAllUsersUseCase } from '../../application/use-cases/users/get-all-users-usecase';
import { GetUserUseCase } from '../../application/use-cases/users/get-user-usecase';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user-usecase';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.usecase';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserMapper } from '../dto/mappers/user.mapper';
import { UserResponseDto } from '../dto/user/user-response.dto';
import { JwtAuthGuard } from '../../../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/auth/guards/roles.guard';
import { RequireRoles } from '../../../shared/auth/decorators/roles.decorator';
import { Roles } from '../../domain/interfaces/enums/user.enum';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  async create(@Body() dto: CreateUserDto, @Request() req: any): Promise<UserResponseDto> {
    const adminName = req.user?.name || 'System Administrator';
    const user = await this.createUserUseCase.execute(dto, adminName);
    return UserMapper.toResponseDto(user);
  }

  @Get()
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return UserMapper.toResponseDtoList(users);
  }

  @Get(':id')
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    if (!user) {
      // Throw 404 if user not found
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return UserMapper.toResponseDto(user);
  }

  @Put(':id')
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute({ id, ...dto });
    return UserMapper.toResponseDto(user);
  }

  @Delete(':id')
  @RequireRoles(Roles.SUPERADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
