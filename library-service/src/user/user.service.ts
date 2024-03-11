import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  HttpStatus
} from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from "./model/user.create.dto";
import { UpdatePasswordDto } from "./model/user.update.dto";
import { User } from "./model/user.entity";

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  
  findAll(): User[] {
    return this.users.map(({ password, ...user }) => user);
  }
  
  findById(id: string): User {
    const user: User = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  create(createUserDto: CreateUserDto): User {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }
  
  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): User {
    const user: User = this.findById(id);
    if (updatePasswordDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    return user;
  }
  
  remove(id: string): HttpStatus {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
    return HttpStatus.CREATED;
  }
}
