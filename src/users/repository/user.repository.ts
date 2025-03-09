import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  private userRepository: Repository<User>;
  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async create(userDto: CreateUserDto) {
    const findUserByEmail = await this.findUserByEmail(userDto.email);

    if (!findUserByEmail) {
      const userCreate = this.userRepository.create(userDto);
      await this.userRepository.save(userCreate);
      return;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findById(id);

    await this.userRepository.update(id, updateUserDto);

    return await this.findById(id);
  }

  async findUserByEmail(criteria: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: criteria,
      },
    });

    if (user) {
      throw new ConflictException('User Exists');
    }

    return false;
  }

  async findById(criteria: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: criteria,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async delete(id: number) {
    await this.userRepository.findOne({
      where: {
        id,
      },
    });

    await this.userRepository.delete(id);
  }
}
