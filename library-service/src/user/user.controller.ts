import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put, UsePipes, ValidationPipe
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./model/user.create.dto";
import { UpdatePasswordDto } from "./model/user.update.dto";
import { User } from "./model/user.entity";

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  
  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }
  
  @Get(':id')
  findBy(@Param('id') id: string): User {
    return this.usersService.findById(id);
  }
  
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  updatePassword(@Param('id') id: string,
                 @Body() updatePasswordDto: UpdatePasswordDto): User {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  remove(@Param('id') id: string): HttpStatus {
    return this.usersService.remove(id);
  }
}
