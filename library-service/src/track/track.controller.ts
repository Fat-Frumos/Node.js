import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus, NotFoundException,
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
  findById(@Param('id') id: string): Track {
    const track = this.tracksService.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }
  
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createTrackDto: CreateTrackDto): Track {
    const track = this.tracksService.create(createTrackDto);
    if (!track) {
      throw new BadRequestException('Failed to create track');
    }
    return track;
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto): Track {
    const track = this.tracksService.update(id, updateTrackDto);
    if (!track) {
      throw new BadRequestException('Failed to update track');
    }
    return track;
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  remove(@Param('id') id: string): HttpStatus {
    const status = this.tracksService.remove(id);
    if (status !== HttpStatus.NO_CONTENT) {
      throw new BadRequestException('Failed to delete track');
    }
    return status;
  }
}
