import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../domain/ports/user.repository';
import { UserModel } from '../models/user.model';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      passwordExpiresAt: user.passwordExpiresAt,
      isTemporaryPassword: user.isTemporaryPassword,
      inviteToken: user.inviteToken,
      tokenExpiresAt: user.tokenExpiresAt,
      role: user.role,
      isActive: user.isActive,
    });
    const saveNewUser = await this.userRepository.save(newUser);
    return new UserEntity(
      saveNewUser.id,
      saveNewUser.name,
      saveNewUser.email,
      saveNewUser.role,
      saveNewUser.isActive,
      saveNewUser.password,
      saveNewUser.passwordExpiresAt,
      saveNewUser.isTemporaryPassword,
      saveNewUser.inviteToken,
      saveNewUser.tokenExpiresAt,
      saveNewUser.createdAt,
      saveNewUser.updatedAt,
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const ormUser = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!ormUser) return null;

    return new UserEntity(
      ormUser.id,
      ormUser.name,
      ormUser.email,
      ormUser.role,
      ormUser.isActive,
      ormUser.password,
      ormUser.passwordExpiresAt,
      ormUser.isTemporaryPassword,
      ormUser.inviteToken,
      ormUser.tokenExpiresAt,
      ormUser.createdAt,
      ormUser.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const ormUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!ormUser) return null;
    return new UserEntity(
      ormUser.id,
      ormUser.name,
      ormUser.email,
      ormUser.role,
      ormUser.isActive,
      ormUser.password,
      ormUser.passwordExpiresAt,
      ormUser.isTemporaryPassword,
      ormUser.inviteToken,
      ormUser.tokenExpiresAt,
      ormUser.createdAt,
      ormUser.updatedAt,
    );
  }

  async findByToken(token: string): Promise<UserEntity | null> {
    const ormUser = await this.userRepository.findOne({
      where: { inviteToken: token },
    });
    if (!ormUser) return null;
    return new UserEntity(
      ormUser.id,
      ormUser.name,
      ormUser.email,
      ormUser.role,
      ormUser.isActive,
      ormUser.password,
      ormUser.passwordExpiresAt,
      ormUser.isTemporaryPassword,
      ormUser.inviteToken,
      ormUser.tokenExpiresAt,
      ormUser.createdAt,
      ormUser.updatedAt,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const ormUsers = await this.userRepository.find({
      where: { isActive: true },
    });
    return ormUsers.map(
      (user) =>
        new UserEntity(
          user.id,
          user.name,
          user.email,
          user.role,
          user.isActive,
          user.password,
          user.passwordExpiresAt,
          user.isTemporaryPassword,
          user.inviteToken,
          user.tokenExpiresAt,
          user.createdAt,
          user.updatedAt,
        ),
    );
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      user.isActive = false;
      await this.userRepository.save(user);
    }
  }
}
