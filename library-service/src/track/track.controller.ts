import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  Post,
  Put, UsePipes, ValidationPipe
} from "@nestjs/common";
import { TrackDto } from "./model/track.dto";
import { TrackService } from "./track.service";
import { Track } from "./model/track.entity";

@Controller('track')
export class TrackController {
  constructor(
    private readonly service: TrackService) {}
  
  @Get()
  findAll(): Track[] {
    return this.service.findAll();
  }
  
  @Get(':id')
  findBy(@Param('id') id: string): Track {
    return this.service.findById(id);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  create(@Body() dto: TrackDto): void {
    return this.service.create(dto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() dto: TrackDto) {
    return this.service.update(id, dto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    return this.service.remove(id);
  }
}
