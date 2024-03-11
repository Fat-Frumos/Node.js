import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus,
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
  constructor(private readonly userService: UserService) {}
  
  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string){
   return this.userService.findOne(id);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() updatePasswordDto: UpdatePasswordDto): void {
    this.userService.updatePassword(id, updatePasswordDto);
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.userService.remove(id);
  }
}
