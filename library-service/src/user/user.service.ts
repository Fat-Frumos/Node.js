import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./model/user.create.dto";
import { UpdatePasswordDto } from "./model/user.update.dto";
import { User } from "./model/user.entity";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  
  findAll(): User[] {
    return this.users;
  }
  
  findOne(id: string): User {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  
  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Omit<User, 'password'> {
    const user = this.findOne(id);
    if (updatePasswordDto.oldPassword !== user.password) {
      throw new HttpException('Old password is incorrect', HttpStatus.FORBIDDEN);
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  remove(id: string): HttpStatus  {
    if (!uuidValidate(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.users.splice(index, 1);
    return HttpStatus.NO_CONTENT;
  }
}
