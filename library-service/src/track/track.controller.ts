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
import { UpdateTrackDto } from "./model/track.update.dto";
import { CreateTrackDto } from "./model/track.create.dto";
import { TrackService } from "./track.service";
import { Track } from "./model/track.entity";

@Controller('track')
export class TrackController {
  constructor(private readonly tracksService: TrackService) {}
  
  @Get()
  findAll(): Track[] {
    return this.tracksService.findAll();
  }
  
  @Get(':id')
  findBy(@Param('id') id: string): Track {
    return this.tracksService.findById(id);
  }
  
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createTrackDto: CreateTrackDto): Track {
    return this.tracksService.create(createTrackDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() updateTrackDto: UpdateTrackDto): Track {
    return this.tracksService.update(id, updateTrackDto);
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  remove(@Param('id') id: string): HttpStatus {
    return this.tracksService.remove(id);
  }
}
